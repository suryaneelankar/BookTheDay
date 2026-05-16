# Tech Stack & Build System

## Core

- **React Native** 0.74.0 (JavaScript, not TypeScript for source files)
- **React** 18.2.0
- **Node.js** ≥ 18 required

## State Management

- **Redux** 5.x with `react-redux` 9.x
- Single `commonReducer` in `redux/reducer.js`
- Action types defined as string constants in `redux/actionType.js`
- Plain `createStore` (no Redux Toolkit)

## Navigation

- **React Navigation** 6.x
  - `@react-navigation/native-stack` for stack navigation
  - `@react-navigation/bottom-tabs` for tab bars
- Auth vs. Home split via `checkStoredToken` Redux state
- Separate tab navigators: `UserTabs` and `VendorTabs`

## Networking

- **Axios** for all API calls
- Base URL configured in `src/apiconfig.js` — import `BASE_URL` (default) or `LocalHostUrl`

## Key Libraries

| Purpose | Library |
|---|---|
| Authentication | `@msg91comm/sendotp-react-native` |
| Payments | `react-native-razorpay` |
| Push Notifications | `@react-native-firebase/messaging` |
| Secure Token Storage | `react-native-keychain` |
| Maps & Location | `react-native-maps`, `react-native-get-location` |
| Images | `react-native-fast-image`, `react-native-image-picker` |
| SVGs | `react-native-svg`, `react-native-svg-transformer` |
| Calendar | `react-native-calendars` |
| Dropdowns | `react-native-element-dropdown` |
| Gradients | `react-native-linear-gradient` |
| Modals | `react-native-modal`, `react-native-actions-sheet` |
| Date Formatting | `moment` |
| Splash Screen | `react-native-splash-screen` |

## Linting & Formatting

- **ESLint** extending `@react-native` config (`.eslintrc.js`)
- **Prettier** 2.8.8 with:
  - `singleQuote: true`
  - `trailingComma: 'all'`
  - `bracketSpacing: false`
  - `arrowParens: 'avoid'`

## Common Commands

```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios

# Lint
npm run lint

# Tests
npm test
```

## Build Notes

- Android keystore: `android/app/release.keystore` and `booktheday.jks`
- Google Services config: `android/app/google-services.json`
- Metro config: `metro.config.js` (includes SVG transformer)
- Babel config: `babel.config.js` (uses `@react-native/babel-preset`)
