# BioLink Agritech Solutions

BioLink Agritech Solutions is a Vite + React frontend with an Express + MongoDB backend for:

- contact enquiries
- institutional quote capture
- retail launch notifications
- bulk order workflows
- transactional email delivery
- shipment tracking

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Run the frontend:

```bash
npm run dev
```

4. Run the backend:

```bash
npm run dev:api
```

5. Optionally seed demo database records:

```bash
npm run seed:db
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:5000`.

## Deployments

Use one of these patterns:

- Netlify only: frontend + serverless functions in one Netlify site
- Netlify + Render: frontend on Netlify, backend API on Render

Full production setup steps are in [DEPLOYMENT.md](./DEPLOYMENT.md).
