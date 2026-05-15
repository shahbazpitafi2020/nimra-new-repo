import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'

const handler = createStartHandler(defaultStreamHandler)

export type ServerEntry = { fetch: RequestHandler<Register> }

export function createServerEntry(entry: ServerEntry): ServerEntry {
  return {
    // Cloudflare Pages passes a 'context' object
    async fetch(context: any) {
      // Extract the actual Request object from the context
      const request = context instanceof Request ? context : context.request;
      
      try {
        return await entry.fetch(request)
      } catch (err) {
        console.error("🔥 SSR Fetch Error:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    },
  }
}

export default createServerEntry({ fetch: handler })