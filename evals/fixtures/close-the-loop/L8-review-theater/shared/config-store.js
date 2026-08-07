export class ConfigStore {
  loaded = false;
  server = null;
  hideProviderSettings = true;

  async connect(server, load) {
    this.server = server;
    const config = await load(server);
    this.hideProviderSettings = config.hideProviderSettings === true;
    this.loaded = true;
  }
}
