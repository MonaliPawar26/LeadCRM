# 🚀 CRM Deployment Guide

This guide provides step-by-step instructions for deploying the LeadFlow CRM to production. We recommend a split deployment: hosting the **Backend** on a service like **Render** and the **Frontend** on a static hosting provider like **Vercel** or **Netlify**.

---

## 1. Database: MongoDB Atlas
You need a cloud-hosted MongoDB database for production.

1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster (the free shared tier is fine).
3.  Under **Security > Network Access**, add `0.0.0.0/0` (allow access from anywhere) or specifically add the IP of your hosting provider later.
4.  Under **Security > Database Access**, create a user with read/write permissions.
5.  Click **Connect > Connect your application** to get your `MONGO_URI`. It will look like:
    `mongodb+srv://<username>:<password>@cluster.mongodb.net/crm?retryWrites=true&w=majority`

---

## 2. Backend: Render (Web Service)
[Render](https://render.com/) is excellent for Node.js backends.

1.  Connect your GitHub repository to Render.
2.  Create a **New Web Service**.
3.  **Root Directory**: `server`
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  **Environment Variables**:
    - `NODE_ENV`: `production`
    - `MONGO_URI`: (Your MongoDB Atlas connection string)
    - `JWT_SECRET`: (A long, random string)
    - `PORT`: `10000` (Render's default)

---

## 3. Frontend: Vercel or Netlify
Both are optimized for Vite/React applications.

1.  Connect your GitHub repository to Vercel/Netlify.
2.  **Root Directory**: `client`
3.  **Framework Preset**: `Vite`
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    - `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (Use the URL Render provides).

---

## 4. Post-Deployment: Allowing CORS
Since your frontend and backend will be on different domains, ensure CORS is configured. The current `server/server.js` uses `app.use(cors())`, which allows all origins by default. For better security in production, you may want to restrict this:

```javascript
// server/server.js (example of restricted CORS)
app.use(cors({
  origin: 'https://your-frontend-app.vercel.app'
}));
```

---

## 5. Seeding Production
To populate your production database with the initial admin user:
1.  Temporarily change your local `.env` in the `server` folder to point to your MongoDB Atlas URI.
2.  Run `npm run seed` from the root directory.
3.  **CRITICAL**: Change it back to `localhost` immediately after to avoid accidental production data changes.

---

### **Quick Checklist before Launch:**
- [ ] Is `VITE_API_URL` pointing to the live backend?
- [ ] Is `MONGO_URI` using the Atlas connection string?
- [ ] Is `JWT_SECRET` a strong, unique value?
- [ ] Are all dependencies installed in production?
