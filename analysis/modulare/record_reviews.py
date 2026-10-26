#!/usr/bin/env python3
"""Antworten aus den Pop-ups in RULE_REVIEWS.json und RULE_REVIEWS.md eintragen (nur Eingabe der Person)."""
import json, os, datetime, sys
BASE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(BASE, "RULE_REVIEWS.json")
MAP = {"Richtig": "confirmed", "Falsch oder unerwünscht": "wrong", "Unsicher": "discuss"}
ANSWERS = json.load(open(os.path.join(BASE, "review_answers.json"), encoding="utf-8"))
data = json.load(open(PATH, encoding="utf-8")) if os.path.exists(PATH) else {"system": "modulare", "version": 1, "reviews": {}}
titles = {c["id"]: c["title"] for c in json.load(open(os.path.join(BASE, "review_calls.json"), encoding="utf-8"))}
now = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
for rid, ans in ANSWERS.items():
    verdict = MAP[ans["answer"]]
    data["reviews"][rid] = {"verdict": verdict, "at": now, "title": titles.get(rid, ""), "note": ans.get("note", "")}
json.dump(data, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
rows = sorted(data["reviews"].items(), key=lambda kv: kv[0])
label = {"confirmed": "Richtig", "wrong": "Falsch oder unerwünscht", "discuss": "Unsicher"}
lines = ["# Regel-Prüfungen — modulare", "",
         f"Stand {now}. Die Fachperson hat {len(rows)} Regeln geprüft. Nur Antworten der Person stehen hier.",
         "Regeln mit „Falsch“ oder „Unsicher“ gelten nicht als geklärt. `brief` führt sie als offene Fragen.", "",
         "| Regel | Urteil | Wann | Titel | Notiz |", "|---|---|---|---|---|"]
for rid, r in rows:
    lines.append(f"| {rid} | {label[r['verdict']]} | {r['at'][:16]} | {r['title']} | {r['note']} |")
open(os.path.join(BASE, "RULE_REVIEWS.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
print(f"{len(rows)} Prüfungen gespeichert")
