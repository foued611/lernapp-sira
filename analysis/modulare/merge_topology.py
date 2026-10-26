#!/usr/bin/env python3
"""Beschreibungen, Beobachtungen und Abläufe in topology.json einfügen.

Liest descriptions/<nr>.txt (nur geprüfte Texte), packets/index.json (Zuordnung Knoten-Id zu Paket)
und schreibt topology.json neu. Beobachtungen werden aus den Zahlen der Topologie gebildet,
damit nichts von Hand abgeschrieben wird.
"""
import glob
import json
import os
import sys

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
TOPO = os.path.join(OUT_DIR, "topology.json")


def load_descriptions():
    index = json.load(open(os.path.join(OUT_DIR, "packets", "index.json"), encoding="utf-8"))
    by_packet = {os.path.basename(p): nid for nid, p in index.items()}
    out = {}
    for path in sorted(glob.glob(os.path.join(OUT_DIR, "descriptions", "*.txt"))):
        nr = os.path.basename(path)
        if nr not in {f"{k:02d}.txt" for k in range(1, 100)}:
            continue
        pk = f"{os.path.splitext(nr)[0]}.txt"
        if pk in by_packet:
            out[by_packet[pk]] = open(path, encoding="utf-8").read().strip()
    return out


def walk_leaves(node, fn):
    for child in node.get("children", []):
        if child.get("kind") in ("module", "screen", "datastore", "job"):
            fn(child)
        else:
            walk_leaves(child, fn)


def observations(topo):
    edges = topo["edges"]
    inb, outb = {}, {}
    for e in edges:
        inb[e["target"]] = inb.get(e["target"], 0) + 1
        outb[e["source"]] = outb.get(e["source"], 0) + 1
    top_in = sorted(inb.items(), key=lambda x: -x[1])[:3]
    writers = [e["source"] for e in edges if e["kind"] == "write"]
    dyn_open = [e for e in topo.get("observations", []) if "dynamisch" in e]
    obs = [
        f"Kopplungsschwerpunkt: core/js/profile.js hat {inb.get('core/js/profile.js', 0)} eingehende Kanten. "
        "Änderungen an XP, Niveau oder Serie wirken auf Rundenmotor, Blitz, Ansichten und Startseite.",
        f"Ein Schreibweg für alle Daten: core/js/db.js ist der einzige Zugang zu IndexedDB und localStorage "
        f"({len(writers)} Schreibkanten). Fehler dort treffen jede App.",
        f"Eingangstor zur Konfiguration: core/js/appconfig.js hat {inb.get('core/js/appconfig.js', 0)} eingehende Kanten "
        "und verbindet Inhalt, Regeln und Anzeige. Wer neue Inhaltsarten einführt, ändert diese Stelle.",
        "Extraktionskandidat: Rundenbausteine (Auswahl, Eingabe, Zuordnung) stehen in mehreren apps/*/builders.js "
        "in ähnlicher Form. Eine gemeinsame Fabrik unter core/js/ würde die Apps entlasten.",
        "Nicht aufgelöste Ziele: tests/helpers.js enthält einen dynamischen import() mit Template-String und den "
        "Paketnamen jsdom ohne Pfad. Im Produktivcode gibt es keinen solchen Aufruf. Die Lücke liegt nur im Test-Graphen.",
        "Inhalte-API: ds:content-api ist nur über das Meta-Tag lw-content-api in core/js/boot.js verdrahtet. "
        "Im Repo gibt es keine Gegenstelle; der Aufbau einer Datenbank-API liegt außerhalb dieses Codes.",
    ]
    return obs


FLOWS = [
    {
        "name": "Eine Übungsrunde spielen",
        "persona": "Lernende oder Lernender der 7. Klasse",
        "description": "Ein Kind öffnet eine Seite, beantwortet Fragen und sieht danach Punkte und Sterne.",
        "steps": [
            {"label": "Startseite öffnen", "nodes": ["scr:index.html", "dashboard.js", "registry.js"]},
            {"label": "App starten und Inhalte laden", "nodes": ["scr:apps/mathe/index.html", "apps/mathe/main.js", "core/js/boot.js", "ds:content:mathe"]},
            {"label": "Frage beantworten, Runde auswerten", "nodes": ["core/js/shell.js", "core/js/quiz.js", "core/js/qtypes.js"]},
            {"label": "Punkte und Stand speichern", "nodes": ["core/js/profile.js", "core/js/store.js", "core/js/db.js", "ds:indexeddb"]},
        ],
    },
    {
        "name": "Theorie lesen und Mini-Check machen",
        "persona": "Lernende oder Lernender, die oder der eine Seite zum ersten Mal lernt",
        "description": "Vor der Übung liest das Kind die Erklärung, betrachtet ein Bild und beantwortet eine kurze Kontrollfrage.",
        "steps": [
            {"label": "Lektion öffnen", "nodes": ["core/js/shell.js", "core/js/theory.js", "core/js/lesson.js"]},
            {"label": "Bild der Seite ansehen", "nodes": ["apps/mathe/diagrams.js", "core/js/svg.js"]},
        ],
    },
    {
        "name": "Lernstand sichern",
        "persona": "Elternteil, das den Lernstand sichert",
        "description": "Ein Elternteil lädt den Fortschritt als Datei herunter, damit er nicht verloren geht.",
        "steps": [
            {"label": "Sicherung erstellen", "nodes": ["core/js/shell.js", "core/js/views/backup.js", "core/js/db.js"]},
            {"label": "Daten aus dem Browser lesen", "nodes": ["ds:indexeddb"]},
        ],
    },
]


def main():
    topo = json.load(open(TOPO, encoding="utf-8"))
    descs = load_descriptions()
    known = set()
    walk_leaves(topo["root"], lambda leaf: known.add(leaf["id"]))

    applied = 0

    def put(leaf):
        nonlocal applied
        if leaf["id"] in descs:
            leaf["description"] = descs[leaf["id"]]
            applied += 1

    walk_leaves(topo["root"], put)

    missing = [nid for nid in descs if nid not in known]
    if missing:
        print(f"WARNUNG: Beschreibungen ohne Knoten: {missing}")

    # Abläufe: alle Knoten-Ids müssen existieren
    for flow in FLOWS:
        for step in flow["steps"]:
            bad = [n for n in step["nodes"] if n not in known]
            if bad:
                print(f"WARNUNG: Ablauf '{flow['name']}' verweist auf unbekannte Knoten: {bad}")
                return 1
    topo["flows"] = FLOWS
    topo["observations"] = observations(topo)

    with open(TOPO, "w", encoding="utf-8") as fh:
        json.dump(topo, fh, ensure_ascii=False, indent=2)
    print(f"Beschreibungen eingefügt: {applied}")
    print(f"Abläufe: {len(FLOWS)}  Beobachtungen: {len(topo['observations'])}")
    for o in topo["observations"]:
        print(f"  - {o[:90]}...")
    return 0


if __name__ == "__main__":
    sys.exit(main())
