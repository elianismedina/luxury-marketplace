# Setup Instructions

## 1. Create `.env` file

Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=https://hkshkaxujtygajefyudc.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

## 2. Get your Supabase Anon Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **anon/public** key
5. Paste it in the `.env` file

## 3. Important Note

⚠️ **Authentication Required**: The `vehicles` table requires a `user_id` from authenticated users. 

Currently, the app will try to insert vehicles without authentication, which will fail due to Row Level Security (RLS) policies.

### Next Steps:
- Add Supabase Authentication to the app
- Or temporarily disable RLS for testing (not recommended for production)

## 4. Test the App

After adding your anon key:
```bash
npm run dev
```

The app should now:
- Load vehicles from Supabase
- Save new vehicles to Supabase
- Update existing vehicles in Supabase
- Delete vehicles from Supabase

---

**Note**: You'll need to implement authentication before the app can fully work with the database.

