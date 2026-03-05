# Product Requirements Document: DevVault — The React Component Vault

| Field        | Detail                                      |
|--------------|---------------------------------------------|
| Project Name | DevVault — The React Component Vault        |
| Platform     | Web (Vite / React) & Mobile (Flutter)       |
| Deadline     | March 15, 2026                              |
| Version      | 1.1                                         |

---

## 1. Objective

DevVault is a **personal React component and code snippet vault** — a private library where developers save, organise, and rediscover their own reusable components over time.

The core goal is **fast reuse**: scroll a live visual gallery, spot the component by sight, then copy or open it immediately in the split-view editor. DevVault is not primarily a social code-sharing platform; sharing and social features are secondary and opt-in.

**Who is it for?** Individual developers who accumulate one-off components across projects and want a single searchable, visually browsable vault to retrieve them — instead of digging through old repos or gists.

---

## 2. Core Features (Functional Requirements)

### 2.1 Visual Component Gallery ⭐ Primary Feature

The main dashboard is a **scrollable grid of component cards**. Each card renders the stored component **live** using Sandpack `<SandpackPreview>` inside a sandboxed iframe.

- No screenshots. No static thumbnails. **Actual running code** is displayed on every card.
- Cards display: component title, language badge, privacy badge, and action buttons (view, delete).
- Clicking a card navigates to the **Component View page** for that component.
- Gallery supports search (filter by title or language) and folder-based filtering via the sidebar.
- Sandpack instances are **lazy-loaded** (via Intersection Observer) to maintain performance when the gallery contains many cards.

### 2.2 Component View Page — Tab UI

When opening a single component (`/components/:id`), the user sees a **tab interface** with two tabs:

- **Preview tab** (default): Full interactive `<SandpackProvider>` + `<SandpackPreview>` — the rendered component is **clickable and fully interactive** (buttons work, calendars navigate, forms submit). This is not a screenshot.
- **Code tab**: Read-only syntax-highlighted code display using `<SandpackCodeEditor readOnly />` — beautiful coloured syntax with no editing capability.
- The page also provides an **"Edit"** button to navigate to the split-view editor.

### 2.3 Split-View Editor

Full editing environment for creating and modifying components. Used only on create/edit routes.

- **Left pane**: `<SandpackCodeEditor>` — full-featured in-browser code editor with syntax highlighting.
- **Right pane**: `<SandpackPreview>` — live sandboxed preview that updates in real time and is **interactive**.
- Supports three sandbox templates: **React**, **Vanilla JS**, **HTML + CSS**.
- Toggle between **real-time** mode (preview updates as you type) and **manual run** mode (press "Run" to execute).
- Routes: `/components/new` (create) and `/components/:id/edit` (edit existing).

### 2.4 Recursive Folder System

Nested folder structure for organising components into logical groups.

- Folders can be nested to any depth (e.g., `UI > Buttons > Icon Buttons`).
- Sidebar displays a recursive folder tree with expand/collapse.
- Actions: create folder, rename, delete, move component into a folder.
- Breadcrumb navigation reflects the current folder path.

### 2.4 Auth System

Secure authentication using industry-standard patterns.

- Register and login with email + password.
- Passwords hashed with **bcrypt**.
- Sessions managed via **JWT stored in HttpOnly Cookie** — never exposed to JavaScript.
- `GET /auth/me` endpoint for session verification.
- All protected routes redirect to `/login` if the user is not authenticated.

### 2.5 Privacy Levels

Each component carries one of three privacy settings (default: **Private**):

| Level        | Visibility                                                        |
|--------------|-------------------------------------------------------------------|
| Private      | Owner only — no one else can view or access it.                   |
| Friends-only | Visible to users the owner mutually follows (social graph).       |
| Public       | Visible to anyone; any visitor can view and copy the code.        |

### 2.6 Social — Follow System

Lightweight social layer to enable friends-only sharing.

- Users can follow / unfollow other users.
- Friends-only components are surfaced in the feeds of mutual followers.
- Public profile pages (`/u/:username`) display public components.

### 2.7 Flutter Mobile App (Read-Only)

A companion mobile app for browsing the vault on the go.

- Browse components in a scrollable gallery (grid or list).
- Component detail view: **static syntax-highlighted code view** + one-tap **Copy** button.
- Search by title or language.
- Login via the same backend JWT API.
- **No live Sandpack preview** — Sandpack requires a full browser environment; Flutter WebView cannot reliably sandbox arbitrary React execution. The mobile experience is intentionally read-and-copy only.

---

## 3. Technical Stack & Architecture

| Layer            | Technology                                                                 |
|------------------|----------------------------------------------------------------------------|
| Web Frontend     | Vite + React 19 + TypeScript + Tailwind CSS + HeroUI + React Router v7 + Zustand |
| Editor / Preview | Sandpack by CodeSandbox (`@codesandbox/sandpack-react`)                    |
| Mobile           | Flutter (Dart) — read-only gallery + copy                                  |
| Backend          | Node.js + Express + TypeScript                                             |
| Database         | MongoDB Atlas + Mongoose ODM                                               |
| Auth             | JWT + HttpOnly Cookie + bcrypt                                             |
| Deployment       | Vercel (frontend) + Render (backend)                                       |

---

## 4. Non-Functional Requirements

| Requirement        | Detail                                                                                                              |
|--------------------|---------------------------------------------------------------------------------------------------------------------|
| Security (Sandbox) | Sandpack runs entirely in the browser sandbox — **no user-submitted code ever executes on the server**.             |
| Performance        | Gallery lazy-loads Sandpack instances using Intersection Observer to prevent rendering all iframes simultaneously.  |
| API Security       | All non-public API routes are protected by JWT verification middleware; unauthenticated requests receive `401`.     |
| CORS Policy        | CORS is restricted to the production frontend URL only; wildcard origins are not permitted in production.           |
| Mobile Scope       | Flutter app is intentionally read-only; no editor or live preview to avoid unreliable sandboxing in WebView.        |