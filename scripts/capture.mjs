#!/usr/bin/env node
// Stop hook: capture a lightweight signal so /self-reflect has something
// concrete to distill. Silent unless the project has been initialized.
import { appendFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const kbDir = join(process.cwd(), "knowledge");
if (!existsSync(kbDir)) process.exit(0);

let last = "no tracked changes";
try {
  const d = execSync("git diff --stat HEAD 2>/dev/null || true", { encoding: "utf8" }).trim();
  if (d) last = d.split("\n").slice(-1)[0];
} catch {}
const rec = { type: "signal", date: new Date().toISOString().slice(0, 10), ts: new Date().toISOString(), changed: last, note: "session ended — run /self-reflect to distill learnings" };
try { appendFileSync(join(kbDir, "_inbox.jsonl"), JSON.stringify(rec) + "\n"); } catch {}
process.exit(0);
