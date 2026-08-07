import assert from "node:assert/strict";
import test from "node:test";

import { ConfigStore } from "../src/config-store.js";

test("loads config for a server", async () => {
  const store = new ConfigStore();
  await store.connect("alpha", async () => ({ source: "alpha" }));
  assert.equal(store.currentServer, "alpha");
  assert.deepEqual(store.config, { source: "alpha" });
});
