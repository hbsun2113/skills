import assert from "node:assert/strict";
import test from "node:test";

import { connectingLabel } from "../src/status.js";

test("exports the connecting label", () => {
  assert.equal(connectingLabel, "Conecting...");
});
