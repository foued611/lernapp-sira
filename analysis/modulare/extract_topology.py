#!/usr/bin/env python3
"""Topologie von legacy/modulare extrahieren: Knoten, Kanten, Einstiege, Sackgassen.

Schreibt analysis/modulare/topology.json (ohne Beschreibungen, Abläufe und
Beobachtungen; die kommen in einem zweiten Schritt dazu) und druckt eine Zusammenfassung.

Erkannt werden:
- statische Imports und Re-Exporte (Kanten "call")
- dynamische import() mit festem Pfad (Kanten "dispatch"); Pfade mit ${...} bleiben offen
- HTML-Seiten, die Module laden (<script src>), als Einstiegspunkte
- Datenspeicher: IndexedDB und localStorage im Speicher-Modul, Inhalts-Pakete unter content/,
  die optionale Inhalte-API (Meta-Tag lw-content-api)

Konfiguration liegt im Code: Einstiege aus bootApp({ id }) in apps/*/main.js.
"""
import json
import os
import re
import sys

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.realpath(os.path.join(OUT_DIR, "..", ".."))
ROOT = os.path.realpath(os.path.join(REPO, "legacy", "modulare"))
SKIP = {"node_modules", ".git", "analysis", "legacy", ".remember", "coverage"}

IMPORT_RE = re.compile(r"""(?:import|export)\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]""")
DYN_RE = re.compile(r"""import\(\s*(['"`])([^'"`]+)\1\s*\)""")
SCRIPT_RE = re.compile(r"""<script[^>]*\ssrc=["']([^"']+)["']""")
BOOT_ID_RE = re.compile(r"""bootApp\(\s*\{\s*id:\s*['"]([^'"]+)['"]""")

DOMAIN_OF_CORE = {
    "boot.js": "dom:bootstrap", "content.js": "dom:bootstrap",
    "appconfig.js": "dom:bootstrap", "validate.js": "dom:bootstrap",
    "quiz.js": "dom:rounds", "qtypes.js": "dom:rounds",
    "questions.js": "dom:rounds", "blitz.js": "dom:rounds",
    "profile.js": "dom:rules", "rounds.js": "dom:rules", "rules.js": "dom:rules",
    "db.js": "dom:persistence", "store.js": "dom:persistence",
    "lesson.js": "dom:lessons", "theory.js": "dom:lessons",
    "tracks.js": "dom:lessons", "svg.js": "dom:lessons",
    "ui.js": "dom:shared", "icons.js": "dom:shared", "mascot.js": "dom:shared",
    "confetti.js": "dom:shared", "mathkit.js": "dom:shared",
    "shell.js": "dom:shell",
}
DOMAIN_NAMES = {
    "dom:entry": "Einstieg (Startseite)", "dom:bootstrap": "Start und Inhalte",
    "dom:shell": "Shell und Ansichten", "dom:rounds": "Rundenmotor",
    "dom:rules": "Spielregeln", "dom:persistence": "Speicher",
    "dom:lessons": "Lektionen und Diagramme", "dom:shared": "Gemeinsame Helfer",
    "dom:tests": "Tests und Smoke-Test", "dom:data": "Datenspeicher",
}


def walk(exts):
    found = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP]
        for name in filenames:
            if os.path.splitext(name)[1] in exts:
                full = os.path.join(dirpath, name)
                found.append(os.path.relpath(full, ROOT).replace(os.sep, "/"))
    return sorted(found)


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8", errors="replace") as fh:
        return fh.read()


def strip_comments(text):
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return "\n".join(line for line in text.splitlines() if not line.strip().startswith("//"))


def loc(text):
    return sum(1 for line in text.splitlines() if line.strip())


def domain_of(rel):
    if rel in ("dashboard.js", "registry.js"):
        return "dom:entry"
    if rel.startswith("apps/"):
        return "dom:app:" + rel.split("/")[1]
    if rel.startswith("tests/") or rel.startswith("scripts/"):
        return "dom:tests"
    if rel.startswith("core/js/views/"):
        return "dom:shell"
    return DOMAIN_OF_CORE.get(rel.split("/")[-1], "dom:shared")


def resolve(from_rel, spec, known, bare_ok=False):
    # Im Code sind Pfade nur mit "./" oder "../" relativ. In HTML-Seiten zählt auch "main.js".
    if not (spec.startswith(".") or bare_ok):
        return None
    base = os.path.normpath(os.path.join(os.path.dirname(from_rel), spec)).replace(os.sep, "/")
    for cand in (base, base + ".js", base + ".mjs", base + "/index.js"):
        if cand in known:
            return cand
    return None


def main():
    js = walk({".js", ".mjs"})
    html = walk({".html"})
    known = set(js)
    modules = {}
    for rel in js:
        text = read(rel)
        modules[rel] = {
            "id": rel, "name": rel.split("/")[-1], "kind": "module",
            "language": "javascript", "loc": loc(text), "file": rel,
            "domain": domain_of(rel), "text": text,
        }
    screens = {}
    for rel in html:
        text = read(rel)
        sid = "scr:" + rel
        screens[sid] = {
            "id": sid, "name": rel, "kind": "screen", "language": "html",
            "loc": loc(text), "file": rel,
            "domain": "dom:app:" + rel.split("/")[1] if rel.startswith("apps/") else "dom:entry",
            "text": text,
        }

    edges, unresolved, dynamic_open = [], [], []
    for rel, mod in modules.items():
        code = strip_comments(mod["text"])
        for spec in IMPORT_RE.findall(code):
            tgt = resolve(rel, spec, known)
            if tgt:
                edges.append({"source": rel, "target": tgt, "kind": "call"})
            elif spec.startswith("."):
                unresolved.append(f"{rel}: {spec}")
        for _, spec in DYN_RE.findall(code):
            if "${" in spec:
                dynamic_open.append(rel)
                continue
            tgt = resolve(rel, spec, known)
            if tgt:
                edges.append({"source": rel, "target": tgt, "kind": "dispatch"})
            else:
                unresolved.append(f"{rel}: dynamic {spec}")
    for sid, scr in screens.items():
        for spec in SCRIPT_RE.findall(scr["text"]):
            if spec.startswith("http"):
                continue
            tgt = resolve(scr["file"], spec, known, bare_ok=True)
            if tgt:
                edges.append({"source": sid, "target": tgt, "kind": "call"})

    # Datenspeicher
    datastores = {}
    content_root = os.path.join(ROOT, "content")
    if os.path.isdir(content_root):
        for pkg in sorted(os.listdir(content_root)):
            if os.path.isdir(os.path.join(content_root, pkg)) and not pkg.startswith("."):
                dsid = "ds:content:" + pkg
                datastores[dsid] = {"id": dsid, "name": f"Inhalte: {pkg}", "kind": "datastore",
                                    "file": f"content/{pkg}", "domain": "dom:data"}
    for rel in modules:
        if rel.startswith("apps/") and rel.endswith("/main.js"):
            m = BOOT_ID_RE.search(read(rel))
            if m and ("ds:content:" + m.group(1)) in datastores:
                edges.append({"source": rel, "target": "ds:content:" + m.group(1), "kind": "read"})
    if "core/js/db.js" in modules:
        db_text = read("core/js/db.js")
        if "indexedDB" in db_text:
            datastores["ds:indexeddb"] = {"id": "ds:indexeddb", "name": "IndexedDB lernwerkstatt (docs, log)",
                                          "kind": "datastore", "file": "core/js/db.js", "domain": "dom:data"}
            edges.append({"source": "core/js/db.js", "target": "ds:indexeddb", "kind": "write"})
            edges.append({"source": "core/js/db.js", "target": "ds:indexeddb", "kind": "read"})
        if "localStorage" in db_text:
            datastores["ds:localstorage"] = {"id": "ds:localstorage", "name": "localStorage (Ausweichlösung)",
                                             "kind": "datastore", "file": "core/js/db.js", "domain": "dom:data"}
            edges.append({"source": "core/js/db.js", "target": "ds:localstorage", "kind": "write"})
            edges.append({"source": "core/js/db.js", "target": "ds:localstorage", "kind": "read"})
    if "core/js/boot.js" in modules and "lw-content-api" in read("core/js/boot.js"):
        datastores["ds:content-api"] = {"id": "ds:content-api", "name": "Inhalte-API (optional, Meta lw-content-api)",
                                        "kind": "datastore", "file": "core/js/boot.js", "domain": "dom:data"}
        edges.append({"source": "core/js/boot.js", "target": "ds:content-api", "kind": "read"})

    # Knoten zu Domänen sammeln
    leaves = list(modules.values()) + list(screens.values()) + list(datastores.values())
    for leaf in leaves:
        if leaf.get("domain") and leaf["domain"] not in DOMAIN_NAMES and leaf["domain"].startswith("dom:app:"):
            pass
    domains = {}
    for leaf in leaves:
        dom = leaf["domain"]
        domains.setdefault(dom, []).append(leaf)

    def dom_name(dom):
        if dom.startswith("dom:app:"):
            return "App " + dom.split(":")[-1]
        return DOMAIN_NAMES.get(dom, dom)

    children = []
    for dom in sorted(domains, key=lambda d: (d == "dom:data", d)):
        items = []
        for leaf in sorted(domains[dom], key=lambda x: x["id"]):
            node = {k: v for k, v in leaf.items() if k not in ("text", "domain")}
            items.append(node)
        children.append({"id": dom, "name": dom_name(dom), "kind": "domain", "children": items})

    known_ids = set(modules) | set(screens) | set(datastores)
    edges = [e for e in edges if e["source"] in known_ids and e["target"] in known_ids]
    seen, uniq = set(), []
    for e in edges:
        key = (e["source"], e["target"], e["kind"])
        if key not in seen:
            seen.add(key)
            uniq.append(e)

    inbound = {nid: 0 for nid in known_ids}
    for e in uniq:
        inbound[e["target"]] = inbound.get(e["target"], 0) + 1
    # Einstiege: Seiten, Testdateien und Smoke-Tests (werden von npm test bzw. npm run smoke gestartet)
    entry_points = sorted(screens) + sorted(
        f for f in modules if f.startswith("tests/") or f.endswith("smoke.mjs")
    )
    entry_set = set(entry_points)
    dead = sorted(n for n in modules if inbound.get(n, 0) == 0 and n not in entry_set)

    topo = {
        "system": "lernapp-sira (modulare)",
        "root": {"id": "sys", "name": "lernapp-sira", "kind": "system", "children": children},
        "edges": uniq,
        "entryPoints": entry_points,
        "deadEnds": dead,
        "observations": [],
        "flows": [],
    }
    with open(os.path.join(OUT_DIR, "topology.json"), "w", encoding="utf-8") as fh:
        json.dump(topo, fh, ensure_ascii=False, indent=2)

    by_kind = {}
    for e in uniq:
        by_kind[e["kind"]] = by_kind.get(e["kind"], 0) + 1
    print(f"Module: {len(modules)}  Seiten: {len(screens)}  Datenspeicher: {len(datastores)}")
    print(f"Kanten: {len(uniq)}  nach Art: {by_kind}")
    print(f"Einstiege: {len(entry_points)}  Sackgassen-Kandidaten: {len(dead)}")
    for d in dead:
        print(f"  Sackgasse: {d}")
    print(f"Offene dynamische Aufrufe (Pfad mit ${{...}}): {len(dynamic_open)}")
    for rel in sorted(set(dynamic_open)):
        print(f"  offen: {rel}")
    print(f"Nicht aufgelöste relative Importe: {len(unresolved)}")
    for line in unresolved[:20]:
        print(f"  {line}")
    print(f"wrote {os.path.join(OUT_DIR, 'topology.json')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
