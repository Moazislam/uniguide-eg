# UniGuide — منصة قرارات الجامعة في مصر

Egypt's University Decision Platform — built with Next.js 15 + Supabase.

## Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (UniGuide tokens: cream / amber / blue)
- **Database**: Supabase (PostgreSQL)
- **Fonts**: Cairo + Playfair Display

## Features (v1)
- University search & filtering
- Student onboarding & AI major matching
- Side-by-side comparison (up to 3)
- Majors explorer with career paths
- Personal shortlist & profile
- Bilingual AR/EN with RTL support

## Getting Started
```bash
npm install
cp .env.local.example .env.local   # add Supabase credentials
# Run supabase/schema.sql in Supabase SQL editor
npm run dev
```

## Project Structure
```
src/app/               → pages (home, universities, majors, compare, onboarding, profile)
src/components/        → Navbar, Footer, UniversityCard, SearchBar, CompareButton
src/lib/               → Supabase client/server, data fetching
src/types/             → TypeScript types
supabase/schema.sql    → Full DB schema + seed data
```

Launch target: July 2026 — before Thanaweya Amma results season.
