import { spawnSync } from "node:child_process";

function gitFiles(args) {
  const result = spawnSync("git", args, { encoding: "utf8", shell: process.platform === "win32" });
  if (result.status !== 0) return [];
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

const candidates = new Set([
  ...gitFiles(["diff", "--name-only", "--diff-filter=ACMR", "HEAD"]),
  ...gitFiles(["ls-files", "--others", "--exclude-standard"]),
]);
const files = [...candidates].filter((file) => /\.(?:[cm]?js|tsx?)$/.test(file));

if (!files.length) {
  console.log("변경된 코드 파일이 없어 빠른 lint를 건너뜁니다.");
  process.exit(0);
}

const result = spawnSync("eslint", [...files, "--cache", "--cache-location", ".cache/eslint/.eslintcache"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
