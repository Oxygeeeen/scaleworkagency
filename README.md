# ScaleWorkAgency

Premium enterprise website for ScaleWorkAgency, built with Next.js App Router and prepared for GitHub and Vercel.

## Technology

- Next.js 16 and React 19
- TypeScript
- Neon Postgres for enquiries and trainer applications
- Private Vercel Blob storage for uploaded briefs and CVs
- Resend transactional email for sender confirmations and real-time admin notifications
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
| `RESEND_API_KEY` | For email | Resend API key used only by server routes |
| `EMAIL_FROM` | For email | Verified sender, for example `ScaleWorkAgency <hello@scaleworkagency.com>` |
| `ADMIN_EMAIL` | For email | Inbox that receives every website submission |

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

## Submission email setup

Both forms save the submission before attempting email delivery. The sender receives a branded confirmation containing their reference, while `ADMIN_EMAIL` receives the complete form details with the submitted brief or CV attached. The admin notification uses the sender's address as `Reply-To`, so replying from the inbox responds directly to the person who submitted the form.

1. Confirm that `hello@scaleworkagency.com` is a working mailbox with your normal email provider. Resend sends transactional email; it does not create the mailbox itself.
2. Create a Resend account and add `scaleworkagency.com` under **Domains**.
3. Add the SPF and DKIM records Resend provides to the domain's DNS, then wait until the domain shows as verified for sending.
4. Create a Resend API key.
5. In **Vercel → Project → Settings → Environment Variables**, add `RESEND_API_KEY`, `EMAIL_FROM` and `ADMIN_EMAIL` for Production and Preview.
6. Redeploy after saving the variables. Vercel does not add newly created environment variables to an existing deployment.
7. Visit `/api/health`. `databaseConfigured`, `blobConfigured` and `emailConfigured` should all be `true`.
8. Submit one test project enquiry and one test trainer application, then confirm both the sender and admin messages arrive.

If a message is saved but email delivery fails, the form still returns a reference instead of creating a duplicate submission. The delivery failure is recorded in the Vercel Function logs for diagnosis.

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
5. Configure Resend using the submission email instructions above.
6. Add `NEXT_PUBLIC_SITE_URL` with the final `https://` production URL.
7. Run the database migration from the previous section.
8. Redeploy, then visit `/api/health`. All three configuration values should return `true`.
9. Test one project enquiry and one trainer application before announcing the site.

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
- Verify the Resend sending domain and test confirmation and admin delivery.
- Add verified company details, proof points and leadership information.
- Configure analytics, consent management, CRM and transactional email using your chosen providers.
- Test forms, file uploads, mobile navigation, metadata and the custom domain in production.
