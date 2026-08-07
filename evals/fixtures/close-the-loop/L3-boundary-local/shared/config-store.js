export class ConfigStore {
  server = null;
  config = null;

  async connect(server, load) {
    this.server = server;
    this.config = await load(server);
  }
}
