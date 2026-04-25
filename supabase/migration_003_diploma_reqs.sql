-- ============================================================
-- UniGuide — Migration 003: Faculty Diploma Requirements
-- Run in Supabase SQL Editor
-- ============================================================

-- ─── 1. Update Schema ───────────────────────────────────────

alter table faculties 
add column if not exists admission_national text,
add column if not exists admission_ig       text,
add column if not exists admission_american text,
add column if not exists admission_other    text;

-- ─── 2. Populate Requirements ────────────────────────────────

-- Medicine / Dentistry
update faculties
set 
  admission_national = 'الثانوية العامة (علمي علوم): الحد الأدنى للمجموع يحدد سنوياً (عادة 90%+)',
  admission_ig = 'IGCSE: 8 O-Levels (grade C or above) + Biology (A-Level or 2 AS) + Chemistry (AS). Total 8 subjects minimum.',
  admission_american = 'American Diploma: SAT I + SAT II (Biology & Chemistry) or ACT. Minimum GPA 3.0.',
  admission_other = 'شهادات معادلة: خاضعة لقوانين التنسيق للشهادات الأجنبية.'
where category in ('medicine', 'dentistry');

-- Pharmacy / Science / Vet
update faculties
set 
  admission_national = 'الثانوية العامة (علمي علوم): الحد الأدنى للمجموع يحدد سنوياً (عادة 85%+)',
  admission_ig = 'IGCSE: 8 O-Levels + Chemistry (AS/A-Level) + Biology (AS).',
  admission_american = 'American Diploma: SAT I + SAT II (Chemistry & Biology).',
  admission_other = 'متوفر للشهادات العربية والأجنبية المعادلة.'
where category in ('pharmacy', 'science');

-- Engineering
update faculties
set 
  admission_national = 'الثانوية العامة (علمي رياضة): الحد الأدنى يحدد سنوياً (عادة 80%+)',
  admission_ig = 'IGCSE: 8 O-Levels + Math (A-Level) + Physics (AS).',
  admission_american = 'American Diploma: SAT I + SAT II (Math & Physics).',
  admission_other = 'متوفر للشهادات العربية والأجنبية المعادلة.'
where category = 'engineering';

-- Computer Science
update faculties
set 
  admission_national = 'الثانوية العامة (علمي رياضة أو علوم حسب الجامعة): الحد الأدنى (75%+)',
  admission_ig = 'IGCSE: 8 O-Levels + Math (AS or A-Level).',
  admission_american = 'American Diploma: SAT I + SAT II (Math).',
  admission_other = 'خاضع لقواعد المجلس الأعلى للجامعات.'
where category = 'computer_science';

-- Business / Law / Arts / Media
update faculties
set 
  admission_national = 'الثانوية العامة (أدبي أو علمي): الحد الأدنى يختلف حسب الكلية (60% - 80%)',
  admission_ig = 'IGCSE: 8 O-Levels (Grade C minimum). No specific A-Levels required for most programs.',
  admission_american = 'American Diploma: SAT I minimum score requirements vary.',
  admission_other = 'خاضع لقواعد المجلس الأعلى للجامعات.'
where category in ('business', 'law', 'arts', 'media', 'education', 'tourism');
