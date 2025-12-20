# Environment Variables Setup

To run this application, you need to set up your Supabase credentials.

1. Create a `.env` file in the root directory
2. Add the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

**Important:** The `.env` file is already in `.gitignore` to prevent committing secrets.

