#!/usr/bin/env node
// Seed the project-side pieces of dev-agent-team. Never overwrites existing files.
import { mkdirSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const cwd = process.cwd();
const here = dirname(fileURLToPath(import.meta.url)); // <plugin>/scripts
const created = [], skipped = [];

function write(rel, content) {
  const p = join(cwd, rel);
  if (existsSync(p)) { skipped.push(rel); return; }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  created.push(rel);
}

const patterns = [
  {"type":"must","scope":["**/*.ts","**/*.tsx"],"keywords":["typescript","types"],"text":"No `any`. Every public function and component prop is fully typed.","source":"seed","date":"2026-07-08"},
  {"type":"pattern","scope":["apps/web/**","packages/ui/**"],"keywords":["frontend","react","components"],"text":"Keep web components presentational; move data fetching into hooks or a data layer.","source":"seed","date":"2026-07-08"},
  {"type":"must","scope":["apps/mobile/**","mobile/**"],"keywords":["mobile","react-native"],"text":"Use RN primitives (View/Text/Pressable/FlatList); no DOM or window APIs, and all text inside <Text>.","source":"seed","date":"2026-07-08"},
  {"type":"pattern","scope":["apps/mobile/**","mobile/**","app/**"],"keywords":["mobile","expo","router"],"text":"On Expo, install deps with `npx expo install`, prefer expo-* modules, and use Expo Router (file-based routes) if the project already does.","source":"seed","date":"2026-07-08"},
  {"type":"pattern","scope":["services/**","src/api/**"],"keywords":["backend","api","validation"],"text":"Validate input at the route boundary with a schema before any logic runs.","source":"seed","date":"2026-07-08"},
].map((o) => JSON.stringify(o)).join("\n") + "\n";

const gotchas = [
  {"type":"gotcha","scope":["apps/web/**"],"keywords":["frontend","accessibility","a11y"],"text":"Clickable <div>s are not keyboard-accessible; use a real <button>.","source":"seed","date":"2026-07-08"},
  {"type":"gotcha","scope":["apps/mobile/**","mobile/**"],"keywords":["mobile","react-native","performance"],"text":"Rendering large arrays with .map() instead of FlatList causes jank/OOM; virtualize long lists.","source":"seed","date":"2026-07-08"},
  {"type":"gotcha","scope":["apps/mobile/**","mobile/**"],"keywords":["mobile","expo","security","env"],"text":"EXPO_PUBLIC_* env vars are bundled into the client — never put secrets there.","source":"seed","date":"2026-07-08"},
  {"type":"gotcha","scope":["apps/mobile/**","mobile/**"],"keywords":["mobile","expo","build"],"text":"Custom native modules/config plugins do not run in Expo Go and need a dev client / new EAS build; JS-only fixes can ship via EAS Update.","source":"seed","date":"2026-07-08"},
  {"type":"gotcha","scope":["services/**","src/api/**"],"keywords":["backend","errors","security"],"text":"Do not return raw error/stack to clients; log server-side, return a safe message.","source":"seed","date":"2026-07-08"},
].map((o) => JSON.stringify(o)).join("\n") + "\n";

const decisions = [
  {"type":"decision","scope":["**"],"keywords":["architecture","stack"],"text":"Web is React + TS, mobile is React Native + TS, backend is Node + TS. Shared language to ease review and reuse.","source":"seed","date":"2026-07-08"},
].map((o) => JSON.stringify(o)).join("\n") + "\n";

const claudeMd = `# Project instructions

This repo uses the dev-agent-team plugin. General rules:

- **Prime before work.** Relevant facts (MUST FOLLOW / GOTCHAS / PATTERNS / DECISIONS) are injected at session start; re-prime a topic with \`node .claude/scripts/prime.mjs --keywords "<topic>"\`.
- **Route by file path.** Web UI -> \`frontend\`. React Native/mobile -> \`mobile\`. API/server -> \`backend\`. Cross-cutting or multi-part tasks -> \`orchestrator\`, which scans changed files and delegates.
- **Verify, don't trust.** A change is "done" only after \`tester\`/\`security\`/\`reviewer\` pass it against its Definition of Done and checks (typecheck, lint, test) are green.
- **Capture learnings.** End a task with the \`self-reflect\` skill to add patterns/gotchas/decisions to \`knowledge/\`; promote enforced rules with \`node .claude/scripts/promote.mjs "<rule>"\`.
- **Stack:** React + TS (web), React Native + TS (mobile), Node + TS (backend). No \`any\`.

## Monorepo note
Add a nested \`CLAUDE.md\` in each package (e.g. apps/web, apps/mobile, services/api) to give specialists local context and reinforce ownership.
`;

write("knowledge/patterns.jsonl", patterns);
write("knowledge/gotchas.jsonl", gotchas);
write("knowledge/decisions.jsonl", decisions);
write("CLAUDE.md", claudeMd);

// Copy project-local scripts so agents can call `.claude/scripts/*`
for (const f of ["prime.mjs", "scope.mjs", "capture.mjs", "promote.mjs"]) {
  const dest = join(cwd, ".claude", "scripts", f);
  if (existsSync(dest)) { skipped.push(`.claude/scripts/${f}`); continue; }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(join(here, f), dest);
  created.push(`.claude/scripts/${f}`);
}

console.log("dev-agent-team init complete.");
if (created.length) console.log("Created:\n  " + created.join("\n  "));
if (skipped.length) console.log("Kept existing (skipped):\n  " + skipped.join("\n  "));
console.log("\nNext: commit knowledge/ and CLAUDE.md to git. For a monorepo, add nested CLAUDE.md per package.");
