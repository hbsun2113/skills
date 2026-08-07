export async function connectAppB(store, server, load) {
  return store.connect(server, load);
}
