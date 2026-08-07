import assert from "node:assert/strict";
import test from "node:test";

import { ReconnectBuffer } from "../src/reconnect-buffer.js";

test("delivers output while connected", () => {
  const output = [];
  const buffer = new ReconnectBuffer((chunk) => output.push(chunk));
  buffer.emit("a");
  buffer.emit("b");
  assert.deepEqual(output, ["a", "b"]);
});
