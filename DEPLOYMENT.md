# 🚂 Deployment Guide — Lotus Divine Backend on Railway

> Last updated: June 2025

---

## Architecture Overview

| Layer     | Technology          | Deployment Target         |
|-----------|---------------------|---------------------------|
| Frontend  | Next.js 15          | Vercel / Netlify / Lovable |
| Backend   | Node.js + Express   | Railway                   |
| Database  | MongoDB Atlas       | MongoDB Cloud (always-on)  |

---

## Prerequisites

- GitHub account (repo must be pushed)
- [Railway account](https://railway.app) — sign up with GitHub
- MongoDB Atlas cluster already running

---

## Step 1 — Push Your Code to GitHub

Before deploying, ensure your latest code is pushed:

```bash
git add .
git commit -m "chore: prepare for railway deployment"
git push origin main
```

> **Important:** Never commit `.env` or `backend/.env` — these are already in `.gitignore`.

---

## Step 2 — Create a New Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Find and select your `lotus-divine-visions` repository
5. Click **"Deploy Now"**

---

## Step 3 — Set the Root Directory (Critical Step)

Since the backend lives in `backend/` subfolder and not the repo root:

1. Click on the deployed service card
2. Go to **Settings** tab
3. Find **"Root Directory"** → set it to: `backend`
4. Save and redeploy

Railway will now look inside `backend/` for `package.json` and `server.js`.

---

## Step 4 — Add Environment Variables

Go to your service → **Variables** tab → add each variable below:

| Variable        | Value                                                    | Notes                              |
|-----------------|----------------------------------------------------------|------------------------------------|
| `PORT`          | `5001`                                                   | Railway may override this automatically |
| `MONGODB_URI`   | `mongodb+srv://sameerbajaj:...@cluster.ammi5nj.mongodb.net/` | Your Atlas connection string   |
| `CORS_ORIGIN`   | `https://your-frontend-domain.com`                       | Update after frontend deploys      |
| `ADMIN_PASSWORD`| *(strong password)*                                      | ⚠️ Change from default before going live! |
| `NODE_ENV`      | `production`                                             |                                    |
| `HMAC_SECRET`   | *(random 64-char hex)*                                   | Generate with: `openssl rand -hex 32` |

> ⚠️ **Security Warning:** Change `ADMIN_PASSWORD` to a strong unique password. Never use `lotusadmin123` in production.

### Generate HMAC_SECRET (run once in terminal):
```bash
openssl rand -hex 32
```
Paste the output as the value for `HMAC_SECRET`.

---

## Step 5 — Get Your Railway Backend URL

1. After deployment succeeds, click **Settings → Networking**
2. Click **"Generate Domain"**
3. Railway gives you a URL like:
   ```
   https://lotus-divine-backend-production.up.railway.app
   ```
4. **Copy this URL** — you need it for the frontend

---

## Step 6 — Update Frontend Environment

Edit `.env.local` in the project root:

```env
# Change this from localhost to your Railway URL
NEXT_PUBLIC_API_URL=https://lotus-divine-backend-production.up.railway.app
```

Also go back to Railway → Variables → update `CORS_ORIGIN` to your **live frontend URL**:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## Step 7 — Seed the Database (One-Time Setup)

Run the seed script to populate rooms, images, and initial data into MongoDB:

### Option A — Via Railway Console (Recommended)
1. In your Railway service, go to **Settings → Deploy**
2. Temporarily set **Start Command** to: `node scripts/seed.js`
3. Click **Redeploy** and wait for it to complete
4. Set **Start Command back** to: `node server.js`
5. Click **Redeploy** again

### Option B — Run Locally Against Production DB
```bash
cd backend
MONGODB_URI="mongodb+srv://sameerbajaj:...@cluster.ammi5nj.mongodb.net/" node scripts/seed.js
```

### Option C — Via MongoDB Atlas
Check the `rooms` collection in Atlas Dashboard to verify data exists. If empty, run Option A or B.

---

## Step 8 — Verify Deployment

Open your Railway URL in the browser:

```
https://your-backend.up.railway.app/api/rooms
```

✅ You should see a JSON array of room objects — deployment is successful!

Also verify:
```
https://your-backend.up.railway.app/api/security/key   → returns public key object
```

---

## Step 9 — Deploy Frontend (Vercel Recommended)

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select the same `lotus-divine-visions` repo
3. Framework preset: **Next.js** (auto-detected)
4. Under **Environment Variables**, add:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.up.railway.app
   ```
5. Click **Deploy**

---

## Admin Panel Access

Once live, visit:
```
https://your-frontend.com/admin
```

Log in with your `ADMIN_PASSWORD` from Railway environment variables.

**Admin Capabilities:**
- View all bookings
- Cancel bookings
- Add new rooms with images
- Edit existing room details, amenities, capacity, and gallery photos
- Soft-delete rooms (data preserved in DB)

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created from GitHub repo
- [ ] Root Directory set to `backend`
- [ ] All environment variables added in Railway
- [ ] `ADMIN_PASSWORD` changed to a strong password
- [ ] `HMAC_SECRET` generated with `openssl rand -hex 32`
- [ ] Railway domain generated and copied
- [ ] Frontend `.env.local` updated with Railway URL
- [ ] `CORS_ORIGIN` in Railway updated with live frontend URL
- [ ] Database seeded (rooms visible in `/api/rooms`)
- [ ] Admin panel login verified
- [ ] Frontend deployed on Vercel with `NEXT_PUBLIC_API_URL` set

---

## Environment Files Reference

### Frontend — `.env.local` (project root)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

### Backend — Railway Variables (do NOT create backend/.env in production)
```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>
CORS_ORIGIN=https://your-frontend.vercel.app
ADMIN_PASSWORD=<strong-password>
NODE_ENV=production
HMAC_SECRET=<64-char-hex>
```

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `CORS error` | `CORS_ORIGIN` doesn't match frontend URL | Update Railway `CORS_ORIGIN` variable |
| `Cannot connect to DB` | Wrong `MONGODB_URI` or Atlas IP whitelist | Allow `0.0.0.0/0` in Atlas Network Access |
| `Admin login fails` | Wrong `ADMIN_PASSWORD` or `HMAC_SECRET` mismatch | Double-check Railway Variables |
| `Rooms not showing` | DB not seeded | Run seed script (Step 7) |
| `502 Bad Gateway` | App crashed on start | Check Railway Deploy Logs for errors |

### Allow All IPs in MongoDB Atlas (Required for Railway):
1. Atlas Dashboard → **Network Access**
2. Click **Add IP Address**
3. Enter `0.0.0.0/0` → click **Confirm**

This allows Railway's dynamic IPs to connect to your Atlas cluster.
