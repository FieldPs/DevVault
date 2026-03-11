# DevVault — Implementation Plan & Progress Tracker

> **Workflow**: Feature-based branching — one Chunk per feature branch → User Test → Commit → merge → next Chunk  
> **Status**: `🔲 todo` | `🔄 in-progress` | `✅ done`

---

## Overview

| Chunk | Feature | Status |
|-------|---------|--------|
| 0 | Project Scaffolding & Infra | ✅ done |
| 1 | Auth System (JWT) | ✅ done |
| 2 | Component CRUD (Backend + Basic UI) | ✅ done |
| 3 | Component View (Tab UI) + Split-View Editor ⭐ | ✅ done |
| 4 | Recursive Folder System | ✅ done |
| 5 | Visual Gallery (Live Sandpack Rendering) | ✅ done |
| 6 | Privacy Levels (Private/Friends/Public) | 🔲 todo |
| 7 | Social — Follow & Friends | 🔲 todo |
| 8 | Flutter Mobile App | 🔲 todo |
| 9 | Polish & Extras | 🔲 todo |

---

## Chunk 0 — Project Scaffolding & Infra
**Status**: ✅ done  
**Commit**: `feat: scaffold monorepo with web + backend + mongodb connection`

### Tasks
- [x] Initialize monorepo structure (`web/`, `backend/`, `mobile/`)
- [x] **Backend**: Express + TypeScript + `dotenv` + `cors` + `helmet` + Mongoose
- [x] **Backend**: MongoDB connection + health-check `GET /health`
- [x] **Backend**: `.env.example`
- [x] **Web**: Vite + React 19 + TypeScript + Tailwind CSS + HeroUI + React Router v7 + Zustand
- [x] **Web**: `.env.example`
- [x] Verify: `npm run build` ผ่านทั้ง web และ backend

---

## Chunk 1 — Auth System (JWT HttpOnly Cookie)
**Status**: ✅ done  
**Depends on**: Chunk 0  
**Commit**: `feat: auth system with JWT HttpOnly cookie`

### Tasks
- [x] **Backend**: User model (email, username, passwordHash)
- [x] **Backend**: `POST /auth/register` — bcrypt hash password
- [x] **Backend**: `POST /auth/login` — return JWT via HttpOnly Cookie
- [x] **Backend**: `POST /auth/logout` — clear cookie
- [x] **Backend**: `GET /auth/me` — verifyToken middleware + return user
- [x] **Web**: หน้า `/login` และ `/register` (HeroUI form)
- [x] **Web**: Zustand auth store เก็บ user state
- [x] **Web**: Protected route — redirect `/login` ถ้าไม่ได้ login
- [x] Verify: Register → Login → เห็น user info → Logout สำเร็จ

---

## Chunk 2 — Component CRUD (Backend + Basic UI)
**Status**: ✅ done  
**Depends on**: Chunk 1  
**Commit**: `feat: component CRUD with basic list UI`

### Tasks
- [x] **Backend**: Component model (`title`, `description`, `code`, `cssCode`, `language`, `template` (react/vanilla/html), `dependencies`, `folderId`, `ownerId`, `privacy`)
- [x] **Backend**: `POST /components` — create
- [x] **Backend**: `GET /components` — list ของตัวเอง
- [x] **Backend**: `GET /components/:id` — single component
- [x] **Backend**: `PUT /components/:id` — update
- [x] **Backend**: `DELETE /components/:id` — delete
- [x] **Backend**: persist `cssCode` และ `dependencies` บน create/update route
- [x] **Web**: หน้า `/dashboard` แสดง component list แบบ list/table (live gallery remains in Chunk 5)
- [x] **Web**: create/edit flow เชื่อมกับ component store และ backend CRUD ครบ
- [x] Verify: CRUD component ครบทุก operation ผ่าน UI ได้

---

## Chunk 3 — Component View (Tab UI) + Split-View Editor ⭐
**Status**: ✅ done  
**Depends on**: Chunk 2  
**Commit**: `feat: component view tab UI and split-view editor with sandpack`

### Tasks

#### Component View Page — `/components/:id`
- [x] **Web**: Install `@codesandbox/sandpack-react`
- [x] **Web**: หน้า `/components/:id` — Component View page
  - Tab "Preview": `<SandpackProvider>` + `<SandpackPreview>` — fully **interactive** (กดได้ ใช้งานได้จริง)
  - Tab "Code": `<SandpackCodeEditor readOnly />` — syntax highlight สีสวยงาม, ไม่ edit ได้
- [x] **Web**: ปุ่ม "Edit" บน view page → navigate ไป `/components/:id/edit`
- [x] **Web**: ปุ่ม "Copy Code" บน Code tab → copy code ไป clipboard
- [x] **Web**: preview status + console ช่วย debug Sandpack startup/runtime error

#### Split-View Editor — `/components/new` + `/components/:id/edit`
- [x] **Web**: Component `<ComponentEditor>` — split-view layout
  - ซ้าย: `<SandpackCodeEditor>` — แก้ไขได้, syntax highlight
  - ขวา: `<SandpackPreview>` — live preview, interactive
- [x] **Web**: Toggle Real-time / Manual Run (ปุ่ม "Run")
- [x] **Web**: เลือก template: React, HTML+CSS
- [x] **Web**: Replace textarea ใน `/components/new` ด้วย `<ComponentEditor>`
- [x] **Web**: Replace textarea ใน `/components/:id/edit` ด้วย `<ComponentEditor>`
- [x] **Web**: เพิ่ม route `/components/:id` ใน App.tsx (ProtectedRoute)
- [x] **Web**: Sandpack React mode ใช้ไฟล์ตาม language จริง (`App.tsx` / `App.jsx` / `App.js`) และจำกัด visible tabs ให้ตรงกับไฟล์หลัก
- [x] **Web**: HeroUI preview ใช้ generated provider entry + runtime Tailwind config สำหรับ sandbox

- [x] Verify: View page → Preview tab แสดง interactive component (กดได้), Code tab แสดง highlight
- [x] Verify: Edit page → พิมพ์ React/HTML code → เห็น preview ได้, Save → reload → code ยังอยู่

### Implementation Notes
- React sandbox currently targets `react` and `html` flows in the web UI; `vanilla` remains in the shared model enum but is not yet exposed by the editor.
- Sandpack setup is centralized in `web/src/utils/sandpackUtils.ts` and should stay the single source of truth for files, dependencies, runtime helpers, and visible editor tabs.
- Tailwind styling inside Sandpack uses CDN/browser runtime plus a small runtime config shim for HeroUI semantic colors.

---

## Chunk 4 — Recursive Folder System
**Status**: ✅ done  
**Depends on**: Chunk 3  
**Commit**: `feat: recursive folder system with sidebar navigation`

### Tasks
- [x] **Backend**: Folder model (name, parentId, ownerId)
- [x] **Backend**: `POST /folders`, `GET /folders` (tree), `PUT /folders/:id`, `DELETE /folders/:id`
- [x] **Web**: Sidebar component — recursive folder tree
- [x] **Web**: สร้าง/rename/ลบ folder (context menu หรือ inline edit)
- [x] **Web**: ย้าย component เข้า folder
- [x] **Web**: Breadcrumb navigation
- [x] Verify: สร้าง `Project A > UI > Buttons` → ย้าย component เข้าได้

---

## Chunk 5 — Visual Gallery (Live Sandpack Rendering)
**Status**: ✅ done  
**Depends on**: Chunk 4  
**Commit**: `feat: visual gallery with live sandpack rendering`

### Tasks
- [x] **Web**: Dashboard → Grid card layout
- [x] **Web**: แต่ละ Card ใช้ `<SandpackPreview>` (read-only, no editor visible) เพื่อ render component จริงแบบ live ในแต่ละ card — ไม่ใช่ static thumbnail
- [x] **Web**: Lazy-load Sandpack instances ด้วย Intersection Observer (หรือเทียบเท่า) เพื่อป้องกัน performance issues เมื่อ gallery มีหลาย card
- [x] **Web**: Card แสดง: title, language badge, privacy badge, edit/delete action
- [x] **Web**: Search bar กรองตาม title หรือ language
- [x] **Web**: Filter by folder (ผ่าน sidebar)
- [x] Verify: Gallery แสดง live Sandpack render ของแต่ละ component, search ทำงานได้

### Current State
- Dashboard now uses a live visual gallery grid with per-card Sandpack previews.
- Sandpack previews are lazy-initialized when cards enter viewport to reduce initial dashboard cost.

---

## Chunk 6 — Privacy Levels (RBAC)
**Status**: 🔲 todo  
**Depends on**: Chunk 5  
**Commit**: `feat: privacy levels - private/friends/public`

### Tasks
- [ ] **Backend**: `privacy` field ใน Component (`private` | `friends` | `public`)
- [ ] **Backend**: Access control middleware ตรวจสิทธิ์การเข้าถึง
- [ ] **Web**: Privacy selector ใน editor (dropdown)
- [ ] **Web**: Public component page `/c/:id` — เข้าได้โดยไม่ต้อง login
- [ ] **Web**: หน้า Explore แสดง public components ของ user อื่น
- [ ] Verify: Private → คนอื่นเข้าไม่ได้, Public → เข้าได้ + copy ได้

---

## Chunk 7 — Social — Follow & Friends
**Status**: 🔲 todo  
**Depends on**: Chunk 6  
**Commit**: `feat: social follow system with friends-only visibility`

### Tasks
- [ ] **Backend**: Follow/Friend model (followerId, followingId)
- [ ] **Backend**: `POST /social/follow/:userId`, `DELETE /social/unfollow/:userId`
- [ ] **Backend**: `GET /social/friends` — list friends
- [ ] **Backend**: Friends-only component query ตาม social graph
- [ ] **Web**: Profile page `/u/:username`
- [ ] **Web**: Follow/Unfollow button
- [ ] **Web**: Friends-only components แสดงใน feed ของเพื่อน
- [ ] Verify: Follow user → เห็น friends-only component, Unfollow → หายไป

---

## Chunk 8 — Flutter Mobile App
**Status**: 🔲 todo  
**Depends on**: Chunk 1 (Auth API ready)  
**Commit**: `feat: flutter mobile app - gallery and view/copy`

> **Note**: Mobile uses a **static code view with syntax highlighting** — NOT Sandpack live preview. Sandpack requires a full browser environment; Flutter WebView cannot reliably sandbox arbitrary React execution. The mobile experience is intentionally read-and-copy only.

### Tasks
- [ ] **Flutter**: Setup project + Dio (HTTP) + SharedPreferences
- [ ] **Flutter**: Login screen (ใช้ API จาก backend)
- [ ] **Flutter**: Gallery screen — grid/list ของ components
- [ ] **Flutter**: Component detail screen — syntax highlight + Copy button
- [ ] **Flutter**: Search bar
- [ ] Verify: Login → เห็น gallery → เปิด component → copy code ได้

---

## Chunk 9 — Polish & Extras (ถ้าเวลาเหลือ)
**Status**: 🔲 todo  
**Depends on**: Chunk 7  
**Commit**: `feat: polish - offline queue, circuit breaker, monitoring`

### Tasks
- [ ] Offline Queue (web) — draft เมื่อออฟไลน์
- [ ] Circuit Breaker pattern (backend)
- [ ] API Monitoring middleware (log + metrics)
- [ ] MongoDB Aggregation Pipeline สำหรับ statistics
- [ ] Dark/Light theme toggle
- [ ] Glassmorphism UI polish

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Web | Vite + React 19 + TypeScript + Tailwind CSS + HeroUI + React Router v7 + Zustand |
| Editor/Preview | Sandpack by CodeSandbox |
| Mobile | Flutter |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + HttpOnly Cookie + bcrypt |
