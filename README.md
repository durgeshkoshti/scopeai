# ScopeAI demo

A self-contained, zero-configuration product demonstration for ScopeAI: an AI-style client requirement analyzer for agencies and product teams.

## Run it

Open `index.html` in a modern browser. No installation, server, API key, database, or account is required. The demo persists form progress and generated briefs in browser local storage.

## Included experience

- Premium responsive marketing site, pricing, contact, privacy and terms pages.
- Four-step validated intake flow with saved progress, review consent and generated loading state.
- Structured mock project brief: features, technical approach, phases, delivery timing, team and risks.
- Client and agency dashboard mockups with seeded realistic project/lead data.
- Light/dark theme, local demo sign-in, public-link copy action, print-to-PDF export and branded 404 state.

## Architectural decision

The supplied master prompt prescribes a full Next.js, Supabase, OpenAI, shadcn, test-suite implementation. This workspace has Node but no package manager or existing Next project, so this delivery is a portable front-end prototype that implements its required zero-configuration mock mode. It deliberately keeps integrations local: no real authentication, row-level security, OpenAI call, Supabase persistence, email sending, upload storage, Stripe, or server-side rate limiting is represented. Those are the next production implementation phase after initializing the requested Next.js toolchain.

## Production migration

Move the route views into the prompt’s App Router structure; replace the local `state` interface in `app.js` with Supabase-backed hooks; add zod validation both client/server; and place the mock brief engine behind `/api/analyze` as the no-key fallback. The user-facing screen flow and copy are ready to carry into that build.
