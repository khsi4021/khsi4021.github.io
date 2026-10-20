// Minimal static server for the design mockups (no dependencies).
// Run: node scripts/serve-mockups.mjs  →  http://localhost:4400/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT ?? 4400);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  // Redirect (not rewrite) so relative links in the mockups resolve against their own folder.
  if (path === "/") return res.writeHead(302, { location: "/design-explorations/round-2/" }).end();
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try {
    const s = await stat(file);
    if (s.isDirectory() && !path.endsWith("/")) return res.writeHead(301, { location: path + "/" }).end();
    const target = s.isDirectory() ? join(file, "index.html") : file;
    const body = await readFile(target);
    res.writeHead(200, { "content-type": types[extname(target)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, () => console.log(`mockups at http://localhost:${port}/`));
