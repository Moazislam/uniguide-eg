-- ============================================================
-- UniGuide — Migration 002: Faculties table
-- Run in Supabase SQL Editor
-- ============================================================

-- ─── Create table ────────────────────────────────────────────

create table if not exists faculties (
  id              uuid primary key default uuid_generate_v4(),
  university_id   uuid not null references universities(id) on delete cascade,
  name_ar         text not null,
  name_en         text not null,
  category        text not null check (category in (
    'medicine','engineering','business','arts','science','law',
    'pharmacy','dentistry','media','computer_science','architecture',
    'education','agriculture','tourism','other'
  )),
  description_ar  text,
  duration_years  integer,
  tuition_min     integer,
  currency        text default 'EGP',
  language        text default 'arabic' check (language in ('arabic','english','bilingual')),
  website         text,
  created_at      timestamptz default now()
);

create index on faculties (university_id);
create index on faculties (category);

alter table faculties enable row level security;
create policy "Public read faculties" on faculties for select using (true);


-- ─── Seed: Cairo University (25 faculties — seeding key ones) ─

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language) 
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'arabic'
from universities u,
(values
  ('كلية الطب', 'Faculty of Medicine', 'medicine', 'تُعدّ من أعرق كليات الطب في الشرق الأوسط، تأسست 1827. تمنح درجة الدكتوراه في الطب والجراحة.', 6, 0),
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'تقدم برامج البكالوريوس والدراسات العليا في العلوم الدوائية والصيدلة السريرية.', 5, 0),
  ('كلية طب الأسنان', 'Faculty of Dentistry', 'dentistry', 'تأهيل أطباء الأسنان في التخصصات الأساسية والجراحية والتحفظية.', 5, 0),
  ('كلية الهندسة', 'Faculty of Engineering', 'engineering', 'من أعرق كليات الهندسة في مصر، تشمل الهندسة المدنية والميكانيكية والكهربائية والكيميائية.', 4, 0),
  ('كلية الحقوق', 'Faculty of Law', 'law', 'تقدم برامج في القانون المدني والتجاري والجنائي والدولي.', 4, 0),
  ('كلية الاقتصاد والعلوم السياسية', 'Faculty of Economics & Political Science', 'business', 'تخصصات في الاقتصاد والعلوم السياسية والإحصاء والتأمين.', 4, 0),
  ('كلية الآداب', 'Faculty of Arts', 'arts', 'تشمل أقسام اللغات واللسانيات والتاريخ والجغرافيا والفلسفة وعلم الاجتماع.', 4, 0),
  ('كلية العلوم', 'Faculty of Science', 'science', 'تخصصات في الرياضيات والفيزياء والكيمياء وعلم الأحياء والجيولوجيا.', 4, 0),
  ('كلية التجارة', 'Faculty of Commerce', 'business', 'تخصصات في المحاسبة وإدارة الأعمال والاقتصاد التطبيقي.', 4, 0),
  ('كلية الإعلام', 'Faculty of Mass Communication', 'media', 'أقسام الصحافة والإذاعة والعلاقات العامة والإعلام الرقمي.', 4, 0),
  ('كلية الحاسبات والذكاء الاصطناعي', 'Faculty of Computers & AI', 'computer_science', 'تخصصات في علوم الحاسب والذكاء الاصطناعي وعلوم البيانات وأمن المعلومات.', 4, 0),
  ('كلية الهندسة المعمارية', 'Faculty of Urban Planning', 'architecture', 'برامج في التخطيط العمراني والإسكان وتطوير المدن.', 4, 0),
  ('كلية التربية', 'Faculty of Education', 'education', 'إعداد المعلمين وتخصصات علم النفس التربوي ومناهج التدريس.', 4, 0)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'cairo-university'
on conflict do nothing;


-- ─── Ain Shams University ────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'arabic'
from universities u,
(values
  ('كلية الطب', 'Faculty of Medicine', 'medicine', 'إحدى أكبر كليات الطب في مصر مع مستشفيات جامعية متعددة وأقسام تخصصية متكاملة.', 6, 0),
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'تقدم برامج الصيدلة السريرية والصناعية والتحليلية.', 5, 0),
  ('كلية طب الأسنان', 'Faculty of Dentistry', 'dentistry', 'برامج شاملة في طب الأسنان والتخصصات الجراحية.', 5, 0),
  ('كلية الهندسة', 'Faculty of Engineering', 'engineering', 'تشمل الهندسة المدنية والكهربائية والميكانيكية وهندسة الإنتاج والتصميم الميكانيكي.', 4, 0),
  ('كلية الحاسبات والمعلومات', 'Faculty of Computer & Information Sciences', 'computer_science', 'تخصصات في علوم الحاسب ونظم المعلومات والشبكات والذكاء الاصطناعي.', 4, 0),
  ('كلية التجارة', 'Faculty of Commerce', 'business', 'محاسبة وإدارة أعمال واقتصاد ونظم معلومات الأعمال.', 4, 0),
  ('كلية الحقوق', 'Faculty of Law', 'law', 'القانون الخاص والعام والدولي والشريعة الإسلامية.', 4, 0),
  ('كلية الآداب', 'Faculty of Arts', 'arts', 'اللغات والأدب والتاريخ والجغرافيا والفلسفة وعلم النفس.', 4, 0),
  ('كلية البنات', 'Faculty of Education for Girls', 'education', 'تخصصات التربية ورياض الأطفال والاقتصاد المنزلي والعلوم الإنسانية.', 4, 0),
  ('كلية التمريض', 'Faculty of Nursing', 'medicine', 'تأهيل الكوادر التمريضية بأقسام التمريض الطبي والجراحي وتمريض الأطفال.', 4, 0),
  ('كلية العلوم', 'Faculty of Science', 'science', 'الرياضيات والفيزياء والكيمياء والجيولوجيا وعلم الحيوان والنبات.', 4, 0),
  ('كلية الألسن', 'Faculty of Al-Alsun (Languages)', 'arts', 'تخصصات ترجمة وآداب اللغات الأجنبية المتعددة.', 4, 0)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'ain-shams-university'
on conflict do nothing;


-- ─── Alexandria University ────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'arabic'
from universities u,
(values
  ('كلية الطب', 'Faculty of Medicine', 'medicine', 'تتميز بمستشفى الجامعة وأقسام الجراحة والباطنة والأطفال وطب الأمراض العصبية.', 6, 0),
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'علوم دوائية وصيدلة صناعية وصيدلة إكلينيكية وسموم.', 5, 0),
  ('كلية طب الأسنان', 'Faculty of Dentistry', 'dentistry', 'جراحة الفم والوجه والتركيبات والأطراف الصناعية وطب أسنان الأطفال.', 5, 0),
  ('كلية الهندسة', 'Faculty of Engineering', 'engineering', 'هندسة بحرية وميكانيكية وكهربائية ومدنية وهندسة الحاسب.', 4, 0),
  ('كلية التجارة', 'Faculty of Commerce', 'business', 'محاسبة وتمويل وتأمين وتجارة خارجية وإدارة أعمال.', 4, 0),
  ('كلية الحقوق', 'Faculty of Law', 'law', 'القانون الخاص والعام والتجاري وشريعة إسلامية.', 4, 0),
  ('كلية الآداب', 'Faculty of Arts', 'arts', 'اللغات والتاريخ والجغرافيا والفلسفة والأثار والإعلام.', 4, 0),
  ('كلية العلوم', 'Faculty of Science', 'science', 'الرياضيات والفيزياء والكيمياء والأحياء والجيولوجيا.', 4, 0),
  ('كلية الهندسة المعمارية والتنظيم', 'Faculty of Fine Arts', 'architecture', 'الجرافيك والتصوير والنحت والخزف والتصميم الداخلي.', 5, 0),
  ('كلية الحاسبات والمعلومات', 'Faculty of Computer & Data Science', 'computer_science', 'علوم الحاسب ونظم المعلومات وإدارة قواعد البيانات.', 4, 0),
  ('كلية التمريض', 'Faculty of Nursing', 'medicine', 'تأهيل تمريضي شامل مع تدريب بالمستشفيات الجامعية.', 4, 0),
  ('كلية الزراعة', 'Faculty of Agriculture', 'agriculture', 'الإنتاج النباتي والحيواني وبيوتكنولوجيا الزراعة وعلوم الأغذية.', 4, 0)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'alexandria-university'
on conflict do nothing;


-- ─── GUC ─────────────────────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الهندسة والعلوم التطبيقية', 'Faculty of Engineering & Materials Science', 'engineering', 'برامج مزدوجة مع جامعات ألمانية في الهندسة الميكانيكية والكهربائية والمواد. تمنح درجتين: مصرية وألمانية.', 4, 130000),
  ('كلية المعلوماتية وهندسة الحاسبات', 'Faculty of Media Engineering & Technology', 'computer_science', 'برامج في هندسة الوسائط الرقمية وعلوم الحاسب والذكاء الاصطناعي وشبكات الحاسب.', 4, 125000),
  ('كلية إدارة الأعمال والتكنولوجيا', 'Faculty of Management Technology', 'business', 'إدارة الأعمال والاقتصاد وعلوم إدارة الموارد وادارة الخدمات اللوجستية.', 4, 120000),
  ('كلية الهندسة المعمارية', 'Faculty of Applied Arts & Design', 'architecture', 'التصميم المعماري والتصميم الصناعي والغرافيك ضمن شراكات ألمانية.', 5, 125000),
  ('كلية الصيدلة والتكنولوجيا الحيوية', 'Faculty of Pharmacy & Biotechnology', 'pharmacy', 'علوم الصيدلة والبيوتكنولوجيا الطبية بمناهج ألمانية معتمدة.', 5, 130000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'guc'
on conflict do nothing;


-- ─── AUC ─────────────────────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الفنون والعلوم الإنسانية', 'School of Humanities & Social Sciences', 'arts', 'فلسفة وآداب مقارنة وتاريخ وعلوم سياسية وأنثروبولوجيا وعلم النفس — بيئة بحثية أمريكية حقيقية.', 4, 400000),
  ('كلية العلوم الاجتماعية والاتصال', 'School of Global Affairs & Public Policy', 'media', 'الإعلام والصحافة والعلاقات الدولية والسياسات العامة والعلوم الاجتماعية.', 4, 400000),
  ('كلية إدارة الأعمال', 'School of Business', 'business', 'إدارة الأعمال والاقتصاد والمحاسبة والتسويق والمالية — معتمدة من AACSB.', 4, 420000),
  ('كلية الهندسة والعلوم التطبيقية', 'School of Sciences & Engineering', 'engineering', 'هندسة كيميائية وميكانيكية وإلكترونية وعلوم الحاسب والفيزياء والكيمياء والرياضيات.', 4, 420000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'auc'
on conflict do nothing;


-- ─── MSA University ──────────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الهندسة والعلوم التطبيقية', 'Faculty of Engineering', 'engineering', 'هندسة مدنية وميكانيكية وكهربائية وحاسبات بشراكة جامعة غرينتش البريطانية.', 4, 90000),
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'بكالوريوس الصيدلة بمناهج بريطانية معتمدة مع تدريب سريري متكامل.', 5, 95000),
  ('كلية إدارة الأعمال', 'Faculty of Business Administration', 'business', 'إدارة أعمال ومحاسبة وتسويق ونظم معلومات الأعمال بالنظام البريطاني.', 4, 85000),
  ('كلية الحاسبات والتكنولوجيا', 'Faculty of Computer Science', 'computer_science', 'علوم الحاسب والذكاء الاصطناعي والأمن الرقمي وهندسة البرمجيات.', 4, 88000),
  ('كلية طب الأسنان', 'Faculty of Dentistry', 'dentistry', 'طب أسنان شامل بمناهج أوروبية وتدريب عملي مكثف بالعيادات.', 5, 120000),
  ('كلية الفنون التطبيقية والتصميم', 'Faculty of Applied Arts & Design', 'architecture', 'الجرافيك والتصميم الداخلي والأزياء والوسائط الرقمية.', 4, 80000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'msa-university'
on conflict do nothing;


-- ─── Nile University ─────────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الهندسة وعلوم الحاسب', 'College of Engineering & Computer Science', 'computer_science', 'هندسة الحاسبات وعلوم البيانات والذكاء الاصطناعي وتكنولوجيا النانو والاتصالات.', 4, 100000),
  ('كلية إدارة الأعمال', 'College of Business Administration', 'business', 'إدارة الأعمال وريادة الأعمال والمالية وإدارة التكنولوجيا — تركيز على الابتكار والستارت آب.', 4, 95000),
  ('كلية الدراسات الإنسانية والاجتماعية', 'College of Humanities & Social Sciences', 'arts', 'اللغويات التطبيقية والدراسات الإقليمية وعلوم الاتصال.', 4, 90000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'nile-university'
on conflict do nothing;


-- ─── BUE ─────────────────────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الهندسة', 'Faculty of Engineering', 'engineering', 'هندسة مدنية وكهربائية وميكانيكية وبيوميدية بدرجات معتمدة من جامعات بريطانية.', 4, 120000),
  ('كلية الحاسبات والمعلومات', 'Faculty of Informatics & Computer Science', 'computer_science', 'علوم الحاسب ونظم المعلومات وأمن الشبكات وهندسة البرمجيات.', 4, 115000),
  ('كلية إدارة الأعمال', 'Faculty of Business Administration', 'business', 'إدارة الأعمال والمحاسبة والاقتصاد والتمويل والتسويق الرقمي.', 4, 110000),
  ('كلية الآداب والعلوم الاجتماعية', 'Faculty of Arts & Social Sciences', 'arts', 'الإعلام وعلم النفس والعلوم السياسية والدراسات الإنجليزية.', 4, 108000),
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'صيدلة علاجية وإكلينيكية وبيوصيدلانية بمناهج بريطانية.', 5, 130000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'bue'
on conflict do nothing;


-- ─── MIU ─────────────────────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'بكالوريوس الصيدلة بالنظام الأمريكي مع تدريب سريري بالمستشفيات والصيدليات.', 5, 80000),
  ('كلية الهندسة', 'Faculty of Engineering', 'engineering', 'هندسة كمبيوتر وكهربائية ومدنية وصناعية وإلكترونيات.', 4, 75000),
  ('كلية إدارة الأعمال', 'Faculty of Business Administration', 'business', 'محاسبة وإدارة أعمال وتسويق وإدارة موارد بشرية.', 4, 70000),
  ('كلية الإعلام والتواصل', 'Faculty of Mass Communication', 'media', 'صحافة وإذاعة وتلفزيون وعلاقات عامة وإعلام رقمي وإنتاج إعلامي.', 4, 68000),
  ('كلية الحاسبات والمعلومات', 'Faculty of Computer Science', 'computer_science', 'علوم الحاسب وهندسة البرمجيات والذكاء الاصطناعي ونظم المعلومات.', 4, 72000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'misr-international'
on conflict do nothing;


-- ─── AASTMT ──────────────────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الهندسة والتكنولوجيا', 'College of Engineering & Technology', 'engineering', 'الهندسة البحرية والميكانيكية والكهربائية والمدنية وهندسة الحاسبات.', 4, 80000),
  ('كلية إدارة الأعمال', 'College of Management & Technology', 'business', 'إدارة الأعمال والشحن البحري واللوجستيات والسياحة والنقل الدولي.', 4, 75000),
  ('كلية الحوسبة وتقنية المعلومات', 'College of Computing & Information Technology', 'computer_science', 'علوم الحاسب وأمن المعلومات وذكاء اصطناعي وحوسبة سحابية.', 4, 78000),
  ('كلية العلوم والهندسة البحرية', 'College of Maritime Transport & Technology', 'other', 'علوم الملاحة البحرية وهندسة السفن والموانئ والخدمات اللوجستية البحرية.', 4, 80000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'aastmt'
on conflict do nothing;


-- ─── Mansoura University ─────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'arabic'
from universities u,
(values
  ('كلية الطب', 'Faculty of Medicine', 'medicine', 'مشهورة عالمياً بأبحاث زراعة الكلى ومركز الكلى والمسالك البولية. إحدى أعرق الكليات الطبية الإقليمية.', 6, 0),
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'بكالوريوس وماجستير ودكتوراه في الصيدلة بأقسام متخصصة وبحث دوائي متقدم.', 5, 0),
  ('كلية الهندسة', 'Faculty of Engineering', 'engineering', 'الهندسة المدنية والكهربائية والميكانيكية وهندسة الحاسب والإنتاج.', 4, 0),
  ('كلية التجارة', 'Faculty of Commerce', 'business', 'محاسبة وإدارة أعمال واقتصاد وتجارة خارجية.', 4, 0),
  ('كلية الحاسبات والمعلومات', 'Faculty of Computers & Information', 'computer_science', 'علوم الحاسب وتقنية المعلومات والشبكات والأنظمة الذكية.', 4, 0),
  ('كلية الحقوق', 'Faculty of Law', 'law', 'قانون خاص وعام وشريعة إسلامية وقانون تجاري.', 4, 0),
  ('كلية العلوم', 'Faculty of Science', 'science', 'الرياضيات والفيزياء والكيمياء والأحياء والجيولوجيا.', 4, 0),
  ('كلية الآداب', 'Faculty of Arts', 'arts', 'اللغات الأجنبية والتاريخ والجغرافيا والفلسفة وعلم الاجتماع.', 4, 0)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'mansoura-university'
on conflict do nothing;


-- ─── Helwan University ───────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'arabic'
from universities u,
(values
  ('كلية الفنون التطبيقية', 'Faculty of Applied Arts', 'architecture', 'الجرافيك والتصميم الداخلي والمنسوجات والمعادن والأثاث والأزياء.', 5, 0),
  ('كلية الفنون الجميلة', 'Faculty of Fine Arts', 'architecture', 'التصوير والنحت والغرافيك الفني والجداريات.', 4, 0),
  ('كلية الموسيقى والدراما', 'Faculty of Music Education', 'arts', 'تعليم موسيقى والدراما وتأهيل معلمين التربية الموسيقية.', 4, 0),
  ('كلية الهندسة', 'Faculty of Engineering', 'engineering', 'الهندسة الميكانيكية والكهربائية والمدنية وهندسة الطيران والإنتاج.', 4, 0),
  ('كلية التجارة', 'Faculty of Commerce & Business Admin', 'business', 'المحاسبة والتمويل وإدارة الأعمال والسياحة وإدارة الفنادق.', 4, 0),
  ('كلية التمريض', 'Faculty of Nursing', 'medicine', 'تأهيل تمريضي متكامل في الرعاية الصحية الأولية والتخصصية.', 4, 0),
  ('كلية التربية', 'Faculty of Education', 'education', 'إعداد معلمين وتخصصات علم نفس تربوي ومناهج وطرق تدريس.', 4, 0)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'helwan-university'
on conflict do nothing;


-- ─── Pharos University ───────────────────────────────────────

insert into faculties (university_id, name_ar, name_en, category, description_ar, duration_years, tuition_min, currency, language)
select u.id, f.name_ar, f.name_en, f.category, f.description_ar, f.duration_years, f.tuition_min, 'EGP', 'english'
from universities u,
(values
  ('كلية الهندسة والتكنولوجيا', 'Faculty of Engineering & Technology', 'engineering', 'الهندسة المدنية والكهربائية وهندسة الحاسبات والميكانيكية والبيئية.', 4, 75000),
  ('كلية الأعمال', 'Faculty of Business Administration', 'business', 'إدارة أعمال وتسويق ومحاسبة وإدارة موارد بشرية.', 4, 65000),
  ('كلية الإعلام والاتصال', 'Faculty of Mass Communication', 'media', 'الصحافة والإذاعة والإعلام الرقمي والإنتاج التلفزيوني والعلاقات العامة.', 4, 62000),
  ('كلية الحاسبات والمعلوماتية', 'Faculty of Computer Science', 'computer_science', 'علوم الحاسب ونظم المعلومات وأمن المعلومات وهندسة البرمجيات.', 4, 70000),
  ('كلية الصيدلة', 'Faculty of Pharmacy', 'pharmacy', 'الصيدلة الإكلينيكية والصناعية وعلوم الأدوية.', 5, 80000),
  ('كلية الفنون التطبيقية والتصميم', 'Faculty of Applied Arts & Design', 'architecture', 'التصميم الجرافيكي والتصميم الداخلي والأزياء والوسائط التفاعلية.', 4, 60000)
) as f(name_ar, name_en, category, description_ar, duration_years, tuition_min)
where u.slug = 'pharos-university'
on conflict do nothing;
