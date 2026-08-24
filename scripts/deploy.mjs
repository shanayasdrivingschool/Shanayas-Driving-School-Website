#!/usr/bin/env node
/**
 * Publish the built site to the `public_html` branch.
 *
 * The live site serves the `public_html` branch, not `main`. `main` holds the
 * source (and, because it is not gitignored, a committed copy of the build
 * output). Editing `main` alone never changes what visitors see — the build has
 * to be mirrored into the deploy worktree and committed on that branch.
 *
 * Pipeline:
 *   preflight -> test -> build -> verify output -> mirror -> commit -> push
 *
 * Usage:
 *   npm run deploy                       full pipeline, pushes both branches
 *   npm run deploy -- --dry-run          show what would change, touch nothing
 *   npm run deploy -- --no-push          build and commit locally, skip push
 *   npm run deploy -- -m "Publish X"     custom deploy commit message
 *   npm run deploy -- --skip-tests       skip vitest (use sparingly)
 *   npm run deploy -- --yes              accept a large deletion count
 *   npm run deploy -- --allow-dirty      deploy with uncommitted changes on main
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync, mkdirSync, copyFileSync, rmSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const argv = process.argv.slice(2);
const has = (...names) => names.some((n) => argv.includes(n));
const valueOf = (...names) => {
  for (const n of names) {
    const i = argv.indexOf(n);
    if (i !== -1 && argv[i + 1]) return argv[i + 1];
  }
  return null;
};

const opts = {
  dryRun: has("--dry-run", "-n"),
  push: !has("--no-push"),
  skipTests: has("--skip-tests"),
  yes: has("--yes", "-y"),
  allowDirty: has("--allow-dirty"),
  message: valueOf("--message", "-m"),
};

/* Deleting more than this many files from the deploy branch in one publish is
   almost always a broken build rather than an intentional removal, so it needs
   an explicit --yes. The one legitimate large deletion is the stale nested
   public_html/ directory, which this threshold deliberately catches once. */
const DELETION_THRESHOLD = 25;

/* A healthy build is far larger than this. The floor exists so a build that
   half-failed can never be mirrored over a working site. */
const MIN_BUILD_FILES = 200;

const C = {
  reset: "\u001b[0m", dim: "\u001b[2m", bold: "\u001b[1m",
  red: "\u001b[31m", green: "\u001b[32m", yellow: "\u001b[33m", blue: "\u001b[34m",
};
let step = 0;
const heading = (msg) => console.log(`\n${C.blue}${C.bold}[${++step}] ${msg}${C.reset}`);
const info = (msg) => console.log(`    ${msg}`);
const ok = (msg) => console.log(`    ${C.green}OK${C.reset} ${msg}`);
const warn = (msg) => console.log(`    ${C.yellow}!${C.reset}  ${msg}`);
const die = (msg, hint) => {
  console.error(`\n${C.red}${C.bold}Deploy stopped.${C.reset} ${msg}`);
  if (hint) console.error(`${C.dim}${hint}${C.reset}`);
  process.exit(1);
};

const git = (args, cwd = repoRoot) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const run = (cmd, args, cwd = repoRoot) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });

/* ---------------------------------------------------------------- preflight */

heading("Preflight");

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") {
  die(
    `You are on '${branch}', not 'main'.`,
    "Deploys are cut from main. Run: git checkout main",
  );
}
ok("on branch main");

/* public_html/ is tracked on main but is build output, and this script rebuilds
   it a few steps from now. Excluding it from the clean check means a rebuilt
   site does not read as "uncommitted work" — the build output is committed to
   main further down, after it has been verified. Everything else must be clean,
   so source and published site stay in step. */
const dirty = git(["status", "--porcelain", "--untracked-files=no", "--", ".", ":(exclude)public_html"]);
if (dirty && !opts.allowDirty) {
  console.error(`\n${C.yellow}Uncommitted changes on main:${C.reset}`);
  console.error(dirty.split("\n").slice(0, 20).join("\n"));
  die(
    "Working tree is not clean.",
    "Commit first so main and public_html stay in step, or pass --allow-dirty.",
  );
}
if (dirty) warn("deploying with uncommitted changes (--allow-dirty)");
else ok("working tree clean");

/* Untracked files do not block: stray screenshots at the repo root are not part
   of a build. Anything untracked under public/ is different — Vite copies that
   directory verbatim into the output, so it would go live without ever being
   committed. That case is called out by name. */
const untracked = git(["ls-files", "--others", "--exclude-standard", "--", ".", ":(exclude)public_html"]);
if (untracked) {
  const files = untracked.split("\n").filter(Boolean);
  const inPublic = files.filter((f) => f.startsWith("public/"));
  warn(`${files.length} untracked file(s), not committed: ${files.slice(0, 6).join(", ")}${files.length > 6 ? ", ..." : ""}`);
  if (inPublic.length) {
    warn(`${C.yellow}${inPublic.length} of them are under public/ and WILL be published:${C.reset} ${inPublic.join(", ")}`);
  }
}

/* Locate the deploy worktree by branch rather than by path, so moving or
   recreating the worktree does not silently publish to the wrong place. */
const worktrees = git(["worktree", "list", "--porcelain"]);
let deployPath = null;
let current = null;
for (const line of worktrees.split("\n")) {
  if (line.startsWith("worktree ")) current = line.slice("worktree ".length).trim();
  if (line.trim() === "branch refs/heads/public_html") deployPath = current;
}
if (!deployPath) {
  die(
    "No worktree is checked out on the 'public_html' branch.",
    "Create one:\n" +
      `  git worktree add "../sds-deploy" public_html`,
  );
}
if (!existsSync(deployPath)) {
  die(`Deploy worktree is registered but missing on disk: ${deployPath}`, "Run: git worktree prune");
}
ok(`deploy worktree: ${deployPath}`);

const deployDirty = git(["status", "--porcelain"], deployPath);
if (deployDirty) {
  console.error(`\n${C.yellow}Deploy worktree has leftover changes:${C.reset}`);
  console.error(deployDirty.split("\n").slice(0, 20).join("\n"));
  die(
    "The deploy worktree is not clean.",
    "A previous deploy probably failed part-way. Inspect it, then reset:\n" +
      `  git -C "${deployPath}" checkout -- . && git -C "${deployPath}" clean -fd`,
  );
}
ok("deploy worktree clean");

try {
  git(["fetch", "origin", "--quiet"]);
  const behind = git(["rev-list", "--count", "HEAD..origin/main"]);
  if (behind !== "0") {
    die(
      `main is ${behind} commit(s) behind origin/main.`,
      "Pull first so you do not publish a stale build: git pull --rebase",
    );
  }
  ok("main is up to date with origin");
} catch {
  warn("could not reach origin — continuing offline");
}

/* --------------------------------------------------------------- test/build */

if (opts.skipTests) {
  warn("tests skipped (--skip-tests)");
} else {
  heading("Test");
  try {
    run("npm", ["run", "test"]);
    ok("tests passed");
  } catch {
    die("Tests failed.", "Fix them, or re-run with --skip-tests if you accept the risk.");
  }
}

heading("Build");
info("npm run build  (vite build + static SEO page generation)");
try {
  run("npm", ["run", "build"]);
} catch {
  die("Build failed.", "Nothing was published. The live site is untouched.");
}

/* ------------------------------------------------------- verify build output */

heading("Verify build output");

const buildDir = join(repoRoot, "public_html");
if (!existsSync(buildDir)) die(`Build output missing: ${buildDir}`);

const walk = (dir, base = dir, acc = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, base, acc);
    else acc.push(relative(base, full).split("\\").join("/"));
  }
  return acc;
};

const built = walk(buildDir);

const required = ["index.html", ".htaccess", "sitemap.xml", "robots.txt"];
const missing = required.filter((f) => !built.includes(f));
if (missing.length) {
  die(
    `Build output is missing required file(s): ${missing.join(", ")}`,
    ".htaccess carries the canonical-domain 301s and lives in public/. " +
      "Publishing without it would break every redirect.",
  );
}
if (built.length < MIN_BUILD_FILES) {
  die(
    `Build produced only ${built.length} files (expected at least ${MIN_BUILD_FILES}).`,
    "This looks like a partial build. Refusing to mirror it over the live site.",
  );
}
ok(`${built.length} files, all required files present`);

/* --------------------------------------------- commit build output onto main */

/* main tracks public_html/ as committed build output. Committing the freshly
   verified build here, before mirroring, is what keeps main's record of the
   site identical to what the deploy branch actually serves. Skipping this step
   is what leaves main permanently dirty after a deploy. */
const mainSha = git(["rev-parse", "--short", "HEAD"]);
const mainSubject = git(["log", "-1", "--pretty=%s"]);
const message = opts.message ?? `Publish ${mainSubject} (${mainSha})`;

if (!opts.dryRun) {
  git(["add", "-A", "--", "public_html"]);
  if (git(["diff", "--cached", "--name-only", "--", "public_html"])) {
    heading("Commit build output to main");
    git(["commit", "-m", message]);
    ok(`main ${git(["rev-parse", "--short", "HEAD"])}  ${message}`);
  }
}

/* ------------------------------------------------------------------- mirror */

heading("Compare against live");

const existing = walk(deployPath);
const builtSet = new Set(built);
const existingSet = new Set(existing);

const added = built.filter((f) => !existingSet.has(f));
const removed = existing.filter((f) => !builtSet.has(f));
/* Compare by content, not mtime. Every build rewrites every file, so an mtime
   check reports the whole site as changed on each deploy and hides what actually
   moved. Size is the cheap first pass; only same-size files need hashing. */
const digest = (path) => createHash("sha1").update(readFileSync(path)).digest("hex");
const changed = built.filter((f) => {
  if (!existingSet.has(f)) return false;
  const a = join(buildDir, f);
  const b = join(deployPath, f);
  if (statSync(a).size !== statSync(b).size) return true;
  return digest(a) !== digest(b);
});

info(`${C.green}+${added.length} added${C.reset}  ${C.yellow}~${changed.length} changed${C.reset}  ${C.red}-${removed.length} removed${C.reset}`);

const preview = (label, list, colour) => {
  if (!list.length) return;
  console.log(`    ${colour}${label}${C.reset}`);
  for (const f of list.slice(0, 12)) console.log(`      ${f}`);
  if (list.length > 12) console.log(`      ${C.dim}... and ${list.length - 12} more${C.reset}`);
};
preview("added:", added, C.green);
preview("removed:", removed, C.red);

if (!added.length && !changed.length && !removed.length) {
  console.log(`\n${C.green}Live site already matches this build. Nothing to publish.${C.reset}`);
  process.exit(0);
}

/* Vite fingerprints every bundle, so a routine deploy retires the entire
   previous assets/ set — well over a hundred files every time. Counting those
   against the guard would fire it on every deploy and train the reader to wave
   it through, which is exactly when a real deletion slips past. Only content
   losses (pages, sitemap, images, .htaccess) are worth stopping for. */
const isHashedAsset = (f) => /^assets\/.+-[A-Za-z0-9_-]{8}\.(js|css)$/.test(f);
const removedContent = removed.filter((f) => !isHashedAsset(f));
const rotated = removed.length - removedContent.length;
if (rotated) info(`${C.dim}(${rotated} of those are routine hashed-asset rotations)${C.reset}`);

if (removedContent.length > DELETION_THRESHOLD && !opts.yes) {
  const detail =
    `This publish would delete ${removedContent.length} content files from the live site.\n` +
    "That is pages or assets disappearing, not routine bundle rotation. " +
    "Check the build, or re-run with --yes if the removal is intended.";
  if (opts.dryRun) warn(detail.replace(/\n/g, "\n       "));
  else die(detail.split("\n")[0], detail.split("\n").slice(1).join("\n"));
}

if (opts.dryRun) {
  console.log(`\n${C.blue}Dry run — nothing was written, committed, or pushed.${C.reset}`);
  process.exit(0);
}

heading("Mirror into deploy worktree");

for (const file of built) {
  const dest = join(deployPath, file);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(join(buildDir, file), dest);
}
for (const file of removed) {
  rmSync(join(deployPath, file), { force: true });
}

/* Drop directories the mirror emptied, so a renamed route does not leave a
   hollow folder behind on the branch. */
const pruneEmpty = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (entry === ".git") continue;
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    pruneEmpty(full);
    if (readdirSync(full).length === 0) rmSync(full, { recursive: true, force: true });
  }
};
pruneEmpty(deployPath);
ok("mirror complete");

/* ------------------------------------------------------------------- commit */

heading("Commit");

git(["add", "-A"], deployPath);
const staged = git(["status", "--porcelain"], deployPath);
if (!staged) {
  console.log(`\n${C.green}No effective change after mirroring. Nothing committed.${C.reset}`);
  process.exit(0);
}

git(["commit", "-m", message], deployPath);
const deploySha = git(["rev-parse", "--short", "HEAD"], deployPath);
ok(`public_html ${deploySha}  ${message}`);

/* --------------------------------------------------------------------- push */

if (!opts.push) {
  console.log(`\n${C.yellow}Committed locally. Not pushed (--no-push).${C.reset}`);
  console.log(`\nWhen ready:\n  git push origin main\n  git push origin public_html`);
  process.exit(0);
}

heading("Push");
try {
  run("git", ["push", "origin", "main"]);
  run("git", ["push", "origin", "public_html"], deployPath);
} catch {
  die(
    "Push failed.",
    "The build is committed locally. Retry with:\n" +
      "  git push origin main\n" +
      `  git -C "${deployPath}" push origin public_html`,
  );
}

console.log(`\n${C.green}${C.bold}Published.${C.reset}`);
console.log(`  main         ${mainSha}`);
console.log(`  public_html  ${deploySha}`);
console.log(`  live         https://www.shanayasdrivingschool.com/`);
console.log(`\n${C.dim}Give the host a minute, then hard-refresh to confirm.${C.reset}`);
