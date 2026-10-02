# 🌐 FraudGraph AI — Production Deployment Guide

Complete step-by-step guide to deploy **FraudGraph AI**:
* **Backend**: FastAPI + PyTorch GNN on **Render**
* **Frontend**: React + Vite + Tailwind CSS on **Vercel**

---

## 📋 Prerequisites

1. A **GitHub Account** with your repository pushed to GitHub.
2. A free account on **Render** ([render.com](https://render.com)).
3. A free account on **Vercel** ([vercel.com](https://vercel.com)).

---

## Step 1: Push Project to GitHub

Ensure your project root contains both `frontend/` and `backend/` directories, then push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: FraudGraph AI full-stack GNN platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/FraudGraphAI.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Log into **Render** ([dashboard.render.com](https://dashboard.render.com)).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your **GitHub repository** (`FraudGraphAI`).
4. Configure the Web Service settings:
   * **Name**: `fraudgraph-backend`
   * **Root Directory**: `backend`
   * **Environment**: `Python 3`
   * **Region**: Choose closest to your users (e.g. Oregon / Frankfurt)
   * **Branch**: `main`
   * **Build Command**:
     ```bash
     pip install -r requirements.txt && python scripts/seed_demo_data.py
     ```
   * **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   * **Instance Type**: Free Plan

5. Under **Environment Variables**, add:
   * `FRONTEND_URL`: `*` (or your Vercel URL once created, e.g. `https://fraudgraph-ai.vercel.app`)
   * `PYTHON_VERSION`: `3.11.0`

6. Click **Create Web Service**.
7. Once deployment succeeds, copy your backend live URL:
   👉 `https://fraudgraph-backend.onrender.com` (Example)

---

## Step 3: Deploy Frontend to Vercel

1. Log into **Vercel** ([vercel.com/dashboard](https://vercel.com/dashboard)).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository (`FraudGraphAI`).
4. Configure Project Settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click Edit $\rightarrow$ select `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://fraudgraph-backend.onrender.com` *(Replace with your actual Render backend URL)*
6. Click **Deploy**.
7. Vercel will build and launch your frontend application!
   👉 Example URL: `https://fraudgraph-ai.vercel.app`

---

## Step 4: Finalize CORS Configuration

After obtaining your Vercel URL (e.g. `https://fraudgraph-ai.vercel.app`):
1. Go back to **Render Dashboard** $\rightarrow$ **`fraudgraph-backend`** $\rightarrow$ **Environment**.
2. Update `FRONTEND_URL` to:
   ```text
   https://fraudgraph-ai.vercel.app,http://localhost:5173
   ```
3. Save changes. Render will automatically redeploy the backend with strict CORS protection.

---

## 🐳 Alternative: Local Docker Deployment

If you prefer to run both containers locally using Docker:

```bash
# Build and start both frontend and backend
docker compose up --build
```

Access the application at:
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:8000/docs`
