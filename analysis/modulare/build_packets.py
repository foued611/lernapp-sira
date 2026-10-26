#!/usr/bin/env python3
"""Beschreibungs-Pakete für die größten Knoten bauen.

Wählt die N Knoten mit den meisten Zeilen (Standard 40) aus topology.json und schreibt je
Knoten ein Paket nach analysis/modulare/packets/<nr>.txt. Ein Paket enthält:
Kopf (Id, Art, Datei, Zeilen, Domäne), Verbindungen (ein- und ausgehend), und die ersten
150 Zeilen des Quelltextes. Der Agent liest nur sein Paket, nichts anderes.

Aufruf: python3 build_packets.py [N]
"""
import json
import os
import re
import sys

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.realpath(os.path.join(OUT_DIR, "..", ".."))
ROOT = os.path.realpath(os.path.join(REPO, "legacy", "modulare"))
LINES = 150
SECRET_RE = re.compile(r"(?i)(api[_-]?key|secret|token|password|passwd|bearer)\s*[:=]\s*['\"][^'\"]{4,}['\"]")


def mask(text):
    # Keine Zugangsdaten an den Agenten weitergeben: Werte vor dem Lesen unkenntlich machen.
    return SECRET_RE.sub(lambda m: m.group(0).split(m.group(1))[0] + m.group(1) + " = '<maskiert>'", text)


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 40
    topo = json.load(open(os.path.join(OUT_DIR, "topology.json"), encoding="utf-8"))
    leaves = []

    def walk(node):
        if node.get("kind") in ("module", "screen"):
            leaves.append(node)
        for child in node.get("children", []):
            walk(child)

    walk(topo["root"])
    chosen = sorted(leaves, key=lambda x: (-x.get("loc", 0), x["id"]))[:n]
    out_dir = os.path.join(OUT_DIR, "packets")
    os.makedirs(out_dir, exist_ok=True)
    index = {}
    for i, leaf in enumerate(chosen, 1):
        nid = leaf["id"]
        outs = [f"{e['kind']} -> {e['target']}" for e in topo["edges"] if e["source"] == nid]
        ins = [f"{e['source']} -> {e['kind']}" for e in topo["edges"] if e["target"] == nid]
        src_path = os.path.join(ROOT, leaf["file"])
        excerpt = ""
        if os.path.isfile(src_path):
            with open(src_path, encoding="utf-8", errors="replace") as fh:
                lines = fh.read().splitlines()[:LINES]
            excerpt = mask("\n".join(f"{k + 1:4}  {line}" for k, line in enumerate(lines)))
        head = (
            f"Knoten: {leaf['name']}\n"
            f"Id: {nid}\n"
            f"Art: {leaf['kind']}\n"
            f"Datei: {leaf['file']}\n"
            f"Zeilen: {leaf.get('loc', 0)}\n"
        )
        body = (
            "Ausgehend (dieser Knoten nutzt):\n  " + ("\n  ".join(outs) or "keine") + "\n\n"
            "Eingehend (diese Knoten nutzen ihn):\n  " + ("\n  ".join(ins) or "keine") + "\n\n"
            "Quelltext (erste 150 Zeilen, Zugangsdaten maskiert):\n" + excerpt + "\n"
        )
        path = os.path.join(out_dir, f"{i:02d}.txt")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(head + "\n" + body)
        index[nid] = os.path.relpath(path, REPO)
    with open(os.path.join(out_dir, "index.json"), "w", encoding="utf-8") as fh:
        json.dump(index, fh, ensure_ascii=False, indent=2)
    print(f"{len(chosen)} Pakete geschrieben in {os.path.relpath(out_dir, REPO)}")
    for nid, p in index.items():
        print(f"  {nid}  ->  {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
