-- UniGuide Egypt — Supabase Schema
-- Run this in your Supabase SQL editor

-- ─── Extensions ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Universities ───────────────────────────────────────────────
create table if not exists universities (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name_ar         text not null,
  name_en         text not null,
  type            text not null check (type in ('public','private','international')),
  system          text not null default 'egyptian' check (system in ('egyptian','american','british','french')),
  location_ar     text not null,
  location_en     text not null,
  governorate     text,
  metro_area      text,
  logo_url        text,
  cover_url       text,
  founded_year    integer,
  website         text,
  description_ar  text,
  description_en  text,
  tuition_min     integer,
  tuition_max     integer,
  tuition_currency text default 'EGP',
  accreditations  text[],
  total_students  integer,
  faculties_count integer,
  ranking_egypt   integer,
  created_at      timestamptz default now()
);

create index on universities (type);
create index on universities (ranking_egypt);

-- ─── Majors ────────────────────────────────────────────────────
create table if not exists majors (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name_ar         text not null,
  name_en         text not null,
  category        text not null check (category in (
    'medicine','engineering','business','arts','science','law',
    'pharmacy','dentistry','vet','education','media','computer_science',
    'architecture','other'
  )),
  description_ar  text,
  description_en  text,
  duration_years  integer not null default 4,
  career_paths    text[],
  required_tracks text[],
  created_at      timestamptz default now()
);

create index on majors (category);

-- ─── University Majors (join) ────────────────────────────────────
create table if not exists university_majors (
  id                    uuid primary key default uuid_generate_v4(),
  university_id         uuid not null references universities(id) on delete cascade,
  major_id              uuid not null references majors(id) on delete cascade,
  tuition_per_year      integer,
  currency              text default 'EGP',
  min_score             numeric(5,2),
  available_seats       integer,
  language              text not null default 'arabic' check (language in ('arabic','english','bilingual')),
  admission_requirements text[],
  created_at            timestamptz default now(),
  unique(university_id, major_id)
);

create index on university_majors (university_id);
create index on university_majors (major_id);

-- ─── Student Profiles ────────────────────────────────────────────
create table if not exists student_profiles (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  name_ar             text,
  name_en             text,
  track               text check (track in ('science','math','arts','ig','american','french')),
  score               numeric(5,2),
  graduation_year     integer,
  governorate         text,
  home_governorate    text,
  preferred_locations text[],
  mobility_preference text check (mobility_preference in ('same_city','nearby','anywhere')),
  budget_min          integer,
  budget_max          integer,
  preferred_language  text check (preferred_language in ('arabic','english','bilingual')),
  preferred_university_types text[],
  preferred_systems   text[],
  interests           text[],
  shortlist           text[],
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table student_profiles enable row level security;
create policy "Users can view own profile" on student_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on student_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on student_profiles for update using (auth.uid() = user_id);

-- ─── RLS for universities/majors (public read) ───────────────────
alter table universities enable row level security;
create policy "Public read universities" on universities for select using (true);

alter table majors enable row level security;
create policy "Public read majors" on majors for select using (true);

alter table university_majors enable row level security;
create policy "Public read university_majors" on university_majors for select using (true);

-- ─── Sample Data ────────────────────────────────────────────────
insert into universities (slug, name_ar, name_en, type, location_ar, location_en, founded_year, faculties_count, tuition_min, tuition_max, ranking_egypt, description_ar, description_en) values
  ('cairo-university',    'جامعة القاهرة',        'Cairo University',         'public',  'الجيزة',     'Giza',          1908, 25, 0,       0,       1, 'أعرق الجامعات المصرية وأكبرها.', 'Egypt''s oldest and largest university.'),
  ('ain-shams-university','جامعة عين شمس',        'Ain Shams University',     'public',  'القاهرة',    'Cairo',         1950, 15, 0,       0,       2, 'جامعة حكومية كبرى في القاهرة.', 'Major public university in Cairo.'),
  ('alexandria-university','جامعة الإسكندرية',    'Alexandria University',    'public',  'الإسكندرية', 'Alexandria',    1938, 16, 0,       0,       3, 'الجامعة الحكومية الرئيسية في الإسكندرية.', 'Main public university in Alexandria.'),
  ('guc',                 'الجامعة الألمانية',     'German University in Cairo','private', 'القاهرة الجديدة','New Cairo',  2003,  8, 120000, 220000,  4, 'جامعة خاصة ألمانية المنهج بالقاهرة الجديدة.', 'German-system private university in New Cairo.'),
  ('auc',                 'الجامعة الأمريكية',     'American University in Cairo','international','القاهرة','Cairo',      1919,  7, 300000, 500000,  5, 'أعرق الجامعات الخاصة في مصر بنظام أمريكي.', 'Egypt''s oldest private university with an American system.'),
  ('msa-university',      'جامعة مصر للعلوم والتكنولوجيا','MSA University', 'private', 'القاهرة الجديدة','New Cairo',  1996, 10, 80000,  160000,  6, 'جامعة خاصة رائدة في مصر الجديدة.', 'Leading private university in New Cairo.'),
  ('nile-university',     'جامعة النيل',           'Nile University',          'private', 'الشيخ زايد', 'Sheikh Zayed', 2006,  6, 90000,  180000,  7, 'جامعة بحثية خاصة متخصصة في التكنولوجيا.', 'Private research university specializing in technology.')
on conflict (slug) do nothing;

update universities
set
  governorate = case slug
    when 'cairo-university' then 'Giza'
    when 'ain-shams-university' then 'Cairo'
    when 'alexandria-university' then 'Alexandria'
    when 'guc' then 'Cairo'
    when 'auc' then 'Cairo'
    when 'msa-university' then 'Cairo'
    when 'nile-university' then 'Giza'
    else governorate
  end,
  metro_area = case slug
    when 'alexandria-university' then 'alexandria'
    else 'greater-cairo'
  end
where slug in (
  'cairo-university',
  'ain-shams-university',
  'alexandria-university',
  'guc',
  'auc',
  'msa-university',
  'nile-university'
);

insert into majors (slug, name_ar, name_en, category, duration_years, career_paths, required_tracks) values
  ('medicine',           'الطب البشري',        'Medicine',              'medicine',         6,  array['طبيب','جراح','أخصائي','أستاذ جامعي'], array['science']),
  ('pharmacy',           'الصيدلة',            'Pharmacy',              'pharmacy',         5,  array['صيدلاني','باحث دوائي','مستشار طبي'], array['science']),
  ('civil-engineering',  'الهندسة المدنية',    'Civil Engineering',     'engineering',      5,  array['مهندس مدني','مقاول','مخطط عمراني'], array['science','math']),
  ('computer-science',   'علوم حاسب',          'Computer Science',      'computer_science', 4,  array['مطور برمجيات','ذكاء اصطناعي','أمن معلومات'], array['science','math']),
  ('business-admin',     'إدارة الأعمال',      'Business Administration','business',         4,  array['مدير أعمال','رائد أعمال','محلل مالي'], array['science','math','arts']),
  ('law',                'الحقوق',             'Law',                   'law',              4,  array['محامي','قاضي','مستشار قانوني'], array['arts','science','math']),
  ('architecture',       'الهندسة المعمارية',  'Architecture',          'architecture',     5,  array['مهندس معماري','مصمم داخلي','مخطط عمراني'], array['science','math']),
  ('media',              'الإعلام والتواصل',   'Media & Communication', 'media',            4,  array['صحفي','مذيع','منتج إعلامي','مسوّق رقمي'], array['arts','science','math'])
on conflict (slug) do nothing;
