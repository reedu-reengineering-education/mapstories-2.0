# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

MapStories is a Next.js 14 (Pages Router + App Router, both in use) app for building and
viewing map-based interactive stories. Postgres/PostGIS via Prisma, NextAuth for auth,
MinIO/S3 for media storage, i18next for localization, Zustand for client state.

## Commands

```sh
yarn dev                 # start dev server (next dev)
yarn dev:network         # dev server bound to 0.0.0.0, for testing on other devices
yarn build                # production build
yarn start                # run production build
yarn lint                 # next lint (ESLint)
docker compose up -d      # start local Postgres (postgis), MinIO, mailhog, adminer
npx prisma migrate dev    # run/create migrations against local DB
npx prisma db seed        # seed themes/data (prisma/seed/seed.ts)
npx prisma studio         # inspect DB
npx prisma generate       # regenerate Prisma client (also runs on postinstall)
```

There is no test suite/runner configured in this repo (no `test` script, no `*.test.*` files).
Don't assume Jest/Vitest exists — check before adding tests.

Husky + lint-staged run `next lint --fix` on staged `.js/.jsx/.ts/.tsx` files on commit.

## Architecture

### Two routers coexist
- **`pages/api/**`** — all backend API routes (REST-style handlers). This is the entire
  server-side API surface; there is no App Router `route.ts` API.
- **`src/app/[lng]/**`** — the App Router frontend, localized under a `[lng]` dynamic segment
  (`de` default, plus `en`, `es`, `fr` — see `src/app/i18n/settings.ts`). Route groups split
  areas: `(auth)`, `(embed)`, `(gallery)`, `(main)` (incl. `storylab`, the story editor),
  `(mystories)`, `(viewer)`.
- **`pages/`** at the root also has a couple of legacy pages (e.g. `_document`, `_app`) —
  Pages Router is kept alive specifically to host the API routes.

### Data model (`prisma/schema.prisma`)
- `Story` is the core entity: has an ordered tree of `StoryStep`s (each with `SlideContent`
  items — text, media, embeds — and outgoing `Connection`s), an optional `Theme`, a
  `visibility` (PRIVATE/PUBLIC), and a `mode` (NORMAL/TIMELINE).
- Multi-language stories: a `Story` belongs to a `StoryGroup`; sibling `Story` rows in the
  same group represent translations (`isTranslation`, `defaultLanguage`, `language`), unique
  per `(groupId, language)`.
- `StoryStepSuggestion` + `SuggestionStatus` (PENDING/ACCEPTED/REJECTED) implement community
  contributions to a `community`-flagged story, reviewed before merging into real `StoryStep`s.
- `GalleryStory` curates which stories are featured per `Site` (see multi-tenant section).
- Auth tables (`User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken`) follow
  the standard NextAuth Prisma adapter shape, extended with `role` (`UserRole`) and a
  password-login flow (`password` field, alongside magic-link email auth).

### Multi-tenant "sites" (MAIN vs BFDW)
This app serves two white-labeled deployments from one codebase: the main `mapstories.de`
site and a `BFDW` deployment on its own subdomain (e.g. `bfdw.mapstories.de`), sharing the
same DB, users, and login session.
- `src/lib/site.ts` is the single source of truth: `getSiteFromHost(host)` (server) /
  `isBfdwHostname(hostname)` (client, via `NEXT_PUBLIC_BFDW_DOMAIN` since plain
  `process.env.BFDW_DOMAIN` is stripped from the browser bundle) determine which `Site` a
  request belongs to.
- Authorization for site-scoped admin actions goes through `canManageSite(role, site)`:
  global `ADMIN` can manage both sites; `SITE_ADMIN_BFDW` can only manage `BFDW`. Check this
  file before adding any admin-only or site-scoped route/feature.
- `Story.site` and `GalleryStory.site` scope content per site (e.g. gallery curation in
  `pages/api/admin/gallery`).
- `AUTH_COOKIE_DOMAIN` (e.g. `.mapstories.de`) lets the NextAuth session cookie work across
  both the main domain and the BFDW subdomain — see `src/lib/auth.ts`. The `redirect` callback
  there explicitly allows callback URLs on either host (default NextAuth behavior would bounce
  BFDW logins back to the main domain).
- `middleware.ts` handles both i18n locale redirection and auth-gating `/storylab` and
  `/login`; it's host-agnostic (site logic lives in the app layer, not middleware).

### API route pattern (`pages/api/**`)
Handlers are composed from small middleware wrappers in `src/lib/apiMiddlewares/`:
- `withMethods(methods, handler)` — 405 on disallowed HTTP method.
- `withAuthentication(handler)` — 403 if no NextAuth session.
- `withCurrentUser(handler)` — 403 unless `req.query.userId` matches the session user.
- `withMapstory(handler)` — story-specific ownership/access checks.

Newer admin routes (`pages/api/admin/**`) instead check the session + `db.user.role` /
`canManageSite` inline rather than via a wrapper — follow whichever pattern the neighboring
file in that directory uses.

Request bodies are validated with `zod` schemas in `src/lib/validations/`.

### Client-side data layer
`src/lib/api/**` (not to be confused with `pages/api/**`) holds the client-side API layer:
one file per operation (e.g. `src/lib/api/story/createStory.ts`) wrapping an `axios` call,
composed into per-entity hooks like `useStory.ts` that combine `swr` (for caching/revalidation
via `mutate`) with the individual mutation calls. Follow this file-per-mutation + one hook
pattern when adding new story/step/media operations.

Global client UI/editor state (not server data) lives in `src/lib/store/` (Zustand, combined
in `store.ts` via `persist`, split into `story.ts` and `ui.ts` slices).

### Media
`src/lib/media/media.ts` maps embeddable URLs to `MediaType` via regex matching (YouTube,
TikTok, Spotify, etc.); `ogParser.ts` handles Open Graph scraping for link previews. Actual
file uploads go through MinIO/S3 (`pages/api/mediaupload/**`, using `next-s3-upload`/`minio`),
with a pre-signed-URL flow (`preSignedUrl`) for direct-to-storage uploads.

### i18n
`src/app/i18n/` holds i18next config and `locales/{de,en,es,fr}` translation JSON. `de` is the
fallback language. Server and client both resolve language from the `[lng]` route segment;
`middleware.ts` redirects unlocalized paths based on the `Accept-Language` header / `i18next`
cookie.
