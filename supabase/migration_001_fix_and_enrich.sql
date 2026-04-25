-- ============================================================
-- UniGuide — Migration: Fix slugs, nulls, add new columns
-- Run in Supabase SQL Editor
-- ============================================================

-- ─── 1. Add new columns to universities ─────────────────────

alter table universities
  add column if not exists famous_for text[],
  add column if not exists admission_national text,
  add column if not exists admission_ig text,
  add column if not exists admission_american text,
  add column if not exists admission_french text,
  add column if not exists admission_german text;


-- ─── 2. Fix broken slugs (spaces, caps, special chars) ──────

update universities set slug = '6th-october-university'    where slug = '6th of October University';
update universities set slug = 'aastmt'                    where slug = 'AASTMT';
update universities set slug = 'ngu'                       where slug = 'NGU';
update universities set slug = 'nahda-university'          where slug = 'Nahda';
update universities set slug = 'pharos-university'         where slug = 'Pharos';


-- ─── 3. Fix NULL locations ───────────────────────────────────

update universities set
  location_ar = 'السادس من أكتوبر',
  location_en = '6th of October City',
  governorate  = 'Giza',
  metro_area   = 'greater-cairo'
where slug = '6th-october-university' and (location_ar is null or location_ar = 'null' or location_ar = '');

update universities set
  location_ar = 'الإسكندرية',
  location_en = 'Alexandria',
  governorate  = 'Alexandria',
  metro_area   = 'alexandria'
where slug = 'aastmt' and (location_ar is null or location_ar = 'null' or location_ar = '');

update universities set
  location_ar = 'الشيخ زايد',
  location_en = 'Sheikh Zayed',
  governorate  = 'Giza',
  metro_area   = 'greater-cairo'
where slug = 'ngu' and (location_ar is null or location_ar = 'null' or location_ar = '');

update universities set
  location_ar = 'بني سويف',
  location_en = 'Beni Suef',
  governorate  = 'Beni Suef',
  metro_area   = 'upper-egypt'
where slug = 'nahda-university' and (location_ar is null or location_ar = 'null' or location_ar = '');

update universities set
  location_ar = 'الإسكندرية',
  location_en = 'Alexandria',
  governorate  = 'Alexandria',
  metro_area   = 'alexandria'
where slug = 'pharos-university' and (location_ar is null or location_ar = 'null' or location_ar = '');


-- ─── 4. Fix bad currency values ──────────────────────────────

-- Normalize any "27,500 USD /EGP" style currency to clean "USD"
update universities set tuition_currency = 'USD'
where tuition_currency ilike '%usd%';

update universities set tuition_currency = 'EGP'
where tuition_currency ilike '%egp%' and tuition_currency not ilike '%usd%';


-- ─── 5. Seed famous_for and admission data ───────────────────

-- Cairo University
update universities set
  famous_for = ARRAY['أعرق جامعة في مصر', 'كلية الطب والصيدلة', 'الدراسات القانونية والاقتصادية', 'مركز البحث العلمي'],
  admission_national = 'تنسيق الثانوية العامة — الطب: 97%+ علمي، الهندسة: 88%+ علمي، الحقوق: 75%+ أدبي/علمي. يتم القبول عبر بوابة التنسيق الرسمية.',
  admission_ig = 'غير متاح عموماً للـ IGCSE في الكليات الحكومية.',
  admission_american = 'غير متاح في الجامعات الحكومية.',
  admission_french = 'يُقبل حملة الثانوية الفرنسية وفق معادلة الوزارة.',
  admission_german = 'يُقبل حملة الأبيتور وفق معادلة الوزارة.'
where slug = 'cairo-university';

-- Ain Shams
update universities set
  famous_for = ARRAY['كلية الطب والتمريض', 'الهندسة المعمارية', 'البحث العلمي', 'التعليم المستمر'],
  admission_national = 'تنسيق الثانوية العامة — الطب: 96.5%+ علمي، الهندسة: 87%+ علمي. عبر بوابة التنسيق الرسمية.',
  admission_ig = 'غير متاح في الكليات الحكومية.',
  admission_french = 'يُقبل حملة الثانوية الفرنسية وفق المعادلة الرسمية.',
  admission_german = 'يُقبل حملة الأبيتور وفق المعادلة الرسمية.'
where slug = 'ain-shams-university';

-- Alexandria University
update universities set
  famous_for = ARRAY['كلية الطب البحري', 'الهندسة والعلوم التطبيقية', 'الصيدلة', 'موقع متميز في الإسكندرية'],
  admission_national = 'تنسيق الثانوية العامة — الطب: 96%+ علمي، الهندسة: 86%+ علمي، الصيدلة: 91%+. عبر بوابة التنسيق.',
  admission_ig = 'غير متاح في الكليات الحكومية.',
  admission_french = 'يُقبل حملة الثانوية الفرنسية وفق المعادلة.',
  admission_german = 'يُقبل حملة الأبيتور وفق المعادلة.'
where slug = 'alexandria-university';

-- GUC
update universities set
  famous_for = ARRAY['الشراكة مع الجامعات الألمانية', 'برامج مزدوجة (Dual Degree)', 'الهندسة والمعلوماتية', 'بيئة إنجليزية-ألمانية'],
  admission_national = 'مجموع الثانوية العامة: 75%+ علمي. اختبار مستوى اللغة الإنجليزية مطلوب.',
  admission_ig = 'حد أدنى 5 مواد إنجيز/IGCSE بتقدير C أو أعلى، بما فيها الرياضيات والعلوم أو الفيزياء.',
  admission_american = 'SAT: 1100+ أو ACT: 22+. شهادة الثانوية الأمريكية مع GPA 3.0+.',
  admission_french = 'الثانوية الفرنسية (Bac) بمعدل 14/20 أو أعلى في المواد العلمية.',
  admission_german = 'الأبيتور بمعدل 2.0 أو أفضل (بالنظام الألماني).'
where slug = 'guc';

-- AUC
update universities set
  famous_for = ARRAY['الاعتماد الأمريكي الكامل', 'أقدم جامعة خاصة في مصر', 'علوم الاجتماع والإعلام والأعمال', 'شبكة خريجين دولية قوية'],
  admission_national = 'مجموع الثانوية العامة: 85%+ واجتياز اختبار القبول EST/SAT. IELTS 6.0+ أو TOEFL 80+.',
  admission_ig = 'A*-B في 5 مواد IGCSE + A Level أو International Baccalaureate مقبول. IELTS 6.5+.',
  admission_american = 'SAT: 1200+ أو ACT: 26+، مع GPA 3.2+. الأفضل تقديماً بين الجامعات المصرية.',
  admission_french = 'Baccalauréat بمعدل 15/20+ مع IELTS 6.5 أو ما يعادله.',
  admission_german = 'Abitur بمعدل 1.5+ مع IELTS 6.5.'
where slug = 'auc';

-- MSA
update universities set
  famous_for = ARRAY['الشراكة مع جامعة غرينتش البريطانية', 'الصيدلة والهندسة والأعمال', 'درجات بريطانية معتمدة', 'موقع في القاهرة الجديدة'],
  admission_national = 'مجموع الثانوية العامة: 65%+ علمي للهندسة. 60%+ للأعمال والحاسبات. اختبار إنجليزي داخلي.',
  admission_ig = 'حد أدنى 5 مواد IGCSE بتقدير C+ بما فيها الرياضيات. قد يُطلب AS Level.',
  admission_american = 'SAT: 1000+ أو شهادة أمريكية معتمدة مع GPA 2.7+.',
  admission_french = 'Bac بمعدل 12/20+ في المسار العلمي.',
  admission_german = 'Abitur بمعدل 2.5 أو أفضل.'
where slug = 'msa-university';

-- Nile University
update universities set
  famous_for = ARRAY['جامعة بحثية متخصصة', 'التكنولوجيا وريادة الأعمال', 'الذكاء الاصطناعي والنانو', 'بيئة إنجليزية 100%'],
  admission_national = 'مجموع الثانوية العامة: 70%+ علمي/رياضي. اختبار إنجليزي داخلي مطلوب.',
  admission_ig = 'حد أدنى 5 مواد IGCSE بتقدير B+ في الرياضيات والعلوم.',
  admission_american = 'SAT: 1100+ مع GPA 3.0+.',
  admission_french = 'Bac بمعدل 13/20 في المسار العلمي.',
  admission_german = 'Abitur بمعدل 2.0.'
where slug = 'nile-university';

-- BUE
update universities set
  famous_for = ARRAY['الدرجات البريطانية المعتمدة', 'الهندسة والتصميم والأعمال', 'بيئة إنجليزية', 'شراكة مع جامعات UK'],
  admission_national = 'مجموع الثانوية العامة: 68%+ علمي للهندسة. 65%+ للأعمال. اختبار IELTS داخلي.',
  admission_ig = '5 مواد IGCSE بتقدير C+ بما فيها الرياضيات والفيزياء للهندسة.',
  admission_american = 'SAT: 1050+ أو ACT: 21+.',
  admission_french = 'Bac معدل 12/20+ في المسار العلمي أو الأدبي.',
  admission_german = 'Abitur بمعدل 2.5 أو أفضل.'
where slug = 'bue';

-- MIU
update universities set
  famous_for = ARRAY['الصيدلة والأسنان', 'الإعلام والحاسبات', 'نظام أمريكي معتمد', 'مصروفات تنافسية'],
  admission_national = 'مجموع الثانوية العامة: 70%+ علمي للصيدلة. 63%+ للأعمال والإعلام.',
  admission_ig = 'حد أدنى 5 مواد IGCSE بتقدير C+.',
  admission_american = 'SAT: 1000+ أو شهادة ثانوية أمريكية.',
  admission_french = 'Bac بمعدل 12/20.',
  admission_german = 'Abitur بمعدل 2.7.'
where slug = 'misr-international';

-- AASTMT / Arab Academy
update universities set
  famous_for = ARRAY['العلوم البحرية والنقل البحري', 'الهندسة والتكنولوجيا', 'فروع في مصر ودول عربية', 'سمعة دولية في النقل البحري'],
  admission_national = 'مجموع الثانوية العامة: 65%+ علمي/رياضي. اختبار إنجليزي داخلي.',
  admission_ig = '5 مواد IGCSE بتقدير C+ بما فيها الرياضيات.',
  admission_american = 'SAT: 1000+ أو ما يعادله.',
  admission_french = 'Bac بمعدل 12/20 في المسار العلمي.',
  admission_german = 'Abitur بمعدل 2.5.'
where slug = 'aastmt';

-- Mansoura
update universities set
  famous_for = ARRAY['زراعة الكلى والبحث الطبي', 'كلية الطب الأولى إقليمياً', 'الصيدلة والهندسة'],
  admission_national = 'تنسيق الثانوية العامة — الطب: 95.5%+ علمي، الصيدلة: 89%+، الهندسة: 85%+.',
  admission_ig = 'غير متاح في الكليات الحكومية.',
  admission_french = 'يُقبل حملة الثانوية الفرنسية وفق المعادلة.'
where slug = 'mansoura-university';

-- Helwan
update universities set
  famous_for = ARRAY['الفنون التطبيقية والموسيقى', 'العمارة والتصميم', 'التمريض', 'الهندسة الصناعية'],
  admission_national = 'تنسيق الثانوية العامة — الهندسة: 75%+ علمي، العمارة: 80%+، الأعمال: 65%+.',
  admission_ig = 'غير متاح في الكليات الحكومية.'
where slug = 'helwan-university';

-- Pharos
update universities set
  famous_for = ARRAY['الهندسة والتكنولوجيا في الإسكندرية', 'الإعلام والتصميم', 'مصروفات معقولة', 'قرب من وسط الإسكندرية'],
  admission_national = 'مجموع الثانوية العامة: 65%+ علمي للهندسة. 60%+ للأعمال.',
  admission_ig = '5 مواد IGCSE بتقدير C+.',
  admission_american = 'SAT: 1000+ أو ما يعادله.',
  admission_french = 'Bac بمعدل 12/20.',
  admission_german = 'Abitur بمعدل 2.5.'
where slug = 'pharos-university';


-- ─── 6. Update location_ar where it shows "null" string ──────
update universities
set location_ar = location_en
where location_ar = 'null' or location_ar = '';
