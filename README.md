# SAP CareerForge

Learning app for SAP S/4HANA MM and SD. Independent training; not affiliated with SAP and not an SAP certification.

## What works now
- Sign up / sign in / password reset (Supabase Auth), onboarding, dashboard
- Lesson list and lesson pages (sections unlock in order)
- Quiz scored on the database side (answer keys are never sent to the browser before submission)
- Practical task submission saved to the account
- A lesson completes only when all sections are read, the quiz is passed and the practical is submitted
- Progress lives in Supabase; the browser cannot write progress tables directly

## Not built yet
Simulator, labs, tickets, interview and AI features, flashcards, job-readiness score, admin CMS, analytics.
Content written so far: Fundamentals (6 lessons) and MM Core (7 lessons).

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL=https://hvjbhnbgcsoibavcfxna.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_GTTO0KUJtjBG20qX1pvJug_yqAsfjje`
3. `npm run dev` and open http://localhost:3000

The service-role key is not used and must never go in a `NEXT_PUBLIC_` variable.

## Supabase settings to check
- Authentication > URL Configuration: set Site URL to your deployed address and add `<site>/auth/callback` to Redirect URLs.
- Authentication > Providers > Email: for quick testing you may turn off "Confirm email"; keep it on for real users.

## Deploy to Vercel
Push this folder to a Git repository, import it in Vercel, add the two environment variables above, deploy.

## Database
Schema, RLS, and content live in the connected Supabase project. `supabase/migrations/0001_foundation.sql` is the base schema.
Later migrations (progress functions, seed lessons) are recorded in the project's migration history; export them with `supabase db pull`.

## Making yourself admin
After you register, run in the Supabase SQL editor:
`insert into public.user_roles(user_id, role) select id, 'admin' from auth.users where email = 'YOUR_EMAIL';`
