# DevVault — Implementation Plan & Progress Tracker

> **Workflow**: ทำทีละ Chunk → หยุดให้ User Test → Commit → ทำต่อ  
> **Status**: `🔲 todo` | `🔄 in-progress` | `✅ done`

---

## Overview

| Chunk | Feature | Status |
|-------|---------|--------|
| 0 | Project Scaffolding & Infra | ✅ done |
| 1 | Auth System (JWT) | ✅ done |
| 2 | Snippet CRUD (Backend + Basic UI) | 🔲 todo |
| 3 | Split-View Editor + Live Preview ⭐ | 🔲 todo |
| 4 | Recursive Folder System | 🔲 todo |
| 5 | Visual Gallery (Card + Thumbnail) | 🔲 todo |
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
- [ ] **Web**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + HeroUI
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

## Chunk 2 — Snippet CRUD (Backend + Basic UI)
**Status**: 🔲 todo  
**Depends on**: Chunk 1  
**Commit**: `feat: snippet CRUD with basic list UI`

### Tasks
- [ ] **Backend**: Snippet model (title, description, code, language, folderId, ownerId, privacy)
- [ ] **Backend**: `POST /snippets` — create
- [ ] **Backend**: `GET /snippets` — list ของตัวเอง
- [ ] **Backend**: `GET /snippets/:id` — single snippet
- [ ] **Backend**: `PUT /snippets/:id` — update
- [ ] **Backend**: `DELETE /snippets/:id` — delete
- [ ] **Web**: หน้า `/dashboard` แสดง snippet list แบบ card/table
- [ ] **Web**: สร้าง/แก้ไข snippet ด้วย `<textarea>` ธรรมดา (ยังไม่ใช้ Sandpack)
- [ ] Verify: CRUD snippet ครบทุก operation ผ่าน UI ได้

---

## Chunk 3 — Split-View Editor + Live Preview ⭐
**Status**: 🔲 todo  
**Depends on**: Chunk 2  
**Commit**: `feat: split-view editor with sandpack live preview`

### Tasks
- [ ] **Web**: Install `@codesandbox/sandpack-react`
- [ ] **Web**: Component `<SnippetEditor>` — split-view layout
  - ซ้าย: `<SandpackCodeEditor>`
  - ขวา: `<SandpackPreview>`
- [ ] **Web**: Toggle Real-time / Manual Run (ปุ่ม "Run")
- [ ] **Web**: เลือก template: React, Vanilla JS, HTML+CSS
- [ ] **Web**: หน้า `/snippets/new` — ใช้ editor + บันทึกลง DB
- [ ] **Web**: หน้า `/snippets/:id/edit` — โหลด code จาก DB มาใส่ editor
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
- [ ] **Web**: ย้าย snippet เข้า folder
- [ ] **Web**: Breadcrumb navigation
- [ ] Verify: สร้าง `Project A > UI > Buttons` → ย้าย snippet เข้าได้

---

## Chunk 5 — Visual Gallery (Card View + Thumbnail Preview)
**Status**: 🔲 todo  
**Depends on**: Chunk 4  
**Commit**: `feat: visual gallery with live thumbnail previews`

### Tasks
- [ ] **Web**: Dashboard → Grid card layout
- [ ] **Web**: แต่ละ Card มี Sandpack thumbnail preview แบบ read-only (ขนาดเล็ก)
- [ ] **Web**: Card แสดง: title, language badge, privacy badge, edit/delete action
- [ ] **Web**: Search bar กรองตาม title หรือ language
- [ ] **Web**: Filter by folder (ผ่าน sidebar)
- [ ] Verify: Gallery แสดง thumbnail ของแต่ละ snippet, search ทำงานได้

---

## Chunk 6 — Privacy Levels (RBAC)
**Status**: 🔲 todo  
**Depends on**: Chunk 5  
**Commit**: `feat: privacy levels - private/friends/public`

### Tasks
- [ ] **Backend**: `privacy` field ใน Snippet (`private` | `friends` | `public`)
- [ ] **Backend**: Access control middleware ตรวจสิทธิ์การเข้าถึง
- [ ] **Web**: Privacy selector ใน editor (dropdown)
- [ ] **Web**: Public snippet page `/s/:id` — เข้าได้โดยไม่ต้อง login
- [ ] **Web**: หน้า Explore แสดง public snippets ของ user อื่น
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
- [ ] **Backend**: Friends-only snippet query ตาม social graph
- [ ] **Web**: Profile page `/u/:username`
- [ ] **Web**: Follow/Unfollow button
- [ ] **Web**: Friends-only snippets แสดงใน feed ของเพื่อน
- [ ] Verify: Follow user → เห็น friends-only snippet, Unfollow → หายไป

---

## Chunk 8 — Flutter Mobile App
**Status**: 🔲 todo  
**Depends on**: Chunk 1 (Auth API ready)  
**Commit**: `feat: flutter mobile app - gallery and view/copy`

### Tasks
- [ ] **Flutter**: Setup project + Dio (HTTP) + SharedPreferences
- [ ] **Flutter**: Login screen (ใช้ API จาก backend)
- [ ] **Flutter**: Gallery screen — grid/list ของ snippets
- [ ] **Flutter**: Snippet detail screen — syntax highlight + Copy button
- [ ] **Flutter**: Search bar
- [ ] Verify: Login → เห็น gallery → เปิด snippet → copy code ได้

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
| Web | Vite + React + TypeScript + Tailwind CSS + HeroUI + React Router |
| Editor/Preview | Sandpack by CodeSandbox |
| Mobile | Flutter |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + HttpOnly Cookie + bcrypt |
