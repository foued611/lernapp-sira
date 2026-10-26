#!/usr/bin/env python3
"""Drei Mermaid-Dateien aus topology.json schreiben (je unter 40 Kanten).

call-graph.mmd       Domänen-Ebene, Einstiegspunkte hervorgehoben
data-lineage.mmd     Module zu Datenspeichern, Lesen und Schreiben getrennt
critical-path.mmd    Schritte des ersten Ablaufs (keine Laufzeitdaten, daher ohne p50/p99)
"""
import json
import os
import re

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
topo = json.load(open(os.path.join(OUT_DIR, "topology.json"), encoding="utf-8"))
MAX_EDGES = 40


def leaves():
    out = {}

    def walk(node, dom):
        if node.get("kind") == "domain":
            for c in node.get("children", []):
                walk(c, node["id"])
        elif node.get("kind") in ("module", "screen", "datastore"):
            out[node["id"]] = {"name": node["id"], "domain": dom, "kind": node["kind"]}
        else:
            for c in node.get("children", []):
                walk(c, dom)

    walk(topo["root"], None)
    return out


def sid(text):
    return re.sub(r"[^A-Za-z0-9_]", "_", text)


def label(text):
    return text.replace('"', "'")


L = leaves()
dom_names = {c["id"]: c["name"] for c in topo["root"]["children"]}


def call_graph():
    entry = set(topo["entryPoints"])
    pair = {}
    for e in topo["edges"]:
        if e["kind"] not in ("call", "dispatch"):
            continue
        a = L.get(e["source"], {}).get("domain")
        b = L.get(e["target"], {}).get("domain")
        if not a or not b or a == b:
            continue
        pair[(a, b)] = pair.get((a, b), 0) + 1
    top = sorted(pair.items(), key=lambda x: -x[1])[:MAX_EDGES]
    lines = ["graph TD"]
    doms = sorted({d for (a, b), _ in top for d in (a, b)})
    for d in doms:
        lines.append(f'  {sid(d)}["{label(dom_names.get(d, d))}"]')
    for (a, b), n in top:
        lines.append(f"  {sid(a)} -->|{n}| {sid(b)}")
    ep_doms = sorted({L[e]["domain"] for e in entry if e in L and L[e]["domain"] in doms})
    for d in ep_doms:
        lines.append(f"  style {sid(d)} stroke:#cc785c,stroke-width:3px")
    return "\n".join(lines) + "\n", len(top)


def data_lineage():
    lines = ["graph LR"]
    seen = set()
    count = 0
    for e in topo["edges"]:
        if e["kind"] not in ("read", "write"):
            continue
        if count >= MAX_EDGES:
            break
        src = L.get(e["source"], {}).get("name", e["source"])
        tgt = L.get(e["target"], {}).get("name", e["target"])
        key = (sid(e["source"]), sid(e["target"]), e["kind"])
        if key in seen:
            continue
        seen.add(key)
        lines.append(f'  {sid(e["source"])}["{label(src)}"] -->|{e["kind"]}| {sid(e["target"])}[("{label(tgt)}")]')
        count += 1
    return "\n".join(lines) + "\n", count


def critical_path():
    flow = topo["flows"][0]
    lines = ["flowchart TD"]
    prev = None
    for i, step in enumerate(flow["steps"]):
        node = f"s{i}"
        lines.append(f'  {node}["{label(step["label"])}"]')
        if prev:
            lines.append(f"  {prev} --> {node}")
        prev = node
    lines.append(f'  %% Ablauf: {label(flow["name"])}; keine Laufzeitdaten vorhanden, daher ohne p50/p99')
    return "\n".join(lines) + "\n", len(flow["steps"])


cg, n_cg = call_graph()
dl, n_dl = data_lineage()
cp, n_cp = critical_path()
for name, text in [("call-graph.mmd", cg), ("data-lineage.mmd", dl), ("critical-path.mmd", cp)]:
    with open(os.path.join(OUT_DIR, name), "w", encoding="utf-8") as fh:
        fh.write(text)
print(f"call-graph.mmd: {n_cg} Domänenkanten")
print(f"data-lineage.mmd: {n_dl} Kanten zu Datenspeichern")
print(f"critical-path.mmd: {n_cp} Schritte")
