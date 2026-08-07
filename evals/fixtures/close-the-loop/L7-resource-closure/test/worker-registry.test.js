import assert from "node:assert/strict";
import test from "node:test";

import { WorkerRegistry } from "../src/worker-registry.js";

function makeHost() {
  return {
    processes: new Set(),
    sockets: new Set(),
    tempDirs: new Set(),
    leases: new Set(),
  };
}

test("shutdown stops the worker process", () => {
  const host = makeHost();
  const registry = new WorkerRegistry(host);
  registry.start("a");
  registry.shutdown("a");
  assert.equal(host.processes.size, 0);
});
