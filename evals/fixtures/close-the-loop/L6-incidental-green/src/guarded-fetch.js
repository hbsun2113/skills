function isPrivateHost(hostname) {
  return hostname === "127.0.0.1" || hostname === "169.254.169.254";
}

function assertAllowed(url) {
  if (isPrivateHost(new URL(url).hostname)) {
    throw new Error("blocked private target");
  }
}

export async function guardedFetch(url, request) {
  assertAllowed(url);
  const response = await request(url);
  if (response.redirect) return request(response.redirect);
  return response;
}
