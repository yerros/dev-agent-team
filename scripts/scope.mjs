#!/usr/bin/env node
// UserPromptSubmit hook: detect which package(s) the currently-changed files
// belong to and inject a routing hint so the orchestrator assigns the right
// specialist without having to scan first. Silent when nothing maps.
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

if (!existsSync(join(process.cwd(), "knowledge"))) process.exit(0);

// Path glob (simple prefix/suffix test) -> specialist. Edit to match your repo.
const rules = [
  { test: (f) => /(^|\/)apps\/web\/|(^|\/)packages\/ui\/|(^|\/)src\/web\//.test(f), agent: "frontend" },
  { test: (f) => /(^|\/)apps\/mobile\/|(^|\/)mobile\/|\.native\.tsx?$/.test(f), agent: "mobile" },
  { test: (f) => /(^|\/)services\/|(^|\/)apps\/api\/|(^|\/)src\/(server|api)\//.test(f), agent: "backend" },
];

let files = [];
try {
  files = execSync("git status --porcelain 2>/dev/null || true", { encoding: "utf8" })
    .split("\n").map((l) => l.slice(3).trim()).filter(Boolean);
} catch {}
if (!files.length) process.exit(0);

const hits = new Map(); // agent -> count
for (const f of files) for (const r of rules) if (r.test(f)) hits.set(r.agent, (hits.get(r.agent) || 0) + 1);
if (!hits.size) process.exit(0);

const summary = [...hits.entries()].sort((a, b) => b[1] - a[1]).map(([a, n]) => `${a} (${n} file${n > 1 ? "s" : ""})`).join(", ");
console.log(`[dev-agent-team] Detected changed scope -> suggested specialist(s): ${summary}. Route work accordingly.`);
process.exit(0);
