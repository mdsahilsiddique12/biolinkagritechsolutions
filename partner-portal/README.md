# BioLink Standalone Partner Portal

A complete, self-contained **Referral & Partner Attribution System** app that can be deployed independently on any platform (Netlify, Vercel, Render, Railway, AWS, or custom servers).

---

## 📁 Directory Structure

```text
partner-portal/
├── index.html               # Entry HTML
├── package.json             # Standalone frontend dependencies & scripts
├── vite.config.js           # Vite config (port 5174, dev proxy)
├── src/                     # React frontend source
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/PartnerAuthContext.jsx
│   ├── lib/api.js
│   └── pages/
│       ├── PartnerLoginPage.jsx
│       ├── PartnerLoginPage.css
│       ├── PartnerDashboardPage.jsx
│       └── PartnerDashboardPage.css
└── server/                  # Standalone Express API microservice
    ├── package.json
    ├── index.js
    ├── app.js
    ├── config.js
    ├── db.js
    ├── middleware/auth.js
    ├── models/
    ├── routes/partnerRoutes.js
    ├── utils/validators.js
    └── scripts/seedPartners.js
```

---

## 🚀 How to Run Locally

### 1. Run Backend Microservice (Port 5001)

```bash
cd partner-portal/server
npm install
npm run seed     # Seeds GrowinAgri partner account
npm run dev      # Starts API on http://localhost:5001
```

### 2. Run Frontend Portal App (Port 5174)

```bash
cd partner-portal
npm install
npm run dev      # Starts Vite dev server on http://localhost:5174
```

---

## 🔑 Default Partner Credentials (Seeded)

- **Login URL**: `http://localhost:5174/login`
- **Partner Email**: `growinagri@biolinkagri.in`
- **Partner Password**: `GrowinAgri@2026`
- **Referral Code**: `GROWIN01`
- **Farmer Discount**: ₹100 / MT
- **Partner Commission**: ₹300 / MT

---

## 🌐 Independent Deployment Options

### Option A: Deploy Frontend on Netlify / Vercel (e.g. `partner.biolinkagri.in`)
1. Create a new site pointing to the `partner-portal/` root directory.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `partner-portal/dist`
4. Set Environment Variable: `VITE_API_BASE_URL=https://your-api-domain.com/api`

### Option B: Deploy Backend Microservice on Render / Railway / Heroku
1. Create a Web Service pointing to `partner-portal/server/`.
2. Set Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secure JWT secret key
   - `CLIENT_ORIGIN`: `https://partner.biolinkagri.in` (CORS whitelist)
3. Set Start Command: `npm start`
