# Oksana's 3D Prints

A gallery of 3D printed projects — models, materials, and build notes for
each print, managed through a private admin page backed by Supabase.

## Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth, Storage) for prints, photos, and the admin login

## Development

```sh
npm install
```

Copy the environment template and fill in your Supabase project's URL and
publishable key (Supabase dashboard → Project Settings → API Keys):

```sh
cp .env.example .env
```

Then run the database setup once — open the Supabase dashboard's SQL Editor
and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `prints`
table, its row-level-security policies, and the `print-images` storage
bucket.

Create your admin login in the Supabase dashboard under **Authentication →
Users → Add user** (email + password). That's the account you'll sign in
with at `/admin/login`.

```sh
npm run dev
```

## Admin

Visit `/admin/login` to sign in, then `/admin` to add, edit, or delete
prints. Photos upload directly to Supabase Storage.
