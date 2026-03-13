# Chunk 8 — Flutter Mobile App Implementation Plan

> **Status**: 🔲 todo → 🔄 in-progress  
> **Branch**: `feat/flutter-mobile` (from `develop`)  
> **Depends on**: Chunk 1 (Auth API ready)

---

## Overview

This chunk implements a Flutter mobile app for DevVault that allows users to:
- Login and authenticate
- Browse their components in a gallery
- **Preview components visually** (rendered components, not just code)
- View component code with syntax highlighting
- Copy code to clipboard
- Search components

> **Key Features:**
> - ✅ **Preview Components** - แสดง components จริงๆ ผ่าน WebView (โหลด public preview page)
> - ❌ **No Split Editor** - ไม่มี split-view editor
> - ❌ **No Code Editing** - ไม่สามารถแก้ไข code ได้
> - ✅ **Read-only + Copy** - ดู code และ copy ได้

---

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Flutter App
        UI[UI Layer]
        State[State Management<br/>Provider/Riverpod]
        API[API Client<br/>Dio]
        Storage[Local Storage<br/>SharedPreferences]
        WebView[WebView<br/>for Component Preview]
    end
    
    subgraph Screens
        Login[Login Screen]
        Gallery[Gallery Screen]
        Detail[Component Detail Screen]
        Search[Search Screen]
    end
    
    subgraph Backend
        AuthAPI[/auth/* endpoints]
        CompAPI[/components/* endpoints]
        WebApp[Web App<br/>/c/:id preview page]
    end
    
    UI --> Screens
    Screens --> State
    State --> API
    API --> AuthAPI
    API --> CompAPI
    Storage --> State
    Detail --> WebView
    WebView --> WebApp
```

---

## Project Structure

```
mobile/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── config/
│   │   └── api_config.dart
│   ├── models/
│   │   ├── user.dart
│   │   ├── component.dart
│   │   └── auth_response.dart
│   ├── services/
│   │   ├── api_service.dart
│   │   ├── auth_service.dart
│   │   └── storage_service.dart
│   ├── providers/
│   │   ├── auth_provider.dart
│   │   └── component_provider.dart
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── gallery_screen.dart
│   │   ├── component_detail_screen.dart
│   │   └── search_screen.dart
│   ├── widgets/
│   │   ├── component_card.dart
│   │   ├── code_viewer.dart
│   │   ├── component_preview.dart
│   │   └── search_bar.dart
│   └── theme/
│       └── app_theme.dart
├── pubspec.yaml
└── README.md
```

---

## Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^5.4.0                 # HTTP client
  shared_preferences: ^2.2.0  # Local storage for cookies/tokens
  provider: ^6.1.0            # State management
  google_fonts: ^6.1.0        # Typography
  flutter_highlight: ^0.7.0   # Syntax highlighting
  highlight: ^0.7.0           # Syntax highlighting core
  flutter_spinkit: ^5.2.0     # Loading indicators
  webview_flutter: ^4.5.0     # WebView for component preview
  url_launcher: ^6.2.0        # Open URLs in browser
```

---

## Implementation Steps

### Phase 1: Project Setup

#### Step 1.1: Create Flutter Project
```bash
cd final2
flutter create mobile
cd mobile
```

#### Step 1.2: Add Dependencies
- [ ] Add dependencies to `pubspec.yaml`
- [ ] Run `flutter pub get`

#### Step 1.3: Configure API
- [ ] Create `lib/config/api_config.dart` with base URL configuration
- [ ] Support both development and production URLs
- [ ] Configure web app URL for WebView preview

---

### Phase 2: Core Services

#### Step 2.1: API Service
- [ ] Create `lib/services/api_service.dart`
- [ ] Configure Dio with base URL
- [ ] Set up interceptors for cookies/auth
- [ ] Handle errors uniformly

#### Step 2.2: Storage Service
- [ ] Create `lib/services/storage_service.dart`
- [ ] Implement session persistence using SharedPreferences
- [ ] Store user info locally

#### Step 2.3: Auth Service
- [ ] Create `lib/services/auth_service.dart`
- [ ] Implement login/logout methods
- [ ] Handle session cookies

---

### Phase 3: Models

#### Step 3.1: User Model
- [ ] Create `lib/models/user.dart`
- [ ] Fields: id, username, email

#### Step 3.2: Component Model
- [ ] Create `lib/models/component.dart`
- [ ] Fields: id, title, description, code, cssCode, language, template, privacy, createdAt

---

### Phase 4: State Management

#### Step 4.1: Auth Provider
- [ ] Create `lib/providers/auth_provider.dart`
- [ ] Manage authentication state
- [ ] Provide login/logout methods

#### Step 4.2: Component Provider
- [ ] Create `lib/providers/component_provider.dart`
- [ ] Manage component list state
- [ ] Provide fetch/search methods

---

### Phase 5: Screens

#### Step 5.1: Login Screen
- [ ] Create `lib/screens/login_screen.dart`
- [ ] Email/password form
- [ ] Call login API
- [ ] Navigate to gallery on success

#### Step 5.2: Gallery Screen
- [ ] Create `lib/screens/gallery_screen.dart`
- [ ] Display components in grid/list
- [ ] Pull-to-refresh
- [ ] Navigate to detail on tap

#### Step 5.3: Component Detail Screen ⭐
- [ ] Create `lib/screens/component_detail_screen.dart`
- [ ] **Tab 1: Preview** - WebView loading `/c/:id` from web app
- [ ] **Tab 2: Code** - Syntax-highlighted code view
- [ ] Copy button for code
- [ ] Component info (title, description, language)

#### Step 5.4: Search Screen
- [ ] Create `lib/screens/search_screen.dart`
- [ ] Search bar
- [ ] Filter by title/language
- [ ] Display results

---

### Phase 6: Widgets

#### Step 6.1: Component Card
- [ ] Create `lib/widgets/component_card.dart`
- [ ] Display title, language badge, privacy badge
- [ ] Tap to view detail

#### Step 6.2: Code Viewer
- [ ] Create `lib/widgets/code_viewer.dart`
- [ ] Syntax highlighting using flutter_highlight
- [ ] Copy to clipboard button
- [ ] Support multiple languages (JavaScript, TypeScript, HTML, CSS)

#### Step 6.3: Component Preview (WebView) ⭐
- [ ] Create `lib/widgets/component_preview.dart`
- [ ] Use `webview_flutter` to load `/c/:id` page
- [ ] Configure WebView settings
- [ ] Handle loading states

---

### Phase 7: Theme & Polish

#### Step 7.1: App Theme
- [ ] Create `lib/theme/app_theme.dart`
- [ ] Dark theme matching web app
- [ ] Custom colors and typography

#### Step 7.2: Loading States
- [ ] Add loading indicators
- [ ] Error states
- [ ] Empty states

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Login |
| `/auth/logout` | POST | Logout |
| `/auth/me` | GET | Get current user |
| `/components` | GET | List user's components |
| `/components/:id` | GET | Get component detail |

## WebView Preview

| URL | Purpose |
|-----|---------|
| `{WEB_APP_URL}/c/:id` | Load public component preview page |

---

## Component Detail Screen Layout

```
┌─────────────────────────────────────────┐
│  ← Component Title            [Copy]    │
├─────────────────────────────────────────┤
│  [Preview]  [Code]                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │    WebView: /c/:id              │   │
│  │    (Live Preview)               │   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ← Component Title            [Copy]    │
├─────────────────────────────────────────┤
│  [Preview]  [Code]                       │
├─────────────────────────────────────────┤
│  1   import React from 'react';         │
│  2   import { Button } from '@heroui';  │
│  3                                       │
│  4   export default function App() {    │
│  5     return <Button>Click me</Button>;│
│  6   }                                   │
│  7                                       │
└─────────────────────────────────────────┘
```

---

## Verification Checklist

- [ ] Can login with email/password
- [ ] Session persists after app restart
- [ ] Can view component gallery
- [ ] Can view component **preview** (WebView with live rendering)
- [ ] Can view component **code** with syntax highlighting
- [ ] Can copy code to clipboard
- [ ] Can search components
- [ ] Can logout
- [ ] Works on both iOS and Android

---

## Notes

1. **Preview via WebView**: Component preview uses WebView to load the public component page `/c/:id` from the deployed web app. This allows full Sandpack rendering without reimplementing in Flutter.

2. **No Code Editing**: Mobile app is read-only. Users can view and copy code but cannot edit.

3. **Cookie-based Auth**: The backend uses HttpOnly cookies for authentication. Flutter needs to handle cookies properly with Dio.

4. **Syntax Highlighting**: Use `flutter_highlight` package for code syntax highlighting. Supports JavaScript, TypeScript, HTML, CSS, etc.

5. **Platform Support**: Target both iOS and Android.

---

## File Creation Order

1. `mobile/pubspec.yaml` - Update dependencies
2. `mobile/lib/config/api_config.dart`
3. `mobile/lib/models/user.dart`
4. `mobile/lib/models/component.dart`
5. `mobile/lib/services/storage_service.dart`
6. `mobile/lib/services/api_service.dart`
7. `mobile/lib/services/auth_service.dart`
8. `mobile/lib/providers/auth_provider.dart`
9. `mobile/lib/providers/component_provider.dart`
10. `mobile/lib/theme/app_theme.dart`
11. `mobile/lib/widgets/component_card.dart`
12. `mobile/lib/widgets/code_viewer.dart`
13. `mobile/lib/widgets/component_preview.dart`
14. `mobile/lib/screens/login_screen.dart`
15. `mobile/lib/screens/gallery_screen.dart`
16. `mobile/lib/screens/component_detail_screen.dart`
17. `mobile/lib/screens/search_screen.dart`
18. `mobile/lib/app.dart`
19. `mobile/lib/main.dart`
