#!/usr/bin/env node
// UserPromptSubmit hook: detect what KIND of project this repo is (by reading
// package.json / app.json, not by hardcoded monorepo paths) and inject a hint
// telling the orchestrator which specialist owns it. Works in any JS/TS repo:
// standalone Expo/RN app, React web app, Node backend, or a monorepo with a mix.
// Silent only when there is no JS/TS project to classify.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readJSON(p) { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } }
function depsOf(pkg) { return { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) }; }
function hasAny(deps, names) { return names.some((n) => n in deps); }

function expoSignal(dir) {
  const a = readJSON(join(dir, "app.json"));
  if (a && (a.expo || a.name)) return true;
  return existsSync(join(dir, "app.config.js")) || existsSync(join(dir, "app.config.ts")) || existsSync(join(dir, "eas.json"));
}

function classify(dir) {
  const pkg = readJSON(join(dir, "package.json"));
  if (!pkg) return null;
  const deps = depsOf(pkg);
  if ("expo" in deps || expoSignal(dir)) return { agent: "mobile", label: "Expo mobile app" };
  if ("react-native" in deps) return { agent: "mobile", label: "React Native (bare) app" };
  if (hasAny(deps, ["react-dom", "next", "vite", "@remix-run/react", "gatsby"]) || "react" in deps)
    return { agent: "frontend", label: "React web app" };
  if (hasAny(deps, ["express", "fastify", "@nestjs/core", "koa", "hono", "@hono/node-server", "apollo-server", "@trpc/server"]))
    return { agent: "backend", label: "Node backend" };
  return { agent: "backend", label: "Node/TS project" }; // default: non-UI JS/TS
}

// 1) Monorepo packages under apps/ packages/ services/
const results = [];
for (const group of ["apps", "packages", "services"]) {
  const g = join(root, group);
  if (!existsSync(g)) continue;
  let entries = [];
  try { entries = readdirSync(g, { withFileTypes: true }); } catch { continue; }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = join(g, e.name);
    if (!existsSync(join(dir, "package.json"))) continue;
    const c = classify(dir);
    if (c) results.push({ path: `${group}/${e.name}`, ...c });
  }
}

// 2) Standalone repo (no sub-packages found) -> classify the root
if (results.length === 0 && existsSync(join(root, "package.json"))) {
  const c = classify(root);
  if (c) results.push({ path: ".", ...c });
}

if (results.length === 0) process.exit(0); // not a JS/TS project -> stay quiet

if (results.length === 1 && results[0].path === ".") {
  const r = results[0];
  console.log(`[dev-agent-team] Detected: ${r.label} -> route work to @${r.agent}.`);
} else {
  const lines = results.map((r) => `${r.path} -> @${r.agent} (${r.label})`).join("; ");
  console.log(`[dev-agent-team] Detected packages: ${lines}. Route each area to its specialist by path.`);
}
