# NEMU - Lost & Found for UMM Students

**NEMU** is a mobile **lost and found** application specifically designed for students of Universitas Muhammadiyah Malang (UMM). The application helps students report lost or found items around campus, making it easier for items to be returned to their owners.

This project was created as an assessment assignment for the **Mobile Programming** course (Informatics Laboratory, UMM).

## Background

Items left behind on campus, such as wallets, phones, keys, student ID cards, bags, and other belongings, can be difficult to return to their owners. Information is often shared through group chats or WhatsApp statuses, making it easy to get lost and difficult to track. NEMU provides a dedicated platform for recording and searching for lost and found items.

## Objectives

- Make it easier for students to report lost or found items.
- Provide search and filter features to help users find items more easily.
- Connect item owners and finders directly.
- Clearly display the status of an item, from lost to returned to its owner.
- Keep user accounts and reports secure with authentication and database-level access rules.

## Features

| Feature                  | Description                                                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Register & Login**     | Users create an account with name, email, and password, then sign in. Sessions persist across app restarts and can be ended with **Keluar** (sign out).                                         |
| **Protected Routes**     | Guests are redirected to the login screen. Signed-in users go straight to the app and never see the login screen again.                                                                         |
| **Report an Item**       | Signed-in users fill out a report form including the report type (lost or found), item name, description, category, location, and contact information. Reports are saved to the cloud database. |
| **Search Items**         | Display a list of all reports with a search field based on the item name. Pull down to refresh.                                                                                                 |
| **Filter**               | Filter items by category (Wallet, Phone, Keys, Bag, Documents, Other) and campus location (building, library, cafeteria, mosque, parking area).                                                 |
| **Item Details**         | Display complete information including the item name, status, category, location, date, description, and reporter.                                                                              |
| **Contact Owner/Finder** | A button that opens WhatsApp to contact the reporter with a pre-filled message.                                                                                                                 |
| **Item Status**          | Three statuses: **Lost**, **Found**, and **Returned**. Only the owner of a report can update its status or delete it.                                                                           |
| **Campus Weather**       | Fetch current weather around UMM from the Open-Meteo API and display loading, error, and retry states.                                                                                          |
| **Secure Token Vault**   | A demo screen that saves, loads, and wipes a token using encrypted device storage (`expo-secure-store`).                                                                                        |
| **Cloud Health Check**   | A demo screen that tests the connection between the app and the Supabase backend.                                                                                                               |

The campus weather card uses the Open-Meteo Forecast API and requires an internet connection.

## Security

- **Encrypted session storage:** the login session is stored with `expo-secure-store` (iOS Keychain / Android Keystore), never in plain `AsyncStorage`. Large sessions are split into chunks to fit SecureStore's size limit.
- **Row Level Security (RLS):** access rules are enforced by the PostgreSQL database itself.
  - Any signed-in user can **read** all reports.
  - Users can only **create** reports under their own account.
  - Only the owner can **update** or **delete** a report.
- **No secrets in code:** the Supabase URL and public key are read from environment variables (`.env`), which is excluded from git. Only the public (publishable) key is used in the app. The secret key is never used.

## Pages

1. **Login / Register**: Email and password form with input trimming, keyboard hints, loading state, and error messages.
2. **Home**: Displays item cards, a search field, category and location filter chips, weather card, and a **+ Lapor Barang** button. Supports pull-to-refresh and loading/error states.
3. **Report Item**: A form for submitting an item report with validation for required fields.
4. **Item Details**: Displays complete item information and a contact button. Owners also see status controls and a delete option.
5. **Secure Token Vault**: Save, load, and wipe a token in encrypted storage.
6. **Cloud Health Check**: Test the connection to the cloud database.
7. **Guide (Panduan)**: In-app usage guide using catch-all routes.

## Tech Stack

- React Native with Expo and Expo Router (TypeScript)
- Supabase (PostgreSQL, Auth, Row Level Security)
- `expo-secure-store` for encrypted token storage
- Open-Meteo API for campus weather

## Project Structure

```
NEMU-Mobile/
├── .env.example              # template for environment variables
├── supabase/
│   └── schema.sql            # table + Row Level Security policies
└── src/
    ├── app/
    │   ├── _layout.tsx       # AuthProvider, StoreProvider, route guard
    │   ├── (auth)/           # login & register (public)
    │   └── (app)/            # home, report, detail, docs, vault, health (protected)
    ├── asset/
    │   └── SecureVaultDemo.tsx
    ├── components/           # CampusWeatherCard, Chip
    ├── lib/
    │   ├── supabase.ts       # Supabase client + SecureStore adapter
    │   ├── auth.tsx          # AuthContext (session, loading, sign out)
    │   ├── store.tsx         # data layer (select, insert, update, delete)
    │   └── weather.ts
    └── styles/
```

## How to Run

### 1. Clone and install

```bash
git clone https://github.com/amaliaauliaa/NEMU-Mobile.git

cd NEMU-Mobile

npm install
```

### 2. Set up the environment variables

Copy the template and fill in your own values:

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

You can find both in the Supabase dashboard under **Project Settings → API Keys** (use the **Publishable key**, never the Secret key). Ask a group member for the shared project values if you are using the team's Supabase project. The `.env` file is ignored by git and must never be committed.

### 3. Set up the database (once per Supabase project)

1. Open the Supabase dashboard → **SQL Editor → New query**.
2. Paste the contents of `supabase/schema.sql` and click **Run**.
3. Go to **Authentication → Sign In / Providers → Email**, turn off **Confirm email**, and save (for easier local testing).

### 4. Start the app

```bash
npx expo start -c
```

The `-c` flag clears the cache so the `.env` values are loaded. Scan the QR code using the **Expo Go** application on your phone. Make sure your laptop and phone are connected to the same Wi-Fi network.

If you experience connection issues, use:

```bash
npx expo start --clear --tunnel
```

On first launch you will see the login screen. Tap **Belum punya akun? Daftar di sini** to create an account.

## Group Members

| Name                  | Role |
| --------------------- | ---- |
| Farel Faiza           | -    |
| Ani Seila Nanda Putri | -    |
| Amalia Sanyoto        | -    |

## Note

This application is an educational project and is not officially affiliated with Universitas Muhammadiyah Malang.
