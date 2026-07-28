import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

http
  .createServer((request, response) => {
    const requestPath = request.url === "/" ? "/index.html" : request.url.split("?")[0];
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, safePath);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": types[path.extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    fs.createReadStream(filePath).pipe(response);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Help Duncan is available at http://127.0.0.1:${port}`);
  });
