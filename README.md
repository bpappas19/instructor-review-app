# Instructor Review App

## Purpose
This project is a modern web application for discovering, reviewing, and managing fitness instructors. The goal is to create a clean, visually polished product that allows users to find instructors by category, view detailed profiles and reviews, and allows instructors to manage their own public profiles.

Think of this as a “Yelp-style” platform for fitness instructors, optimized for clarity, usability, and long-term extensibility.

---

## Core Pages (Authoritative Scope)

### 1. Home Page
- Visually driven landing page that matches the provided design mockup
- Hero section with headline, subtext, and search bar
- Category shortcuts (Yoga, HIIT, Pilates, Cycling, Strength, Dance, Boxing)
- “Popular Instructors” section with instructor cards
- Top navigation with logo, Sign Up, and Log In

**Important:**  
The home page UI should closely match the provided HTML/CSS design. If exact code is pasted in, preserve styling and layout.

---

### 2. Instructor Directory Page
- Grid or list of instructors
- Filterable by:
  - Category
  - Rating
- Reuses the same instructor card component as the home page
- Clicking a card routes to the instructor profile page

---

### 3. Instructor Profile & Reviews Page
- Individual page per instructor
- Displays:
  - Profile image
  - Bio
  - Categories / specialties
  - Average rating
  - List of reviews
- Reviews are initially read-only

---

### 4. Authentication Pages
- Sign Up page
- Log In page
- Secure authentication
- Supports role-based access (user vs instructor)

---

### 5. Instructor Admin Dashboard
- Accessible only to authenticated instructors
- Allows instructors to:
  - Create and edit their profile
  - Upload a profile image
  - Edit bio and specialties
- Instructors may only edit their own data
- Instructor dashboard access is controlled by user role


---

## Recommended Tech Stack (Follow This)

### Frontend
- React (functional components)
- Vite
- Tailwind CSS
- React Router

### Backend / Auth / Database
- Supabase
  - Authentication (email/password)
  - Postgres database
  - Row-level security

## Core Tables (Authoritative Backend Contract)

- profiles  
  - One row per authenticated user  
  - `id` matches `auth.users.id`  
  - Stores user role: `'user' | 'instructor'`

- instructor_profiles  
  - One-to-one with `profiles`  
  - Stores public instructor data (bio, categories, etc.)  
  - Editable only by the instructor themselves

- reviews  
  - Written by authenticated users  
  - Belong to an instructor profile  
  - Publicly readable


---

## Architecture Guidelines
- Clean, readable code over clever abstractions
- Reusable components (InstructorCard, RatingStars, CategoryBadge)
- Clear separation between:
  - pages
  - components
  - services (Supabase client, auth helpers)
- Avoid unnecessary libraries unless clearly justified

---

## Development Phases
1. Static UI and routing
2. Authentication
3. Instructor profiles
4. Reviews (read-only → write)
5. Instructor admin dashboard
6. UI polish and refinement

---

## Notes for AI Assistance (Cursor)
- Follow the defined scope exactly
- Do not invent unrelated features
- Maintain UI consistency across all pages
- Ask before making major architectural changes

## Instructor Role Logic (Do Not Deviate)

- All users start with role = 'user'
- Users become instructors by explicitly selecting "Become Instructor"
- This action updates the backend role and enables access to the instructor admin dashboard
- Instructor-only pages must be protected via role checks
- Instructors may only edit their own instructor profile
