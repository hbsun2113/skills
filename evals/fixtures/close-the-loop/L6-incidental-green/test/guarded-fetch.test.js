import assert from "node:assert/strict";
import test from "node:test";

import { guardedFetch } from "../src/guarded-fetch.js";

test("allows a public request", async () => {
  const calls = [];
  const response = await guardedFetch("https://public.example/data", async (url) => {
    calls.push(url);
    return { status: 200 };
  });
  assert.deepEqual(calls, ["https://public.example/data"]);
  assert.equal(response.status, 200);
});
