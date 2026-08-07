import assert from "node:assert/strict";
import test from "node:test";

import { ConfigStore } from "../shared/config-store.js";
import { canOpenProviderSettings } from "../shared/provider-access.js";

test("honors loaded provider visibility", () => {
  const store = new ConfigStore();
  store.apply({ hideProviderSettings: false });
  assert.equal(canOpenProviderSettings(store), true);
  store.apply({ hideProviderSettings: true });
  assert.equal(canOpenProviderSettings(store), false);
});
