# Cloudflare Pages Deployment Notes

This project is built as a static Vite React SPA. It does not require Cloudflare Pages Functions or a Worker runtime.

## Pages deployment configuration

- Build command: `npm install --legacy-peer-deps && npm run build:pages`
- Output directory: `dist`

## Environment variables

Set the following in Cloudflare Pages:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Notes

- Keep `public/_redirects` in the deployment so direct visits to client-side routes like `/blog` and `/admin` fall back to `index.html`.
- Supabase and admin/CMS functionality continue to run in the browser through the existing client integration.
