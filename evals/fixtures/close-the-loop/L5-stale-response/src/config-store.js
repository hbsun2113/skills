export class ConfigStore {
  currentServer = null;
  config = null;

  async connect(server, loadConfig) {
    this.currentServer = server;
    const config = await loadConfig(server);
    this.config = config;
  }
}
