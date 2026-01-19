## Dandi

Dandi is a GitHub repository analysis platform that turns any public repo into
clear, actionable insights. It combines AI summaries, key facts, and rich
dashboard views so teams can evaluate projects quickly and share results.

### Features

- AI‑generated README summaries and key facts
- API key management with secure access control
- Live API demo to test the summary endpoint
- Dashboard and API playground for day‑to‑day workflows
- Google SSO with session-based sign‑in

### API

Endpoint:
- `POST /api/get-summary`

Request body:
```json
{
  "githubUrl": "https://github.com/assafelovic/gpt-researcher"
}
```

Notes:
- Provide an `api-key` header for authenticated requests.
- The landing page demo uses an internal `x-demo` header to bypass API keys.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Google SSO setup

1) Create a Google OAuth client and set the authorized redirect URI to:
   `http://localhost:3000/api/auth/google/callback` (or your deployed base URL).
2) Add the following environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_BASE_URL` (optional; defaults to `http://localhost:3000`)
   - `GOOGLE_REDIRECT_URI` (optional override for the callback URL)
   - `NEXT_PUBLIC_POST_LOGIN_REDIRECT` (optional; defaults to `/`)

## Supabase users table

Run `supabase/migrations/20250118_create_users.sql` in the Supabase SQL editor
to create the `users` table used by Google SSO.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
