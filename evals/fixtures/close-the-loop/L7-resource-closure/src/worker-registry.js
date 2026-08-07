export class WorkerRegistry {
  constructor(host) {
    this.host = host;
    this.active = new Map();
    this.admitted = 0;
  }

  start(id) {
    const resources = {
      process: `worker-${id}`,
      socket: `worker-${id}.sock`,
      tempDir: `/tmp/worker-${id}`,
      lease: `lease-${id}`,
    };
    this.host.processes.add(resources.process);
    this.host.sockets.add(resources.socket);
    this.host.tempDirs.add(resources.tempDir);
    this.host.leases.add(resources.lease);
    this.active.set(id, resources);
    this.admitted += 1;
  }

  shutdown(id) {
    const resources = this.active.get(id);
    if (!resources) return;
    this.host.processes.delete(resources.process);
    this.active.delete(id);
  }
}

export function sweepWorkerTempDirs(host) {
  for (const path of host.tempDirs) {
    if (path.includes("worker")) host.tempDirs.delete(path);
  }
}
