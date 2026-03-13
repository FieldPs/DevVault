# DevVault Mobile

A Flutter mobile app for DevVault - Your React Component Vault.

## Features

- 🔐 **Authentication** - Login with email/password
- 📱 **Component Gallery** - Browse your components in a grid
- 👁️ **Live Preview** - View component preview via WebView
- 💻 **Code View** - Syntax-highlighted code viewer
- 📋 **Copy Code** - Copy code to clipboard
- 🔍 **Search** - Search components by title

## Tech Stack

- **Flutter** - Cross-platform mobile framework
- **Provider** - State management
- **Dio** - HTTP client
- **SharedPreferences** - Local storage
- **flutter_highlight** - Syntax highlighting
- **webview_flutter** - Component preview

## Getting Started

### Prerequisites

- Flutter SDK >= 3.2.0
- Android Studio / Xcode (for iOS)

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Run the app:
   ```bash
   flutter run
   ```

## Configuration

Edit `lib/config/api_config.dart` to change the API and Web URLs:

```dart
// Set to true for production builds
static const bool _isProduction = false;

// Backend API URLs
static const String devApiUrl = 'http://localhost:3000';
static const String prodApiUrl = 'https://devvault-api.onrender.com';

// Web App URLs (for WebView preview)
static const String devWebUrl = 'http://localhost:5173';
static const String prodWebUrl = 'https://devvault-web.vercel.app';
```

## Project Structure

```
lib/
├── main.dart              # App entry point
├── app.dart               # Main app widget and routes
├── config/
│   └── api_config.dart    # API configuration
├── models/
│   ├── user.dart          # User model
│   └── component.dart     # Component model
├── services/
│   ├── storage_service.dart    # Local storage
│   ├── api_service.dart        # HTTP client
│   ├── auth_service.dart       # Authentication
│   └── component_service.dart  # Component API
├── providers/
│   ├── auth_provider.dart      # Auth state
│   └── component_provider.dart # Component state
├── screens/
│   ├── login_screen.dart       # Login page
│   ├── gallery_screen.dart     # Component gallery
│   ├── component_detail_screen.dart  # Detail view
│   └── search_screen.dart      # Search page
├── widgets/
│   ├── component_card.dart     # Component card
│   ├── code_viewer.dart        # Syntax-highlighted code
│   └── component_preview.dart  # WebView preview
└── theme/
    └── app_theme.dart          # App theme
```

## Screenshots

### Login
- Email/password authentication
- Error handling

### Gallery
- Grid view of components
- Pull-to-refresh
- Language and privacy badges

### Component Detail
- **Preview Tab** - WebView showing live component preview
- **Code Tab** - Syntax-highlighted code with copy button
- Component info (title, description, language)

### Search
- Real-time search
- Results grid

## Notes

1. **Preview via WebView**: Component preview uses WebView to load the public component page `/c/:id` from the web app.

2. **Read-only**: The mobile app is read-only. Users can view and copy code but cannot edit.

3. **Cookie-based Auth**: The backend uses HttpOnly cookies for authentication.

4. **Platform Support**: Works on both iOS and Android.
