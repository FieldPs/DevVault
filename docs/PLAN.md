# DevVault — Implementation Plan & Progress Tracker

> **Workflow**: Feature-based branching — one Chunk per feature branch → User Test → Commit → merge → next Chunk  
> **Status**: `🔲 todo` | `🔄 in-progress` | `✅ done`

---

## Overview

| Chunk | Feature | Status |
|-------|---------|--------|
| 0 | Project Scaffolding & Infra | ✅ done |
| 1 | Auth System (JWT) | ✅ done |
| 2 | Component CRUD (Backend + Basic UI) | 🔲 todo |
| 3 | Split-View Editor + Live Preview ⭐ | 🔲 todo |
| 4 | Recursive Folder System | 🔲 todo |
| 5 | Visual Gallery (Live Sandpack Rendering) | 🔲 todo |
| 6 | Privacy Levels (Private/Friends/Public) | 🔲 todo |
| 7 | Social — Follow & Friends | 🔲 todo |
| 8 | Flutter Mobile App | 🔲 todo |
| 9 | Polish & Extras | 🔲 todo |

---

## Chunk 0 — Project Scaffolding & Infra
**Status**: ✅ done  
**Commit**: `feat: scaffold monorepo with web + backend + mongodb connection`

### Tasks
- [ ] Initialize monorepo structure (`web/`, `backend/`, `mobile/`)
- [ ] **Backend**: Express + TypeScript + `dotenv` + `cors` + `helmet` + Mongoose
- [ ] **Backend**: MongoDB connection + health-check `GET /health`
- [ ] **Backend**: `.env.example`
- [ ] **Web**: Vite + React 19 + TypeScript + Tailwind CSS + HeroUI + React Router v7 + Zustand
- [ ] **Web**: `.env.example`
- [ ] Verify: `npm run dev` ทั้ง web และ backend ไม่ error

---

## Chunk 1 — Auth System (JWT HttpOnly Cookie)
**Status**: ✅ done  
**Depends on**: Chunk 0  
**Commit**: `feat: auth system with JWT HttpOnly cookie`

### Tasks
- [ ] **Backend**: User model (email, username, passwordHash)
- [ ] **Backend**: `POST /auth/register` — bcrypt hash password
- [ ] **Backend**: `POST /auth/login` — return JWT via HttpOnly Cookie
- [ ] **Backend**: `POST /auth/logout` — clear cookie
- [ ] **Backend**: `GET /auth/me` — verifyToken middleware + return user
- [ ] **Web**: หน้า `/login` และ `/register` (HeroUI form)
- [ ] **Web**: `AuthContext` หรือ Zustand store เก็บ user state
- [ ] **Web**: Protected route — redirect `/login` ถ้าไม่ได้ login
- [ ] Verify: Register → Login → เห็น user info → Logout สำเร็จ

---

## Chunk 2 — Component CRUD (Backend + Basic UI)
**Status**: 🔲 todo  
**Depends on**: Chunk 1  
**Commit**: `feat: component CRUD with basic list UI`

### Tasks
- [ ] **Backend**: Component model (`title`, `description`, `code`, `language`, `template` (react/vanilla/html), `folderId`, `ownerId`, `privacy`)
- [ ] **Backend**: `POST /components` — create
- [ ] **Backend**: `GET /components` — list ของตัวเอง
- [ ] **Backend**: `GET /components/:id` — single component
- [ ] **Backend**: `PUT /components/:id` — update
- [ ] **Backend**: `DELETE /components/:id` — delete
- [ ] **Web**: หน้า `/dashboard` แสดง component list แบบ simple list/table (full gallery rendering comes in Chunk 5)
- [ ] **Web**: สร้าง/แก้ไข component ด้วย `<textarea>` ธรรมดา (ยังไม่ใช้ Sandpack)
- [ ] Verify: CRUD component ครบทุก operation ผ่าน UI ได้

---

## Chunk 3 — Split-View Editor + Live Preview ⭐
**Status**: 🔲 todo  
**Depends on**: Chunk 2  
**Commit**: `feat: split-view editor with sandpack live preview`

### Tasks
- [ ] **Web**: Install `@codesandbox/sandpack-react`
- [ ] **Web**: Component `<ComponentEditor>` — split-view layout
  - ซ้าย: `<SandpackCodeEditor>`
  - ขวา: `<SandpackPreview>`
- [ ] **Web**: Toggle Real-time / Manual Run (ปุ่ม "Run")
- [ ] **Web**: เลือก template: React, Vanilla JS, HTML+CSS
- [ ] **Web**: หน้า `/components/new` — ใช้ editor + บันทึกลง DB
- [ ] **Web**: หน้า `/components/:id/edit` — โหลด code จาก DB มาใส่ editor
- [ ] Verify: พิมพ์ React code → เห็น preview ทันที, Save → reload → code ยังอยู่

---

## Chunk 4 — Recursive Folder System
**Status**: 🔲 todo  
**Depends on**: Chunk 3  
**Commit**: `feat: recursive folder system with sidebar navigation`

### Tasks
- [ ] **Backend**: Folder model (name, parentId, ownerId)
- [ ] **Backend**: `POST /folders`, `GET /folders` (tree), `PUT /folders/:id`, `DELETE /folders/:id`
- [ ] **Web**: Sidebar component — recursive folder tree
- [ ] **Web**: สร้าง/rename/ลบ folder (context menu หรือ inline edit)
- [ ] **Web**: ย้าย component เข้า folder
- [ ] **Web**: Breadcrumb navigation
- [ ] Verify: สร้าง `Project A > UI > Buttons` → ย้าย component เข้าได้

---

## Chunk 5 — Visual Gallery (Live Sandpack Rendering)
**Status**: 🔲 todo  
**Depends on**: Chunk 4  
**Commit**: `feat: visual gallery with live sandpack rendering`

### Tasks
- [ ] **Web**: Dashboard → Grid card layout
- [ ] **Web**: แต่ละ Card ใช้ `<SandpackPreview>` (read-only, no editor visible) เพื่อ render component จริงแบบ live ในแต่ละ card — ไม่ใช่ static thumbnail
- [ ] **Web**: Lazy-load Sandpack instances ด้วย Intersection Observer (หรือเทียบเท่า) เพื่อป้องกัน performance issues เมื่อ gallery มีหลาย card
- [ ] **Web**: Card แสดง: title, language badge, privacy badge, edit/delete action
- [ ] **Web**: Search bar กรองตาม title หรือ language
- [ ] **Web**: Filter by folder (ผ่าน sidebar)
- [ ] Verify: Gallery แสดง live Sandpack render ของแต่ละ component, search ทำงานได้

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
