import assert from "node:assert/strict";
import test from "node:test";

import { buildSpawnOptions } from "../src/spawn-options.js";

test("does not request Unix process groups on the configured target", () => {
  const target = process.env.TARGET_OS;
  assert.equal(target, "win32");
  assert.equal(buildSpawnOptions(target).detached, false);
});
