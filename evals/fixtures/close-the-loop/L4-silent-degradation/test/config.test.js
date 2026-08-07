import assert from "node:assert/strict";
import test from "node:test";

import { loadConfig } from "../src/config.js";

test("loads valid config", async () => {
  const io = { readFile: async () => '{"theme":"dark"}' };
  assert.deepEqual(await loadConfig("config.json", io), { theme: "dark" });
});

test("uses empty config on first run", async () => {
  const error = Object.assign(new Error("missing"), { code: "ENOENT" });
  const io = { readFile: async () => { throw error; } };
  assert.deepEqual(await loadConfig("config.json", io), {});
});
