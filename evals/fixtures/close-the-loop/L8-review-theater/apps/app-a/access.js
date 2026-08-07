export function appACanOpen(store) {
  return store.loaded && !store.hideProviderSettings;
}
