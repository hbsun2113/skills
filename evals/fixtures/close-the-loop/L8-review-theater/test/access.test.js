import assert from "node:assert/strict";
import test from "node:test";

import { appACanOpen } from "../apps/app-a/access.js";
import { ConfigStore } from "../shared/config-store.js";

test("App A stays closed before config loads", () => {
  assert.equal(appACanOpen(new ConfigStore()), false);
});
