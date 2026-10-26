#!/usr/bin/env python3
"""Prüft Beschreibungen gegen ihr Paket: jede Zahl und jeder Bezeichner (Datei, Funktion, Id) muss im Paket stehen.

Liest descriptions/<nr>.txt und packets/<nr>.txt. Gibt je Knoten OK oder die fehlenden Teile aus.
Aufruf: python3 check_descriptions.py
"""
import glob, os, re, sys

BASE = os.path.dirname(os.path.abspath(__file__))
NUM_RE = re.compile(r"\b\d+\b")
IDENT_RE = re.compile(r"[A-Za-z_]\w*(?:[./]\w+)+|\b[a-z]+[A-Z]\w*\b|\b\w+\(\)")


def idents(text):
    found = set(IDENT_RE.findall(text))
    return {f.rstrip("()") for f in found}


def main():
    bad = 0
    for dpath in sorted(glob.glob(os.path.join(BASE, "descriptions", "*.txt"))):
        nr = os.path.splitext(os.path.basename(dpath))[0]
        ppath = os.path.join(BASE, "packets", f"{nr}.txt")
        desc = open(dpath, encoding="utf-8").read()
        packet = open(ppath, encoding="utf-8").read()
        missing_nums = [n for n in NUM_RE.findall(desc) if n not in packet]
        missing_ids = [i for i in idents(desc) if i not in packet]
        if missing_nums or missing_ids:
            bad += 1
            print(f"{nr}: FEHLT nums={missing_nums} ids={sorted(missing_ids)}")
        else:
            print(f"{nr}: OK")
    print(f"{bad} mit Fehlern")
    return 0


if __name__ == "__main__":
    sys.exit(main())
