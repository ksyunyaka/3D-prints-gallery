# Upgrade to Lovable TanStack Start (latest template)

## Goal
Move the app from the current **Vite SPA + React Router v6 + Tailwind v3** stack to **Lovable's latest TanStack Start template** (React 19 + Tailwind v4 + SSR + file-based routing). This unlocks server-side rendering, per-page SEO/head metadata, and accurate social previews — the main reason to upgrade given the current SEO gaps.

## Current state confirmed
- Stack: React 18, React Router v6, Tailwind v3, shadcn/ui, Vite 5.
- Routes: `/`, `/about`, `/print/:slug`, `/admin/login`, `/admin` + `/admin/prints/new` + `/admin/prints/:id`, catch-all 404.
- Providers: `QueryClientProvider`, `AuthProvider`, `TooltipProvider`, `Toaster`, `Sonner`.
- Auth: client-side Supabase auth via `AuthContext` + `RequireAuth` wrapper around the admin layout.
- Supabase client: `src/lib/supabase.ts` reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` and is currently used only on the client.
- Custom Tailwind theme: Cormorant Garamond + Inter fonts, custom `display`/`headline` sizes, custom CSS variables, custom animations (`.fade-in-up`, `.page-transition`), `3xl` breakpoint, custom scrollbar utilities.
- Fonts: loaded via Google Fonts `<link>` in `index.html`.
- No PWA/service worker, no edge functions, no tests.

## What the upgrade will do

1. **Preflight check** — verify the current project builds cleanly and is eligible for migration.
2. **Swap framework scaffolding** — replace `package.json`, `tsconfig.json`, `vite.config.ts`, `src/styles.css`, and add TanStack Start entry files (`src/router.tsx`, `src/server.ts`, `src/start.ts`) plus the Lovable error-handling boilerplate.
3. **Merge dependencies** — upgrade to React 19, Tailwind v4, `@tanstack/react-router` / `@tanstack/react-start`, and drop `react-router-dom` + Tailwind v3 tooling.
4. **Remove obsolete SPA files** — delete `index.html`, `src/main.tsx`, `src/App.tsx`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.app.json`, `tsconfig.node.json`.
5. **Convert to file-based routes** — create `src/routes/` files that match the existing route map, including a nested admin layout and protected admin routes.
6. **Port auth** — keep `AuthProvider` and `RequireAuth` around the admin layout; guard the Supabase client so it only instantiates in the browser (SSR-safe).
7. **Port the Tailwind v4 theme** — convert custom CSS variables, utilities, keyframes, and breakpoints into Tailwind v4's `@theme` syntax in `src/styles.css`, and fix renamed v3→v4 utility classes (`shadow`, `rounded`, `blur`, `outline-none`, `ring`).
8. **Move head metadata and fonts** — shift the Google Fonts link and the default title/description from `index.html` into `src/routes/__root.tsx`, then add per-route head metadata for `/`, `/about`, and `/print/:slug`.
9. **Convert React Router APIs** — replace `useParams`, `useNavigate`, `useLocation`, `Link`, `Outlet`, `Navigate` imports with TanStack Router equivalents across all pages.
10. **Turn on TypeScript strict mode** — fix the resulting errors (mostly implicit `any` and null checks from the current loose config).
11. **Build and verify** — run `bun run build`, typecheck, and inspect the preview to confirm SSR, route rendering, auth, and head metadata work.

## Post-migration trade-offs
- **Tailwind v4** may need minor visual tweaks; the custom theme will be ported but the class-name semantics changed slightly.
- **Supabase client** remains client-side. Server-side data prefetching is possible later but would require adding a server-side Supabase client.
- **No PWA** exists today, so nothing is lost.
- The migration is deterministic for the framework swap; the manual work is the Tailwind/theme conversion and route/auth translation.

## Expected outcome
A server-rendered TanStack Start app with the same public gallery, print detail pages, and admin CRUD, plus per-page SEO title/description/OG tags and correct social previews. The current published `.lovable.app` URL stays the same after republishing.
