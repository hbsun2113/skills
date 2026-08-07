import assert from "node:assert/strict";
import test from "node:test";

import { ConfigStore } from "../shared/config-store.js";
import { connectAppA } from "../apps/app-a/connect.js";
import { connectAppB } from "../apps/app-b/connect.js";

test("both applications use the shared store", async () => {
  const store = new ConfigStore();
  await connectAppA(store, "a", async () => ({ source: "a" }));
  assert.deepEqual(store.config, { source: "a" });
  await connectAppB(store, "b", async () => ({ source: "b" }));
  assert.deepEqual(store.config, { source: "b" });
});
