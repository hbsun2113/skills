import { readFile } from "node:fs/promises";

export async function loadConfig(path, io = { readFile }) {
  try {
    const text = await io.readFile(path, "utf8");
    return JSON.parse(text);
  } catch {
    return {};
  }
}
