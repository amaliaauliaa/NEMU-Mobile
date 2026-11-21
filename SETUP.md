# NEMU - Modul 4 setup

1. Install:  npx expo install @supabase/supabase-js expo-secure-store
2. Salin .env.example -> .env, isi URL & anon key dari Supabase (Project Settings -> API)
3. Supabase -> SQL Editor -> jalankan supabase/schema.sql
4. Supabase -> Authentication -> Sign In / Providers -> Email -> matikan "Confirm email" -> Save
5. Pindahkan file lama ke src/app/(app)/ (lihat chat), timpa dengan file dari zip ini
6. Jalankan: npx expo start -c   (-c wajib supaya .env terbaca)
