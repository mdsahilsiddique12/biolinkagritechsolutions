# BioLink Agritech — Local Setup & Production Deployment Guide

This guide outlines the complete step-by-step process to configure your domain records, set up email delivery routing, initialize the local development environment, and deploy to production (Netlify & Render).

---

## 1. Domain & DNS Configuration (GoDaddy + ImprovMX)

To receive emails at your custom address (`info@biolinkagri.in`) and automatically forward them to your personal Gmail account:

1. **Register on ImprovMX**:
   - Go to [ImprovMX.com](https://improvmx.com/).
   - Add your domain: `biolinkagri.in`
   - Set the destination email to your personal Gmail address.

2. **Add MX Records on GoDaddy**:
   - Log into your **GoDaddy Dashboard**.
   - Go to your domain name settings and click **Manage DNS**.
   - **Delete** any default or existing MX records to prevent mail delivery conflicts.
   - Click **Add New Record** to add the two ImprovMX mail servers:
     - **Type**: `MX` | **Name**: `@` | **Value**: `mx1.improvmx.com` | **Priority**: `10`
     - **Type**: `MX` | **Name**: `@` | **Value**: `mx2.improvmx.com` | **Priority**: `20`
   - Click **Add New Record** to add the SPF verification TXT record:
     - **Type**: `TXT` | **Name**: `@` | **Value**: `v=spf1 include:spf.improvmx.com ~all`

3. **Verify Connection**:
   - Return to your ImprovMX dashboard page and click **Verify**.
   - Once it states **`Active`**, any mail sent to `info@biolinkagri.in` will forward to your Gmail automatically.

---

## 2. Email Credentials Configuration (Gmail SMTP & App Passwords)

To authorize the Node.js backend server to send automated buyer receipts, QA verification links, and dispute notifications from `info@biolinkagri.in`:

1. **Activate Google App Passwords**:
   - Log into your destination Google Account settings at [myaccount.google.com](https://myaccount.google.com/).
   - Under the **Security** tab, ensure **2-Step Verification** is turned **ON**.
   - Search for **App Passwords** in the search bar.
   - In the "App Name" field, enter `BioLink Agritech Server` and click **Create**.
   - Copy the generated **16-character code** (e.g. `abcd efgh ijkl mnop`).

2. **Gmail Filters (Skip Inbox to Label)**:
   - To organize incoming forwarded mail in your Gmail inbox:
   - Click the settings gear icon -> **See all settings** -> **Labels** -> click **Create new label** -> name it `info@biolinkagri.in`.
   - Go to the **Filters and Blocked Addresses** tab -> click **Create a new filter**.
   - Set the **To** field to `info@biolinkagri.in`.
   - Click **Create Filter**.
   - Check **Skip the Inbox (Archive it)** and **Apply the label** (select the `info@biolinkagri.in` label). Save filter.

3. **Thunderbird Integration (Optional)**:
   - If using Mozilla Thunderbird, select **Add Account** -> **Email**.
   - Enter your Gmail email address and login parameters.
   - Select IMAP, and complete the Google OAuth2 sign-in pop-up window to sync your mail and labels.

---

## 3. Local Project Environment Setup (`.env`)

You must set up a `.env` file in the root of the project folder. Create a new file named `.env` and copy the variables from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://mdsahilsiddique12_db_user:xDtz5GnfMGy7Mseq@biolinkagritech.vma60ea.mongodb.net/?appName=BioLinkAgritech
JWT_SECRET=5rr43rfgwfrw3527677wugeghgfsrtre56563767267763hgwhghsttw56526
CLIENT_ORIGIN=http://localhost:5173,https://your-netlify-site.netlify.app
VITE_API_BASE_URL=

# Email Configuration
EMAIL_PROVIDER=gmail
EMAIL_FROM_NAME=BioLink Agritech
EMAIL_FROM_ADDRESS=info@biolinkagri.in

# Replace with your 16-character Google App Password (without spaces)
GMAIL_USER=info@biolinkagri.in
GMAIL_APP_PASSWORD=your-16-character-app-password

# QA Settlement — the URL prefix used in buyer QA clearance emails
SETTLE_BASE_URL=https://your-netlify-site.netlify.app/settle
```

---

## 4. Local Execution & Database Verification

Once the `.env` parameters are saved:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Seed the Database**:
   Populate MongoDB with default verified CBG manufacturing plants, initial listings, and test accounts:
   ```bash
   npm run seed:db
   ```

3. **Start the Frontend & Backend Servers**:
   Run both development environments locally:
   - Start the Vite client dev server (running at `http://localhost:5173`):
     ```bash
     npm run dev
     ```
   - Start the API backend Node.js server (running at `http://localhost:5000`):
     ```bash
     npm run dev:api
     ```

---

## 5. Production Hosting & Deployment Strategy

This system is configured to run as an asset-light decoupled architecture:

### Frontend Hosting (Netlify)
1. Link your GitHub repository to **Netlify**.
2. Set the Build Command to: `npm run build`
3. Set the Publish Directory to: `dist`
4. In **Site Configuration** -> **Environment variables**, set:
   - `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com/api` (this must point to your live Render backend URL).

### Backend Hosting (Render)
1. Create a new Web Service on **Render** linked to your GitHub repository.
2. Select **Node.js** as the environment runtime.
3. Set the Start Command to: `npm run start` (which triggers `node server/index.js`).
4. Add the environment variables in Render's **Environment** tab matching your local `.env`:
   - `PORT` = `10000`
   - `MONGO_URI` = `mongodb+srv://...`
   - `JWT_SECRET` = `...`
   - `CLIENT_ORIGIN` = `https://your-site.netlify.app`
   - `EMAIL_PROVIDER` = `gmail`
   - `EMAIL_FROM_ADDRESS` = `info@biolinkagri.in`
   - `EMAIL_FROM_NAME` = `BioLink Agritech`
   - `GMAIL_USER` = `info@biolinkagri.in`
   - `GMAIL_APP_PASSWORD` = `your-app-password`
   - `SETTLE_BASE_URL` = `https://your-site.netlify.app/settle`
