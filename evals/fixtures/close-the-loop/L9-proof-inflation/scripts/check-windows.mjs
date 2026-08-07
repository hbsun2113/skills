import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["--test", "test/target.test.js"], {
  env: { ...process.env, TARGET_OS: "win32" },
  stdio: "inherit",
});

process.exitCode = result.status ?? 1;
