export function buildSpawnOptions(platform = process.platform) {
  return {
    detached: true,
    windowsHide: platform === "win32",
  };
}
