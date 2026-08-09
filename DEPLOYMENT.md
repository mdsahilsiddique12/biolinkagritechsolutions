# Deployment Guide

This project supports two production setups:

1. `Netlify only`
2. `Netlify frontend + Render backend`

If you want the simplest setup, use `Netlify only`.
If you want a long-running dedicated Node backend, use `Netlify + Render`.

## Shared prerequisites

Before deploying, prepare these services:

- MongoDB Atlas database
- Gmail App Password or Brevo SMTP credentials
- GitHub repository with this code

## Environment variables

These environment variables are used by the backend:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `EMAIL_PROVIDER`
- `EMAIL_FROM_NAME`
- `EMAIL_FROM_ADDRESS`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `BREVO_SMTP_USER`
- `BREVO_SMTP_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`

Frontend-only variable:

- `VITE_API_BASE_URL`

If you deploy everything on one Netlify site, leave `VITE_API_BASE_URL` empty.
If you deploy backend on Render, set `VITE_API_BASE_URL` to your Render API base, for example:

```env
VITE_API_BASE_URL=https://biolinkagritechsolutions-api.onrender.com/api
```

## Mail setup

### Option A: Gmail

Use this for a quick start.

1. Enable 2-Step Verification on the Gmail account.
2. Generate an App Password from the Google account security page.
3. Set:

```env
EMAIL_PROVIDER=gmail
EMAIL_FROM_NAME=BioLink Agritech
EMAIL_FROM_ADDRESS=your-email@gmail.com
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

Notes:

- Use an App Password only.
- Do not use your regular Gmail password.
- Gmail is fine for initial transactional emails, but Brevo is better for production deliverability.

### Option B: Brevo SMTP

Use this for better production email delivery.

1. Create a Brevo account.
2. Open SMTP settings in Brevo.
3. Generate or copy SMTP credentials.
4. Verify your sender email or sender domain in Brevo.
5. Set:

```env
EMAIL_PROVIDER=brevo
EMAIL_FROM_NAME=BioLink Agritech
EMAIL_FROM_ADDRESS=verified-sender@yourdomain.com
BREVO_SMTP_USER=your-brevo-smtp-login
BREVO_SMTP_KEY=your-brevo-smtp-key
```

You can also use the generic SMTP mode:

```env
EMAIL_PROVIDER=smtp
EMAIL_FROM_NAME=BioLink Agritech
EMAIL_FROM_ADDRESS=verified-sender@yourdomain.com
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-brevo-smtp-login
SMTP_PASS=your-brevo-smtp-key
```

## Option 1: Netlify only

This uses:

- frontend static build from `dist`
- backend through `netlify/functions/api.js`

### Steps

1. Push the repo to GitHub.
2. In Netlify, create a new site from Git.
3. Select this repository.
4. Netlify should detect:

- Build command: `npm run build`
- Publish directory: `dist`

5. Add all backend environment variables in Netlify Site Settings -> Environment Variables.
6. Add `CLIENT_ORIGIN` with your Netlify site URL:

```env
CLIENT_ORIGIN=https://your-site.netlify.app
```

7. Leave `VITE_API_BASE_URL` empty.
8. Deploy.

### Result

- frontend uses relative `/api/*`
- Netlify redirect sends `/api/*` to the serverless function
- same-origin API calls avoid cross-origin issues

## Option 2: Netlify frontend + Render backend

This uses:

- frontend on Netlify
- persistent Node backend on Render

### Render setup

This repo includes [render.yaml](./render.yaml).

1. In Render, create a new Blueprint from this repository.
2. Render reads `render.yaml`.
3. During setup, fill the secret variables marked with `sync: false`.
4. Set:

```env
MONGO_URI=your-mongodb-connection-string
CLIENT_ORIGIN=https://your-site.netlify.app
EMAIL_PROVIDER=brevo
EMAIL_FROM_ADDRESS=verified-sender@yourdomain.com
BREVO_SMTP_USER=your-brevo-smtp-login
BREVO_SMTP_KEY=your-brevo-smtp-key
```

5. Deploy the Render web service.

### Netlify setup

1. In Netlify, create a new site from the same repository.
2. Add:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

3. Build and deploy.

### Important

When using Render as backend, keep `CLIENT_ORIGIN` on Render set to the final Netlify domain.
If you have a custom domain too, you can comma-separate multiple origins:

```env
CLIENT_ORIGIN=https://your-site.netlify.app,https://www.yourdomain.com
```

## MongoDB Atlas setup

1. Create a cluster in MongoDB Atlas.
2. Create a database user.
3. In Network Access, allow the IPs you need.
4. Copy the connection string.
5. Put it in `MONGO_URI`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/biomanure_db?retryWrites=true&w=majority
```

## Database seed setup

This repo includes a seed script at `server/scripts/seed.js`.

It creates:

- demo buyer account
- demo plant partner account
- demo product listings for institutional orders

Run it after setting `MONGO_URI`, `JWT_SECRET`, and mail env vars:

```bash
npm run seed:db
```

Demo seeded users:

- `buyer@biolinkagri.com`
- `plant.punjab@biolinkagri.com`

Default seeded passwords:

- `BuyerPass123!`
- `PlantPass123!`

Change or remove these demo users before live production use.

## Recommended production database practice

- use MongoDB Atlas, not local MongoDB, for live deployment
- create a separate database user for production
- restrict Atlas network access where possible
- rotate credentials after initial setup
- do not keep demo seed users in production unless you intentionally need them

## Production checklist

- `MONGO_URI` points to Atlas, not localhost
- `JWT_SECRET` is long and random
- `EMAIL_FROM_ADDRESS` is a real verified sender
- `CLIENT_ORIGIN` matches the real frontend domain
- `VITE_API_BASE_URL` is empty for Netlify-only or set for Render backend
- Gmail uses App Password, not account password
- Brevo sender identity is verified

## Smoke test after deploy

Check these URLs and flows:

- `GET /api/health`
- contact form submits and sends email
- institutional quote form calculates and sends email
- retail notify form stores lead and sends confirmation
- tracking demo works with `BL-2026-08-0847`

## Current platform notes

These setup choices align with the current official docs I checked on August 8, 2026:

- Render Blueprints support `render.yaml` with `sync: false` secrets and generated values.
- Netlify Functions can read environment variables set in the Netlify UI.
- Brevo SMTP relay uses SMTP credentials, and port `465` is valid for SSL/TLS.
