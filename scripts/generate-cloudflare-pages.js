 import fs from "node:fs";
import path from "node:path";

const serverDir = path.join(process.cwd(), "dist", "server");
const functionsDir = path.join(serverDir, "functions");

fs.mkdirSync(functionsDir, { recursive: true });

fs.writeFileSync(
  path.join(functionsDir, "[[path]].js"),
  `import worker from "../server.js";

export async function onRequest(context) {
  try {
    const handler = worker?.default?.fetch || worker?.fetch;

    if (!handler) {
      return new Response(
        "Cloudflare worker fetch handler not found",
        {
          status: 500,
        }
      );
    }

    return await handler(
      context.request,
      context.env,
      context
    );
  } catch (error) {
    return new Response(
      "Worker runtime error: " + (error?.message || error),
      {
        status: 500,
      }
    );
  }
}
`,
  "utf8"
);

fs.writeFileSync(
  path.join(serverDir, "_routes.json"),
  JSON.stringify(
    {
      version: 1,
      include: ["/*"],
      exclude: [
        "/assets/*",
        "/.vite/*",
        "/_routes.json",
        "/favicon.ico",
        "/robots.txt",
        "/sitemap.xml"
      ],
    },
    null,
    2,
  ),
  "utf8"
);

console.log(
  "Generated Cloudflare Pages wrapper in dist/server/functions and _routes.json"
);