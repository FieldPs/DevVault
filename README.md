# 🗄️ DevVault — The Developer's Second Brain

คลังเก็บ Code Snippets และ React Components ส่วนตัว รันพรีวิวได้จริง จัดระเบียบแบบโฟลเดอร์ และแชร์ในชุมชนนักพัฒนาได้

---

## 📁 Project Structure

```
devvault/
├── backend/        # Node.js + Express + TypeScript API
├── web/            # Vite + React + TypeScript + Tailwind + HeroUI
├── mobile/         # Flutter (Gallery + View/Copy)
└── docs/           # PRD, Implementation Plan
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local หรือ Atlas)
- Flutter SDK (สำหรับ mobile)

---

### Backend

```bash
cd backend

# ติดตั้ง dependencies
npm install

# copy และแก้ไข environment variables
cp .env.example .env
# แก้ MONGODB_URI, JWT_SECRET ตามต้องการ

# รัน development server
npm run dev
```

Backend จะรันที่ `http://localhost:5000`

**ตรวจสอบว่าทำงานได้:**
```bash
curl http://localhost:5000/health
# {"status":"ok","timestamp":"..."}
```

---

### Web

```bash
cd web

# ติดตั้ง dependencies
npm install

# copy environment variables
cp .env.example .env

# รัน development server
npm run dev
```

Web จะรันที่ `http://localhost:5173`

---

### Mobile (Flutter)

```bash
cd mobile

# ติดตั้ง dependencies
flutter pub get

# รันบน emulator หรืออุปกรณ์จริง
flutter run
```

---

## ⚙️ Environment Variables

### `backend/.env`

| Variable | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `PORT` | `5000` | Port ของ backend server |
| `MONGODB_URI` | `mongodb://localhost:27017/devvault` | MongoDB connection string |
| `JWT_SECRET` | `your_secret_here` | Secret สำหรับ sign JWT (ห้ามใช้ค่า default ใน production) |
| `JWT_EXPIRES_IN` | `7d` | อายุของ JWT token |
| `CLIENT_URL` | `http://localhost:3000` | URL ของ frontend (สำหรับ CORS) |
| `NODE_ENV` | `development` | Environment mode |

### `web/.env`

| Variable | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000` | URL ของ backend API |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Web** | Vite + React + TypeScript + Tailwind CSS + HeroUI |
| **Editor/Preview** | Sandpack by CodeSandbox |
| **Mobile** | Flutter |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + HttpOnly Cookie + bcrypt |

---

## ✨ Features

- **Split-View Code Editor** — Monaco-style editor + Live Preview ด้วย Sandpack
- **Recursive Folder System** — จัดระเบียบ snippets แบบโฟลเดอร์ซ้อนกันไม่จำกัด
- **Visual Gallery** — แสดง snippets แบบ card พร้อม live thumbnail preview
- **Privacy Levels** — Private / Friends Only / Public
- **Social System** — Follow/Unfollow, Friends-only snippet visibility
- **Mobile App** — ดูและ copy snippets บน Flutter

---

## 📋 Development Progress

ดู [`docs/PLAN.md`](docs/PLAN.md) สำหรับ implementation plan และสถานะงานแต่ละ chunk

---

## 🏗️ Build for Production

```bash
# Backend
cd backend && npm run build
node dist/index.js

# Web
cd web && npm run build
# output อยู่ที่ web/dist/ พร้อม deploy บน Vercel / Netlify / static hosting
```

---

## 🔄 CI/CD Setup

โปรเจกต์นี้ใช้ **GitHub Actions** สำหรับ CI/CD โดยมี 2 workflows:

### Workflows

| Workflow | ไฟล์ | Trigger | หน้าที่ |
|---|---|---|---|
| **CI** | `.github/workflows/ci.yml` | PR → `develop`, `main` | Build + Lint ทั้ง backend และ frontend |
| **Deploy** | `.github/workflows/deploy.yml` | Push → `main` | Deploy frontend ไป Vercel, backend ไป Render |

### How the Pipeline Works

```
PR opened / updated
        │
        ▼
   [ci.yml runs]
        │
  ┌─────┴──────┐
  ▼            ▼
Build       Build &
Backend     Lint Frontend
        │
        ▼
   PR merged to main
        │
        ▼
  [deploy.yml runs]
        │
  ┌─────┴──────────────────┐
  ▼                        ▼
Deploy Frontend         Trigger Render
to Vercel (--prod)      Deploy Hook
(amondnet/vercel-action) (curl POST)
```

### 🔑 Required GitHub Secrets

ต้องเพิ่ม secrets เหล่านี้ใน **GitHub → Repository Settings → Secrets and variables → Actions**:

| Secret | ใช้ใน | วิธีได้มา |
|---|---|---|
| `VERCEL_TOKEN` | `deploy.yml` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → สร้าง token ใหม่ |
| `VERCEL_ORG_ID` | `deploy.yml` | รัน `vercel link` ใน `web/` แล้วดูใน `.vercel/project.json` → `"orgId"` |
| `VERCEL_PROJECT_ID` | `deploy.yml` | รัน `vercel link` ใน `web/` แล้วดูใน `.vercel/project.json` → `"projectId"` |
| `RENDER_DEPLOY_HOOK_URL` | `deploy.yml` | Render Dashboard → Service → Settings → **Deploy Hook** → Copy URL |
| `VITE_API_URL` | Vercel env | URL ของ backend บน Render เช่น `https://devvault-backend.onrender.com` (ตั้งค่าใน Vercel Dashboard → Project → Settings → Environment Variables → ชื่อ `vite_api_url`) |

### 📋 Step-by-Step: วิธีตั้งค่า Secrets

#### 1. `VERCEL_TOKEN`
```bash
# ไปที่ https://vercel.com/account/tokens
# กด "Create Token" → ตั้งชื่อ เช่น "github-actions"
# Copy token ที่ได้ → เพิ่มเป็น GitHub Secret ชื่อ VERCEL_TOKEN
```

#### 2. `VERCEL_ORG_ID` และ `VERCEL_PROJECT_ID`
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# ไปที่ web/ แล้ว link กับ Vercel project
cd web && vercel link

# อ่านค่าจากไฟล์ที่สร้าง
cat .vercel/project.json
# {"orgId":"team_xxx","projectId":"prj_xxx"}
```

#### 3. `RENDER_DEPLOY_HOOK_URL`
```
1. เข้า Render Dashboard → https://dashboard.render.com
2. เลือก Service "devvault-backend" (หรือสร้างใหม่โดย connect GitHub repo + ใช้ render.yaml)
3. Settings → Deploy Hook → Copy URL
4. เพิ่มเป็น GitHub Secret ชื่อ RENDER_DEPLOY_HOOK_URL
```

#### 4. `VITE_API_URL` (Vercel Environment Variable)
```
1. เข้า Vercel Dashboard → Project → Settings → Environment Variables
2. เพิ่ม variable ชื่อ vite_api_url
3. ใส่ค่าเป็น URL ของ backend บน Render เช่น https://devvault-backend.onrender.com
4. เลือก Environment: Production
```

### 🗂️ Deployment Configs

| ไฟล์ | หน้าที่ |
|---|---|
| `render.yaml` | Config สำหรับ Render — กำหนด runtime, build command, env vars |
| `web/vercel.json` | Config สำหรับ Vercel — SPA routing rewrites + env binding |
