-- ============================================================
-- UniGuide Egypt — Seed Data
-- Run this in your Supabase SQL editor AFTER schema.sql
-- ============================================================

-- ─── MAJORS ─────────────────────────────────────────────────

insert into majors (slug, name_ar, name_en, category, description_ar, description_en, duration_years, career_paths, required_tracks) values

-- Medicine & Health
('medicine', 'طب بشري', 'Medicine (MBBS)', 'medicine',
 'برنامج متكامل يؤهل الطالب للعمل طبيباً بشرياً، يشمل العلوم الأساسية والسريرية وتدريباً مكثفاً في المستشفيات.',
 'A comprehensive 6-year program leading to an MBBS degree, covering basic sciences, clinical rotations, and hospital training.',
 6,
 ARRAY['Physician (General Practice)', 'Surgeon', 'Specialist Doctor', 'Medical Researcher', 'Hospital Administrator'],
 ARRAY['science']),

('pharmacy', 'صيدلة', 'Pharmacy (B.Pharm)', 'pharmacy',
 'يدرس الطالب العلوم الدوائية وتصنيع الأدوية وتفاعلاتها، مع تدريب عملي في الصيدليات والمستشفيات.',
 'Covers pharmaceutical sciences, drug manufacturing, and clinical pharmacy with practical training.',
 5,
 ARRAY['Clinical Pharmacist', 'Drug Research Scientist', 'Pharmaceutical Industry', 'Hospital Pharmacist', 'Regulatory Affairs'],
 ARRAY['science']),

('dentistry', 'طب أسنان', 'Dentistry (BDS)', 'dentistry',
 'يشمل دراسة أمراض الفم والأسنان والتشخيص والعلاج الجراحي والتحفظي مع تدريب سريري شامل.',
 'Focuses on oral and dental diseases, diagnosis, surgical and restorative treatments.',
 5,
 ARRAY['General Dentist', 'Orthodontist', 'Oral Surgeon', 'Pediatric Dentist', 'Dental Researcher'],
 ARRAY['science']),

('nursing', 'تمريض', 'Nursing', 'medicine',
 'يؤهل الطالب للعمل في الرعاية التمريضية بالمستشفيات والمراكز الصحية بكفاءة عالية.',
 'Prepares students for professional nursing practice in hospitals and healthcare facilities.',
 4,
 ARRAY['Registered Nurse', 'ICU Nurse', 'Surgical Nurse', 'Community Health Nurse', 'Nursing Educator'],
 ARRAY['science', 'math']),

-- Engineering
('civil-engineering', 'هندسة مدنية', 'Civil Engineering', 'engineering',
 'يتناول تصميم وإنشاء البنية التحتية من طرق وجسور ومبانٍ وأنظمة مياه وصرف صحي.',
 'Covers design and construction of infrastructure including roads, bridges, buildings, and water systems.',
 4,
 ARRAY['Structural Engineer', 'Construction Project Manager', 'Urban Planner', 'Water Resources Engineer', 'Transportation Engineer'],
 ARRAY['science', 'math']),

('mechanical-engineering', 'هندسة ميكانيكية', 'Mechanical Engineering', 'engineering',
 'يشمل ميكانيكا المواد، التصميم الميكانيكي، الديناميكا الحرارية، والأنظمة الميكانيكية.',
 'Covers mechanics of materials, mechanical design, thermodynamics, and mechanical systems.',
 4,
 ARRAY['Mechanical Engineer', 'Product Designer', 'Automotive Engineer', 'Manufacturing Engineer', 'HVAC Engineer'],
 ARRAY['science', 'math']),

('electrical-engineering', 'هندسة كهربائية', 'Electrical Engineering', 'engineering',
 'يدرس الأنظمة الكهربائية والإلكترونية وشبكات الطاقة والاتصالات.',
 'Studies electrical and electronic systems, power networks, and telecommunications.',
 4,
 ARRAY['Electrical Engineer', 'Power Systems Engineer', 'Electronics Design Engineer', 'Telecom Engineer', 'Control Systems Engineer'],
 ARRAY['science', 'math']),

('computer-engineering', 'هندسة حاسبات', 'Computer Engineering', 'computer_science',
 'يجمع بين الهندسة الكهربائية وعلوم الحاسوب لتصميم الأجهزة والبرمجيات المدمجة.',
 'Combines electrical engineering and computer science to design hardware and embedded software systems.',
 4,
 ARRAY['Hardware Engineer', 'Embedded Systems Developer', 'FPGA Engineer', 'IoT Engineer', 'Systems Architect'],
 ARRAY['science', 'math']),

('architecture', 'عمارة', 'Architecture', 'architecture',
 'يدرس الطالب التصميم المعماري والتخطيط العمراني والتراث وتاريخ العمارة.',
 'Studies architectural design, urban planning, heritage conservation, and history of architecture.',
 5,
 ARRAY['Architect', 'Urban Planner', 'Interior Designer', 'Landscape Architect', 'Real Estate Developer'],
 ARRAY['science', 'math', 'arts']),

-- Computer Science & IT
('computer-science', 'علوم حاسب', 'Computer Science', 'computer_science',
 'يغطي الخوارزميات وهياكل البيانات والبرمجة والذكاء الاصطناعي وتطوير البرمجيات.',
 'Covers algorithms, data structures, programming, artificial intelligence, and software development.',
 4,
 ARRAY['Software Engineer', 'Data Scientist', 'AI/ML Engineer', 'Backend Developer', 'Full-Stack Developer', 'Cybersecurity Analyst'],
 ARRAY['science', 'math', 'ig', 'american']),

('information-technology', 'تقنية معلومات', 'Information Technology', 'computer_science',
 'يركز على تطبيقات الحاسوب في المؤسسات وإدارة الشبكات وأمن المعلومات.',
 'Focuses on enterprise computing applications, network administration, and information security.',
 4,
 ARRAY['IT Manager', 'Network Administrator', 'Systems Analyst', 'Database Administrator', 'Cloud Engineer'],
 ARRAY['science', 'math', 'ig', 'american']),

-- Business
('business-administration', 'إدارة أعمال', 'Business Administration (BBA)', 'business',
 'يشمل الإدارة والتسويق والتمويل والموارد البشرية ومبادئ ريادة الأعمال.',
 'Covers management, marketing, finance, human resources, and entrepreneurship principles.',
 4,
 ARRAY['Business Manager', 'Marketing Specialist', 'Financial Analyst', 'HR Manager', 'Entrepreneur', 'Consultant'],
 ARRAY['science', 'math', 'arts', 'ig', 'american', 'french']),

('accounting', 'محاسبة', 'Accounting', 'business',
 'يدرس المحاسبة المالية والتكاليف والضرائب والمراجعة وتحليل القوائم المالية.',
 'Studies financial accounting, cost accounting, taxation, auditing, and financial statement analysis.',
 4,
 ARRAY['Accountant', 'Auditor', 'Tax Consultant', 'Financial Controller', 'CFO'],
 ARRAY['science', 'math', 'arts', 'ig', 'american']),

('economics', 'اقتصاد', 'Economics', 'business',
 'يتناول الاقتصاد الجزئي والكلي والسياسات الاقتصادية والتحليل الكمي.',
 'Covers microeconomics, macroeconomics, economic policy, and quantitative analysis.',
 4,
 ARRAY['Economist', 'Policy Analyst', 'Investment Analyst', 'Economic Researcher', 'Banking Professional'],
 ARRAY['science', 'math', 'arts', 'ig', 'american']),

('marketing', 'تسويق', 'Marketing', 'business',
 'يغطي استراتيجيات التسويق والتسويق الرقمي وسلوك المستهلك وإدارة العلامات التجارية.',
 'Covers marketing strategies, digital marketing, consumer behavior, and brand management.',
 4,
 ARRAY['Marketing Manager', 'Digital Marketing Specialist', 'Brand Manager', 'Market Research Analyst', 'Advertising Executive'],
 ARRAY['science', 'math', 'arts', 'ig', 'american', 'french']),

-- Law
('law', 'حقوق', 'Law (LLB)', 'law',
 'يدرس الطالب القانون المدني والجنائي والتجاري والدولي مع التدريب العملي.',
 'Studies civil, criminal, commercial, and international law with practical training.',
 4,
 ARRAY['Lawyer', 'Judge', 'Legal Advisor', 'Corporate Counsel', 'Diplomat', 'Legal Researcher'],
 ARRAY['science', 'math', 'arts', 'ig', 'american', 'french']),

-- Arts & Humanities
('english-literature', 'اللغة الإنجليزية وآدابها', 'English Language & Literature', 'arts',
 'يشمل دراسة الأدب الإنجليزي وتاريخه واللغويات والترجمة.',
 'Covers English literature, literary history, linguistics, and translation.',
 4,
 ARRAY['English Teacher', 'Translator', 'Content Writer', 'Editor', 'Diplomat', 'Journalist'],
 ARRAY['arts', 'ig', 'american', 'french']),

('arabic-literature', 'اللغة العربية وآدابها', 'Arabic Language & Literature', 'arts',
 'يدرس الأدب العربي الكلاسيكي والحديث واللغويات والنقد الأدبي.',
 'Studies classical and modern Arabic literature, linguistics, and literary criticism.',
 4,
 ARRAY['Arabic Teacher', 'Journalist', 'Author', 'Translator', 'Linguist'],
 ARRAY['arts', 'science', 'math']),

-- Media
('mass-communication', 'إعلام وصحافة', 'Mass Communication & Journalism', 'media',
 'يغطي الصحافة المطبوعة والرقمية والإذاعة والتلفزيون والعلاقات العامة.',
 'Covers print and digital journalism, broadcasting, television, and public relations.',
 4,
 ARRAY['Journalist', 'TV Presenter', 'PR Specialist', 'Digital Content Creator', 'Film Producer', 'Radio Host'],
 ARRAY['arts', 'science', 'math', 'ig', 'american']),

-- Science
('biology', 'علم الأحياء', 'Biology', 'science',
 'يدرس الكائنات الحية وعلم الوراثة والبيئة والتقنية الحيوية.',
 'Studies living organisms, genetics, ecology, and biotechnology.',
 4,
 ARRAY['Research Scientist', 'Biologist', 'Lab Technician', 'Environmental Consultant', 'Biotech Researcher'],
 ARRAY['science']),

('chemistry', 'كيمياء', 'Chemistry', 'science',
 'يتناول الكيمياء العضوية وغير العضوية والفيزيائية والتحليلية.',
 'Covers organic, inorganic, physical, and analytical chemistry.',
 4,
 ARRAY['Research Chemist', 'Lab Analyst', 'Pharmaceutical Chemist', 'Quality Control Specialist', 'Chemistry Teacher'],
 ARRAY['science']),

-- Education
('education', 'تربية وتعليم', 'Education', 'education',
 'يؤهل الطالب للتعليم في مراحل مختلفة مع دراسة علم النفس التربوي والمناهج.',
 'Prepares students for teaching at various levels, covering educational psychology and curriculum design.',
 4,
 ARRAY['Teacher', 'School Principal', 'Educational Consultant', 'Curriculum Developer', 'Special Education Teacher'],
 ARRAY['science', 'math', 'arts'])

on conflict (slug) do nothing;


-- ─── EXPANDED UNIVERSITIES ─────────────────────────────────

insert into universities (
  slug, name_ar, name_en, type, system,
  location_ar, location_en, governorate, metro_area,
  founded_year, website,
  description_ar, description_en,
  tuition_min, tuition_max, tuition_currency,
  faculties_count, total_students, ranking_egypt,
  accreditations
) values

-- Public universities
('cairo-university', 'جامعة القاهرة', 'Cairo University', 'public', 'egyptian',
 'الجيزة', 'Giza', 'Giza', 'greater-cairo',
 1908, 'https://cu.edu.eg',
 'أعرق الجامعات المصرية وأكبرها، تأسست عام 1908 وتضم أكثر من 25 كلية في مختلف التخصصات. تتصدر التصنيفات المحلية وتحتل مراتب متقدمة في التصنيفات العربية والدولية.',
 'Egypt''s oldest and largest university founded in 1908, with 25+ faculties across all disciplines. Consistently ranked first in Egypt and among the top in the Arab world.',
 0, 0, 'EGP', 25, 250000, 1,
 ARRAY['NAQAAE']),

('ain-shams-university', 'جامعة عين شمس', 'Ain Shams University', 'public', 'egyptian',
 'القاهرة', 'Cairo', 'Cairo', 'greater-cairo',
 1950, 'https://www.asu.edu.eg',
 'ثاني أكبر الجامعات الحكومية المصرية، تأسست عام 1950 وتتميز بكلياتها الطبية والهندسية والعلوم الإنسانية.',
 'Egypt''s second largest public university founded in 1950, known for its strong medical, engineering, and humanities faculties.',
 0, 0, 'EGP', 15, 180000, 2,
 ARRAY['NAQAAE']),

('alexandria-university', 'جامعة الإسكندرية', 'Alexandria University', 'public', 'egyptian',
 'الإسكندرية', 'Alexandria', 'Alexandria', 'alexandria',
 1938, 'https://www.alexu.edu.eg',
 'الجامعة الحكومية الرئيسية في الإسكندرية، تأسست عام 1938 وتتميز بكلياتها البحرية والهندسية والطبية.',
 'The main public university in Alexandria founded in 1938, renowned for its maritime, engineering, and medical faculties.',
 0, 0, 'EGP', 22, 190000, 3,
 ARRAY['NAQAAE']),

('mansoura-university', 'جامعة المنصورة', 'Mansoura University', 'public', 'egyptian',
 'المنصورة', 'Mansoura', 'Dakahlia', 'nile-delta',
 1962, 'https://www.mans.edu.eg',
 'من أبرز الجامعات الإقليمية، تشتهر بكليتي الطب والهندسة وأبحاثها في زراعة الكلى.',
 'One of Egypt''s leading regional universities, internationally recognized for its kidney transplant research and strong medical and engineering programs.',
 0, 0, 'EGP', 16, 150000, 4,
 ARRAY['NAQAAE']),

('helwan-university', 'جامعة حلوان', 'Helwan University', 'public', 'egyptian',
 'القاهرة', 'Cairo', 'Cairo', 'greater-cairo',
 1975, 'https://www.helwan.edu.eg',
 'تتميز بكلياتها في الفنون التطبيقية والموسيقى والتمريض والهندسة والتجارة.',
 'Known for its applied arts, music, nursing, engineering, and commerce faculties.',
 0, 0, 'EGP', 18, 140000, 6,
 ARRAY['NAQAAE']),

('assiut-university', 'جامعة أسيوط', 'Assiut University', 'public', 'egyptian',
 'أسيوط', 'Assiut', 'Assiut', 'upper-egypt',
 1957, 'https://www.aun.edu.eg',
 'الجامعة الرئيسية في صعيد مصر، تتميز بكلياتها العلمية والهندسية والطبية.',
 'The leading university in Upper Egypt, with strong science, engineering, and medical programs.',
 0, 0, 'EGP', 17, 120000, 7,
 ARRAY['NAQAAE']),

('zagazig-university', 'جامعة الزقازيق', 'Zagazig University', 'public', 'egyptian',
 'الزقازيق', 'Zagazig', 'Sharqia', 'nile-delta',
 1974, 'https://www.zu.edu.eg',
 'جامعة إقليمية رائدة في دلتا النيل بكلياتها الزراعية والطبية والهندسية.',
 'A leading regional university in the Nile Delta with notable agricultural, medical, and engineering programs.',
 0, 0, 'EGP', 16, 110000, 8,
 ARRAY['NAQAAE']),

('tanta-university', 'جامعة طنطا', 'Tanta University', 'public', 'egyptian',
 'طنطا', 'Tanta', 'Gharbia', 'nile-delta',
 1972, 'https://www.tanta.edu.eg',
 'جامعة حكومية رائدة في الدلتا تتميز بكليتي الطب والصيدلة.',
 'A leading public university in the Nile Delta region, known for its medicine and pharmacy faculties.',
 0, 0, 'EGP', 14, 100000, 9,
 ARRAY['NAQAAE']),

-- Private universities
('guc', 'الجامعة الألمانية بالقاهرة', 'German University in Cairo (GUC)', 'private', 'german',
 'القاهرة الجديدة', 'New Cairo', 'Cairo', 'greater-cairo',
 2003, 'https://www.guc.edu.eg',
 'جامعة خاصة تعمل بالنظام الألماني، تقدم برامج مزدوجة مع جامعات ألمانية في الهندسة والمعلوماتية والأعمال.',
 'A private university operating on the German system, offering dual-degree programs with German universities in engineering, informatics, and business.',
 120000, 220000, 'EGP', 8, 8000, 10,
 ARRAY['NAQAAE', 'German Accreditation Council']),

('auc', 'الجامعة الأمريكية بالقاهرة', 'American University in Cairo (AUC)', 'international', 'american',
 'القاهرة الجديدة', 'New Cairo', 'Cairo', 'greater-cairo',
 1919, 'https://www.aucegypt.edu',
 'أقدم الجامعات الخاصة في مصر بنظام أمريكي معتمد من مؤسسات أمريكية. تعتبر من أرقى الجامعات في الشرق الأوسط.',
 'Egypt''s oldest private university with full American accreditation. Consistently ranked among the top universities in the Middle East.',
 350000, 550000, 'EGP', 7, 6000, 5,
 ARRAY['Middle States Commission on Higher Education (USA)', 'ABET']),

('msa-university', 'جامعة مصر للعلوم والتكنولوجيا', 'MSA University', 'private', 'british',
 'القاهرة الجديدة', 'New Cairo', 'Cairo', 'greater-cairo',
 1996, 'https://www.msa.edu.eg',
 'جامعة خاصة رائدة تتشارك مع جامعة غرينتش البريطانية، وتقدم برامج في الهندسة والأعمال والصيدلة والتكنولوجيا.',
 'A leading private university affiliated with the University of Greenwich, offering programs in engineering, business, pharmacy, and technology.',
 80000, 160000, 'EGP', 10, 18000, 11,
 ARRAY['NAQAAE', 'University of Greenwich']),

('nile-university', 'جامعة النيل', 'Nile University', 'private', 'american',
 'الشيخ زايد', 'Sheikh Zayed', 'Giza', 'greater-cairo',
 2006, 'https://nu.edu.eg',
 'جامعة بحثية خاصة متخصصة في التكنولوجيا والأعمال، تركز على البحث العلمي والابتكار وريادة الأعمال.',
 'A private research-focused university specializing in technology and business, with a strong emphasis on scientific research, innovation, and entrepreneurship.',
 90000, 180000, 'EGP', 6, 4000, 13,
 ARRAY['NAQAAE']),

('bue', 'الجامعة البريطانية في مصر', 'British University in Egypt (BUE)', 'private', 'british',
 'القاهرة', 'Cairo', 'Cairo', 'greater-cairo',
 2005, 'https://www.bue.edu.eg',
 'جامعة خاصة تعمل بالنظام البريطاني وتمنح درجات معتمدة من جامعات بريطانية في الهندسة والأعمال والحوسبة.',
 'A private university operating on the British system, awarding degrees validated by UK universities in engineering, business, and computing.',
 110000, 200000, 'EGP', 9, 10000, 14,
 ARRAY['NAQAAE', 'UK University Partners']),

('misr-international', 'جامعة مصر الدولية', 'Misr International University (MIU)', 'private', 'american',
 'القاهرة الجديدة', 'New Cairo', 'Cairo', 'greater-cairo',
 1996, 'https://www.miu.edu.eg',
 'جامعة خاصة بنظام أمريكي تقدم برامج في الصيدلة والهندسة والأعمال والإعلام والحاسبات.',
 'A private American-system university offering programs in pharmacy, engineering, business, media, and computing.',
 70000, 140000, 'EGP', 9, 12000, 15,
 ARRAY['NAQAAE']),

('pharos-university', 'جامعة فاروس', 'Pharos University in Alexandria', 'private', 'egyptian',
 'الإسكندرية', 'Alexandria', 'Alexandria', 'alexandria',
 2006, 'https://www.pua.edu.eg',
 'جامعة خاصة في الإسكندرية تقدم برامج في الهندسة والتجارة والإعلام والحاسبات والصيدلة.',
 'A private university in Alexandria offering programs in engineering, business, media, computing, and pharmacy.',
 65000, 130000, 'EGP', 8, 8000, 16,
 ARRAY['NAQAAE']),

('modern-sciences-arts', 'جامعة العلوم والتكنولوجيا الحديثة', 'Modern Sciences and Arts University (MSA Giza)', 'private', 'british',
 'الجيزة', 'Giza', 'Giza', 'greater-cairo',
 1996, 'https://www.msa.edu.eg',
 'فرع الجيزة لجامعة مصر للعلوم والتكنولوجيا بنظام بريطاني معتمد.',
 'Giza campus of MSA University with UK-validated British system programs.',
 75000, 150000, 'EGP', 7, 9000, 17,
 ARRAY['NAQAAE', 'University of Greenwich']),

('arab-academy', 'الأكاديمية العربية للعلوم والتكنولوجيا', 'Arab Academy for Science, Technology & Maritime Transport (AASTMT)', 'private', 'egyptian',
 'الإسكندرية', 'Alexandria', 'Alexandria', 'alexandria',
 1972, 'https://www.aast.edu',
 'أكاديمية متخصصة في العلوم البحرية والنقل والتكنولوجيا والأعمال مع فروع في القاهرة والغردقة وبورسعيد.',
 'Specialized in maritime sciences, transportation, technology, and business with campuses across Egypt and internationally.',
 70000, 140000, 'EGP', 8, 30000, 12,
 ARRAY['NAQAAE', 'Arab League Educational Cultural and Scientific Organization']),

-- International universities
('esmad', 'إيزميت الجامعية', 'El Shorouk Academy', 'private', 'egyptian',
 'القاهرة الجديدة', 'New Cairo', 'Cairo', 'greater-cairo',
 2000, 'https://sha.edu.eg',
 'أكاديمية تقدم برامج في الإعلام والحاسبات والتجارة والتصميم.',
 'Academy offering programs in media, computing, business, and design.',
 45000, 90000, 'EGP', 5, 6000, 20,
 ARRAY['NAQAAE']),

('modern-cairo-university', 'جامعة القاهرة الحديثة', 'Modern Cairo University (Misr University for Science and Technology)', 'private', 'egyptian',
 'الجيزة', 'Giza', 'Giza', 'greater-cairo',
 2006, 'https://must.edu.eg',
 'جامعة خاصة تقدم برامج في الطب والهندسة والصيدلة والأعمال.',
 'Private university offering programs in medicine, engineering, pharmacy, and business.',
 80000, 180000, 'EGP', 11, 15000, 18,
 ARRAY['NAQAAE'])

on conflict (slug) do update set
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  tuition_min = excluded.tuition_min,
  tuition_max = excluded.tuition_max,
  faculties_count = excluded.faculties_count,
  total_students = excluded.total_students,
  ranking_egypt = excluded.ranking_egypt,
  website = excluded.website,
  governorate = excluded.governorate,
  metro_area = excluded.metro_area,
  system = excluded.system,
  accreditations = excluded.accreditations;


-- ─── UNIVERSITY MAJORS (join table) ─────────────────────────
-- Links universities to majors with per-university tuition and cutoffs

-- Cairo University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 97.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'medicine'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 92.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'pharmacy'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 88.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 88.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'electrical-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 85.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 75.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'law'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 70.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 93.0, 'arabic'
from universities u, majors m
where u.slug = 'cairo-university' and m.slug = 'dentistry'
on conflict (university_id, major_id) do nothing;

-- Ain Shams University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 96.5, 'arabic'
from universities u, majors m
where u.slug = 'ain-shams-university' and m.slug = 'medicine'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 87.0, 'arabic'
from universities u, majors m
where u.slug = 'ain-shams-university' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 84.0, 'arabic'
from universities u, majors m
where u.slug = 'ain-shams-university' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 73.0, 'arabic'
from universities u, majors m
where u.slug = 'ain-shams-university' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 90.0, 'arabic'
from universities u, majors m
where u.slug = 'ain-shams-university' and m.slug = 'pharmacy'
on conflict (university_id, major_id) do nothing;

-- Alexandria University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 96.0, 'arabic'
from universities u, majors m
where u.slug = 'alexandria-university' and m.slug = 'medicine'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 86.0, 'arabic'
from universities u, majors m
where u.slug = 'alexandria-university' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 83.0, 'arabic'
from universities u, majors m
where u.slug = 'alexandria-university' and m.slug = 'electrical-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 91.0, 'arabic'
from universities u, majors m
where u.slug = 'alexandria-university' and m.slug = 'pharmacy'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 72.0, 'arabic'
from universities u, majors m
where u.slug = 'alexandria-university' and m.slug = 'law'
on conflict (university_id, major_id) do nothing;

-- GUC
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 130000, 'EGP', 75.0, 'english'
from universities u, majors m
where u.slug = 'guc' and m.slug = 'computer-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 130000, 'EGP', 75.0, 'english'
from universities u, majors m
where u.slug = 'guc' and m.slug = 'mechanical-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 120000, 'EGP', 70.0, 'english'
from universities u, majors m
where u.slug = 'guc' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 120000, 'EGP', 68.0, 'english'
from universities u, majors m
where u.slug = 'guc' and m.slug = 'architecture'
on conflict (university_id, major_id) do nothing;

-- AUC
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 400000, 'EGP', 80.0, 'english'
from universities u, majors m
where u.slug = 'auc' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 400000, 'EGP', 78.0, 'english'
from universities u, majors m
where u.slug = 'auc' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 400000, 'EGP', 78.0, 'english'
from universities u, majors m
where u.slug = 'auc' and m.slug = 'economics'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 380000, 'EGP', 75.0, 'english'
from universities u, majors m
where u.slug = 'auc' and m.slug = 'mass-communication'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 400000, 'EGP', 77.0, 'english'
from universities u, majors m
where u.slug = 'auc' and m.slug = 'mechanical-engineering'
on conflict (university_id, major_id) do nothing;

-- MSA University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 90000, 'EGP', 65.0, 'english'
from universities u, majors m
where u.slug = 'msa-university' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 95000, 'EGP', 70.0, 'english'
from universities u, majors m
where u.slug = 'msa-university' and m.slug = 'pharmacy'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 85000, 'EGP', 65.0, 'english'
from universities u, majors m
where u.slug = 'msa-university' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 90000, 'EGP', 68.0, 'english'
from universities u, majors m
where u.slug = 'msa-university' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

-- Nile University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 100000, 'EGP', 70.0, 'english'
from universities u, majors m
where u.slug = 'nile-university' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 105000, 'EGP', 72.0, 'english'
from universities u, majors m
where u.slug = 'nile-university' and m.slug = 'computer-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 95000, 'EGP', 68.0, 'english'
from universities u, majors m
where u.slug = 'nile-university' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

-- BUE
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 115000, 'EGP', 68.0, 'english'
from universities u, majors m
where u.slug = 'bue' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 120000, 'EGP', 70.0, 'english'
from universities u, majors m
where u.slug = 'bue' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 110000, 'EGP', 65.0, 'english'
from universities u, majors m
where u.slug = 'bue' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

-- MIU
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 80000, 'EGP', 70.0, 'english'
from universities u, majors m
where u.slug = 'misr-international' and m.slug = 'pharmacy'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 75000, 'EGP', 65.0, 'english'
from universities u, majors m
where u.slug = 'misr-international' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 70000, 'EGP', 63.0, 'english'
from universities u, majors m
where u.slug = 'misr-international' and m.slug = 'mass-communication'
on conflict (university_id, major_id) do nothing;

-- Arab Academy (AASTMT)
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 75000, 'EGP', 65.0, 'english'
from universities u, majors m
where u.slug = 'arab-academy' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 80000, 'EGP', 68.0, 'english'
from universities u, majors m
where u.slug = 'arab-academy' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 70000, 'EGP', 63.0, 'english'
from universities u, majors m
where u.slug = 'arab-academy' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 80000, 'EGP', 67.0, 'english'
from universities u, majors m
where u.slug = 'arab-academy' and m.slug = 'information-technology'
on conflict (university_id, major_id) do nothing;

-- Mansoura University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 95.5, 'arabic'
from universities u, majors m
where u.slug = 'mansoura-university' and m.slug = 'medicine'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 85.0, 'arabic'
from universities u, majors m
where u.slug = 'mansoura-university' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 89.0, 'arabic'
from universities u, majors m
where u.slug = 'mansoura-university' and m.slug = 'pharmacy'
on conflict (university_id, major_id) do nothing;

-- Helwan University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 80.0, 'arabic'
from universities u, majors m
where u.slug = 'helwan-university' and m.slug = 'architecture'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 75.0, 'arabic'
from universities u, majors m
where u.slug = 'helwan-university' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 0, 'EGP', 65.0, 'arabic'
from universities u, majors m
where u.slug = 'helwan-university' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;

-- Pharos University
insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 70000, 'EGP', 65.0, 'english'
from universities u, majors m
where u.slug = 'pharos-university' and m.slug = 'computer-science'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 75000, 'EGP', 68.0, 'english'
from universities u, majors m
where u.slug = 'pharos-university' and m.slug = 'civil-engineering'
on conflict (university_id, major_id) do nothing;

insert into university_majors (university_id, major_id, tuition_per_year, currency, min_score, language)
select u.id, m.id, 65000, 'EGP', 63.0, 'english'
from universities u, majors m
where u.slug = 'pharos-university' and m.slug = 'business-administration'
on conflict (university_id, major_id) do nothing;
