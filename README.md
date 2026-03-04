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
