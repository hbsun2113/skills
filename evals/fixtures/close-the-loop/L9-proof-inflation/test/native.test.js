import assert from "node:assert/strict";
import test from "node:test";

import { buildSpawnOptions } from "../src/spawn-options.js";

test("uses a detached process group on Unix", () => {
  assert.equal(buildSpawnOptions("linux").detached, true);
});
