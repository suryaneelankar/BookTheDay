# Project Structure

## Root Layout

```
BookTheDay/
├── App.js                  # App entry: Redux Provider + MainNavigation + Firebase setup
├── index.js                # RN entry point
├── redux/                  # Global state
│   ├── store.js            # createStore with commonReducer
│   ├── reducer.js          # Single combined reducer + initialState
│   ├── actions.js          # Action creators
│   └── actionType.js       # Action type string constants
└── src/
    ├── apiconfig.js        # BASE_URL and LocalHostUrl exports
    ├── assets/             # Images, SVGs, fonts
    ├── commonFields/       # Reusable form field components
    ├── components/         # Shared UI components
    ├── navigations/        # Navigation setup
    ├── screens/            # Feature screens grouped by domain
    └── utils/              # Helpers, constants, scaling
```

## `src/` Breakdown

### `assets/`
Static resources organized by type:
- `svgs/` — SVG icons grouped by feature (categories, tabIcons, productBanners, etc.)
- `fonts/` — Inter, LeagueSpartan, Manrope, Poppins TTF files
- `categoriesPngs/`, `vendorIcons/`, `profilesvgs/` — domain-specific icons

### `commonFields/`
Reusable form input wrappers used across vendor onboarding forms:
- `TextField.js`, `ChooseFileField.js`, `ChooseMenuField.js`, `AdditionalImages.js`

### `components/`
Shared UI components used across multiple screens:
- `NavigationHeader.js` — standard screen header with back button
- `GradientButton.js` — primary CTA button
- `AlertModal.js`, `PaymentConfirmationModal.js` — modal dialogs
- `LocationPicker.js`, `userLocationPicker.js` — location selection
- `FloatingCartButton.js`, `ProductInfoCard.js`, `PriceOptions.js`

### `navigations/`
- `index.js` — root navigator; switches between `AuthNavigator` and `HomeNavigator` based on `checkStoredToken` Redux state
- `UserTabs.js` — bottom tab navigator for customers
- `VendorTabs.js` — bottom tab navigator for vendors

### `screens/`
Screens are grouped by domain:

| Folder | Purpose |
|---|---|
| `LandingScreen/` | Onboarding, login, OTP, registration |
| `Home/` | Home feed, trending details |
| `Categories/` | Category listing, product details, cart |
| `Events/` | Event listing and detail view |
| `Caterings/` | Catering listing and detail view |
| `Bookings/` | Booking overview for halls and caterings |
| `Profile/` | User profile, bookings, edit profile, sub-screens |
| `PaymentScreens/` | Payment success/failure screens |
| `Location/` | Location selection and confirmation |
| `KYC/` | Aadhaar upload for users and vendors |
| `GiveOnRent/` | Vendor product rental listing |
| `VendorScreens/` | Vendor dashboard, add/edit halls & caterings, vendor profile |
| `Admin/` | Admin dashboard |

### `utils/`
- `GlobalColors.js` — named color constants (ORANGE500, BLACK500, etc.)
- `themevariable.js` — full design token set (colors as `Color_XXXXXX`, font family names)
- `scalingMetrics.js` — `horizontalScale`, `verticalScale`, `moderateScale`, `getFontSize` for responsive sizing
- `GlobalFunctions.js` — shared utility functions
- `StoreAuthToken.js` — keychain helpers for persisting/retrieving auth tokens

## Conventions

- **Screens** use `index.js` as the default export when a folder represents a single screen entry point
- **Navigation screen names** match the component/file name (e.g. `"ViewCatDetails"`, `"AddFunctionalHall"`)
- **All headers** use the shared `<NavigationHeader>` component wrapped in `<SafeAreaView edges={['top']}>`
- **Colors** — use `themevariable.js` tokens for new UI; `GlobalColors.js` exists but has limited entries
- **Scaling** — always use `horizontalScale`/`verticalScale`/`moderateScale` from `scalingMetrics.js` for dimensions and `getFontSize` for font sizes
- **Auth tokens** stored via `react-native-keychain` through helpers in `StoreAuthToken.js`
- **Redux** — add new action types to `actionType.js`, action creators to `actions.js`, and handle in `reducer.js`
