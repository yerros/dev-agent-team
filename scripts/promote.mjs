#!/usr/bin/env node
// Promote a distilled learning into CLAUDE.md as an enforced rule.
// Usage: node promote.mjs "Always validate request bodies with zod"
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const rule = process.argv.slice(2).join(" ").trim();
if (!rule) { console.error("Usage: node promote.mjs \"<rule text>\""); process.exit(1); }

const p = join(process.cwd(), "CLAUDE.md");
const header = "## Enforced rules (promoted)";
let s = existsSync(p) ? readFileSync(p, "utf8") : "# Project instructions\n";
if (!s.includes(header)) s = s.replace(/\s*$/, "") + `\n\n${header}\n`;
const line = `- ${rule}`;
if (s.includes(line)) { console.log("Already promoted; no change."); process.exit(0); }
s = s.replace(header, `${header}\n${line}`);
writeFileSync(p, s);
console.log(`Promoted to CLAUDE.md: ${rule}`);
