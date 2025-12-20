# RLS (Row Level Security) Setup for Public Access

## Overview
The frontend has been updated to support public viewing of instructor profiles and reviews. The following RLS policies must be configured in Supabase to allow anonymous users to view this data.

## Required RLS Policies

### 1. `instructor_profiles` Table
**Policy Name:** `Public can view instructor profiles`
- **Operation:** SELECT
- **Target Roles:** `anon`, `authenticated`
- **Policy:** Allow SELECT for all rows
- **SQL:**
```sql
CREATE POLICY "Public can view instructor profiles"
ON instructor_profiles
FOR SELECT
TO anon, authenticated
USING (true);
```

### 2. `reviews` Table
**Policy Name:** `Public can view reviews`
- **Operation:** SELECT
- **Target Roles:** `anon`, `authenticated`
- **Policy:** Allow SELECT for all rows
- **SQL:**
```sql
CREATE POLICY "Public can view reviews"
ON reviews
FOR SELECT
TO anon, authenticated
USING (true);
```

## Protected Operations (Keep Existing Policies)

### `instructor_profiles` Table
- **INSERT/UPDATE:** Only authenticated instructors can create/update their own profile
- **DELETE:** Only authenticated instructors can delete their own profile

### `reviews` Table
- **INSERT:** Only authenticated users can create reviews
- **UPDATE/DELETE:** Only the review author can modify/delete their review

## Notes

1. The frontend now fetches reviews without joining the `profiles` table to avoid RLS issues
2. Reviewer emails are not exposed to public users (shown as "Anonymous Reviewer")
3. All instructor profile and review viewing is now public
4. Authentication is still required for:
   - Creating/editing instructor profiles (`/admin`)
   - Writing reviews
   - Accessing protected routes

## Testing

After setting up RLS policies:
1. Log out of the application
2. Navigate to `/instructors` - should show all instructors
3. Click on an instructor - should show full profile and reviews
4. Verify that you cannot edit profiles or write reviews without logging in

