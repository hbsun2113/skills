export class ConfigStore {
  loaded = false;
  hideProviderSettings = false;

  apply(config) {
    this.loaded = true;
    this.hideProviderSettings = config.hideProviderSettings === true;
  }
}
