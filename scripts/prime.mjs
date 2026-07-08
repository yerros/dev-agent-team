#!/usr/bin/env node
// Selective knowledge priming. Reads ./knowledge/*.jsonl (in the current
// project) and prints the relevant subset, categorized. Stays silent in
// repos that haven't been initialized with /init.
//
// Usage: node prime.mjs [--keywords "auth jwt mobile"]
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const kbDir = join(process.cwd(), "knowledge");
if (!existsSync(kbDir)) process.exit(0); // not initialized -> stay quiet

const files = ["patterns.jsonl", "gotchas.jsonl", "decisions.jsonl"];
const args = process.argv.slice(2);
const kwIdx = args.indexOf("--keywords");
const keywords = kwIdx !== -1 && args[kwIdx + 1]
  ? args[kwIdx + 1].toLowerCase().split(/\s+/).filter(Boolean) : [];

function load(file) {
  const p = join(kbDir, file);
  if (!existsSync(p)) return [];
  return readFileSync(p, "utf8").split("\n").map((l) => l.trim()).filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
function relevant(e) {
  if (keywords.length === 0) return true;
  const hay = [e.text, ...(e.keywords || []), ...(e.scope || [])].join(" ").toLowerCase();
  return keywords.some((k) => hay.includes(k));
}
const all = files.flatMap(load).filter(relevant);
if (all.length === 0) process.exit(0);
const by = (t) => all.filter((e) => e.type === t);
console.log(`[dev-agent-team] ${all.length} relevant fact(s)` + (keywords.length ? ` for: ${keywords.join(", ")}` : "") + "\n");
for (const [title, items] of [["MUST FOLLOW", by("must")], ["GOTCHAS", by("gotcha")], ["PATTERNS", by("pattern")], ["DECISIONS", by("decision")]]) {
  if (!items.length) continue;
  console.log(`## ${title}`);
  for (const e of items) console.log(`- ${e.text}` + (e.scope?.length ? `  (${e.scope.join(", ")})` : ""));
  console.log("");
}
