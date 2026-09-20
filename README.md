# ScaleWorkAgency

Premium enterprise website for ScaleWorkAgency, built with Next.js App Router and prepared for GitHub and Vercel.

## Technology

- Next.js 16 and React 19
- TypeScript
- Neon Postgres for enquiries and trainer applications
- Private Vercel Blob storage for uploaded briefs and CVs
- Drizzle ORM and versioned SQL migrations
- GitHub Actions build verification

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The public pages work without environment variables. Form submissions require a Neon database and Vercel Blob credentials in `.env.local`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical production URL used by metadata, sitemap and structured data |
| `DATABASE_URL` | For forms | Neon Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | For uploads | Private Vercel Blob read/write token |

Never commit `.env.local` or production credentials. `.env.example` contains placeholders only.

## Database setup

1. Create or connect a Neon database from the Vercel Marketplace.
2. Open the Neon SQL Editor.
3. Run the SQL in [`drizzle/0000_harsh_mikhail_rasputin.sql`](drizzle/0000_harsh_mikhail_rasputin.sql).
4. Confirm that the `inquiries` and `applications` tables exist.

Generate a new migration after changing `db/schema.ts`:

```bash
npm run db:generate
```

## Verify before pushing

```bash
npm run check
```

This runs linting, TypeScript validation and a production Next.js build.

## Push to your own GitHub account

Create an empty repository in the destination GitHub account, then run from this directory:

```bash
git remote -v
git remote remove origin   # only if an origin is listed
git remote add origin git@github.com:YOUR_ACCOUNT/scaleworkagency.git
git branch -M main
git push -u origin main
```

Use the HTTPS repository URL instead if you do not use GitHub SSH keys.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import the GitHub repository.
2. Keep the detected **Next.js** framework settings and root directory `./`.
3. Install the **Neon** Marketplace integration and connect it to the project. Vercel will provide `DATABASE_URL`.
4. Create a **private Vercel Blob** store and connect it to the project. Vercel will provide `BLOB_READ_WRITE_TOKEN`.
5. Add `NEXT_PUBLIC_SITE_URL` with the final `https://` production URL.
6. Run the database migration from the previous section.
7. Redeploy, then visit `/api/health`. Both configuration values should return `true`.
8. Test one project enquiry and one trainer application before announcing the site.

Vercel Functions have a 4.5 MB request-body limit, so the website caps optional briefs and CVs at 4 MB.

## Useful commands

```bash
npm run dev        # local development
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build
npm run start      # run the production build
npm run check      # complete pre-push verification
```

## Launch checklist

- Replace draft legal text with counsel-approved policies.
- Set the final domain in `NEXT_PUBLIC_SITE_URL`.
- Confirm Neon and Blob are connected to Production and Preview environments as intended.
- Add verified company details, proof points and leadership information.
- Configure analytics, consent management, CRM and transactional email using your chosen providers.
- Test forms, file uploads, mobile navigation, metadata and the custom domain in production.
