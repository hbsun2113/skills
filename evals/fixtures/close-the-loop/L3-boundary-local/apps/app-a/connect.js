export async function connectAppA(store, server, load) {
  return store.connect(server, load);
}
