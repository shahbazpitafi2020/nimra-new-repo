# Cloudflare Pages Deployment Notes

This project is an SSR application built with TanStack Start, not a static Vite SPA.

## Pages deployment configuration

- Build command: `npm run build:pages`
- Output directory: `dist/server`
- Functions directory: `dist/server/functions`

## Environment variables

Set the following in Cloudflare Pages:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Notes

- Do not deploy `dist/client` directly.
- `dist/server/functions/[[...path]].js` is required for SSR routing.
- This preserves the current Supabase integration and admin/CMS functionality.
