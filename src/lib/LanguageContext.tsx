"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const dictionaries: Record<Language, Record<string, string>> = {
  ar: {
    // Nav
    "nav.universities": "الجامعات",
    "nav.majors": "التخصصات",
    "nav.compare": "مقارنة",
    "nav.login": "دخول",
    "nav.start": "ابدأ الآن",
    "nav.profile": "ملفي",
    "nav.home": "الرئيسية",
    "nav.signup": "حساب جديد",

    // Hero
    "hero.badge": "قرارات جامعية مخصصة للطلاب المصريين",
    "hero.title": "اختار جامعتك",
    "hero.titleHighlight": "بعقل أهدى ووضوح أكبر",
    "hero.description": "UniGuide يجمع لك البحث، المطابقة، والمقارنة في رحلة واحدة. بدل ما تدور في عشرات المواقع، خذ نتيجة مرتبة حسب درجتك، ميزانيتك، موقعك، واهتماماتك.",
    "hero.ctaMatch": "ابدأ ملف المطابقة",
    "hero.ctaBrowse": "استعرض الجامعات",

    // Pillars
    "pillar.clear.title": "قرار أوضح",
    "pillar.clear.text": "نعرض الخيارات الواقعية أولاً ثم نرتبها حسب ملاءمتها لك، لا حسب الشهرة فقط.",
    "pillar.budget.title": "ميزانية أذكى",
    "pillar.budget.text": "النتائج تستبعد الخيارات المبالغ فيها وتبرز البدائل التي ما زالت تناسب أهدافك.",
    "pillar.compare.title": "مقارنة أسرع",
    "pillar.compare.text": "اجمع الجامعات أثناء التصفح ثم افتح مقارنة مركزة بدل القفز بين صفحات كثيرة.",

    // Preview
    "preview.title": "ملف واحد، نتائج أذكى",
    "preview.fit": "نسبة التوافق",
    "preview.step1": "أنشئ ملف المطابقة مرة واحدة",
    "preview.step2": "أدخل الدرجة والتفضيلات الأساسية",
    "preview.step3": "شاهد الجامعات المناسبة وأفضل التخصصات داخل كل جامعة",
    "preview.factors": "ما الذي يغير الترتيب",
    "preview.compare": "أضف الجامعات أثناء التصفح، ثم افتح شاشة مقارنة جاهزة بدل تدوين الملاحظات يدويًا.",

    // Stats
    "stats.universities": "جامعات مصرية",
    "stats.compare": "جامعات في المقارنة",
    "stats.profile": "ملف شخصي واحد",
    "stats.results": "نتائج موجهة حسب الطالب",

    // Features
    "features.title": "رحلة واحدة بدل مواقع كثيرة",
    "features.subtitle": "كل خطوة في المنصة مصممة لتقليل الحيرة وزيادة وضوح القرار.",
    "features.cta": "جرّب التجربة الكاملة",
    "features.browse.title": "استكشف الجامعات",
    "features.browse.desc": "فلترة واضحة وسريعة بين الحكومية والخاصة والدولية بدون تشتيت.",
    "features.match.title": "مطابقة مخصصة",
    "features.match.desc": "نتائج تبنى على درجتك وميزانيتك ومكانك واهتماماتك الفعلية.",
    "features.compare.title": "مقارنة جانبية",
    "features.compare.desc": "أضف حتى 3 جامعات وراجع الفروقات الأساسية في شاشة واحدة.",
    "features.majors.title": "التخصصات والمسارات",
    "features.majors.desc": "اعرف التخصصات المتاحة وما الذي يمكن أن تقودك إليه بعد الدراسة.",

    // CTA
    "cta.ready": "مستعد لقرار أفضل؟",
    "cta.title": "ابدأ بملفك الشخصي ثم دع النظام يرتّب الخيارات لك",
    "cta.desc": "ليس الهدف أن تشاهد كل جامعة، بل أن ترى أولاً الخيارات التي تملك فرصة حقيقية ومناسبة لك.",
    "cta.openCompare": "افتح المقارنة",

    // Common
    "common.more": "المزيد",
    "common.loading": "جاري التحميل...",
    "common.noResults": "لا توجد نتائج مطابقة",
    "common.universities": "جامعات",
    "common.majors": "تخصصات",
    "common.eg": "في مصر",
    "common.next": "التالي",
    "common.prev": "رجوع",
    "common.save": "حفظ",
    "common.clear": "مسح",
    "common.add": "إضافة",
    "common.search": "بحث",

    // Universities
    "uni.title": "الجامعات المصرية",
    "uni.subtitle": "استكشف الجامعات الحكومية والخاصة والدولية",
    "uni.matchTitle": "المطابقات المخصصة",
    "uni.matchSubtitle": "توصيات مرتبة حسب مجموعك، ميزانيتك، وتفضيلاتك الشخصية",
    "uni.matchFound": "جامعة متوافقة تم ترتيبها لملفك الشخصي",
    "uni.bestMajors": "كل جامعة تتضمن أفضل التخصصات المتوافقة معك",
    "uni.found": "جامعة تم العثور عليها",

    // Majors
    "major.title": "التخصصات",
    "major.subtitle": "استكشف كل التخصصات المتاحة في الجامعات المصرية",
    "major.found": "تخصص متاح",
    "major.search": "ابحث عن تخصص...",
    "major.all": "الكل",

    // Details
    "details.about": "عن هذه الجامعة",
    "details.knownFor": "تشتهر بـ",
    "details.admission": "متطلبات القبول",
    "details.thanaweya": "الثانوية العامة",
    "details.ig": "متطلبات الـ IG",
    "details.american": "متطلبات الدبلومة الأمريكية",
    "details.faculties": "الكليات والمعاهد",
    "details.availableMajors": "التخصصات المتاحة",
    "details.accreditations": "الاعتمادات",
    "details.compareCta": "قارن مع جامعات أخرى",
    "details.compareDesc": "قارن الفروقات الأساسية جنباً إلى جنب",
    "details.goToCompare": "اذهب للمقارنة",
    "details.bestUnis": "أفضل الجامعات لهذا التخصص",
    "details.bestUnisDesc": "أفضل الجامعات ترتيباً لهذا التخصص",
    "details.allUnis": "جميع الجامعات المتاحة",
    "details.futureCareer": "مستقبلك المهني",
    "details.needHelp": "محتاج مساعدة؟",
    "details.helpDesc": "نقدر نساعدك تختار الجامعة الأنسب لمجموعك وميزانيتك.",
    "details.tryEngine": "جرب المحرك الذكي",
    "details.minScore": "أدنى درجة",
    "details.tuition": "المصاريف السنوية",
    "details.duration": "المدة",
    "details.years": "سنوات",
    "details.language": "اللغة",
    "details.free": "مجاني",
    "details.departments": "التخصصات والأقسام",
    "details.details": "التفاصيل",

    // Profile
    "profile.title": "ملفي الشخصي",
    "profile.logout": "خروج",
    "profile.matchingProfile": "ملف المطابقة",
    "profile.customize": "خصص نتائجك بدقة",
    "profile.customizeDesc": "حدّث تفضيلاتك مرة واحدة وسنستخدمها لترتيب الجامعات والتخصصات بشكل يناسبك أنت بالذات.",
    "profile.completion": "نسبة اكتمال الملف",
    "profile.unsaved": "تغييرات غير محفوظة",
    "profile.upToDate": "محدّث",
    "profile.save": "حفظ التغييرات",
    "profile.saving": "جارٍ الحفظ...",
    "profile.success": "تم حفظ ملف المطابقة بنجاح",
    "profile.academic": "المسار الأكاديمي والدرجة",
    "profile.academicDesc": "هذه هي أقوى الإشارات لمطابقة القبول.",
    "profile.score": "الدرجة",
    "profile.scoreDesc": "الثانوية العامة / النسبة المتوقعة",
    "profile.interests": "الاهتمامات",
    "profile.interestsDesc": "اختر مجالات متعددة لتبقى التوصيات واسعة ولكن ذات صلة.",
    "profile.budgetLocation": "الميزانية والمكان",
    "profile.budgetLocationDesc": "تساعد هذه في استبعاد الخيارات غير الواقعية قبل الترتيب.",
    "profile.budget": "الميزانية",
    "profile.location": "الموقع المفضل",
    "profile.mobility": "الحركية",
    "profile.studyPrefs": "تفضيلات الدراسة",
    "profile.studyPrefsDesc": "استخدم هذه لتوجيه المحرك نحو نمط الجامعة الذي تريده.",
    "profile.type": "نوع الجامعة",
    "profile.system": "النظام التعليمي",
    "profile.shortlist": "قائمتي المختصرة",
    "profile.noShortlist": "لا توجد جامعات في قائمتك بعد",
    "profile.engine": "محرك التوصيات",
    "profile.currentProfile": "ملف المطابقة الحالي",
    "profile.profilePowered": "ملفك المحفوظ يشغل الآن التوصيات المخصصة.",
    "profile.profileEmpty": "أكمل ملفك مرة واحدة واستخدمه في أي وقت.",
    "profile.showResults": "اعرض النتائج الشخصية",
    "profile.fullExperience": "افتح تجربة المطابقة الكاملة",
    "profile.snapshot": "لقطة سريعة",

    // Auth
    "auth.signinTitle": "ادخل وكمّل رحلتك الجامعية",
    "auth.signupTitle": "أنشئ حسابك وابدأ ملف المطابقة",
    "auth.signinDesc": "سجّل الدخول للوصول إلى ملفك الشخصي ونتائجك المحفوظة.",
    "auth.signupDesc": "أنشئ حسابًا واحدًا فقط ثم عدّل ملف المطابقة وقتما تريد.",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.passwordHint": "6 أحرف على الأقل",
    "auth.name": "الاسم",
    "auth.namePlaceholder": "محمد أحمد",
    "auth.phone": "رقم الهاتف",
    "auth.track": "المسار الدراسي",
    "auth.score": "الدرجة الحالية",
    "auth.signinBtn": "تسجيل الدخول",
    "auth.signupBtn": "إنشاء الحساب",
    "auth.success": "تم إنشاء حسابك بنجاح. راجع بريدك الإلكتروني.",
    "auth.switchSignin": "بمجرد الدخول ستجد ملفك الشخصي ونتائج المطابقة محفوظة كما تركتها.",
    "auth.switchSignup": "لسنا بحاجة إلى خطوات إضافية هنا. الحساب يُنشأ من شاشة واحدة.",
    "auth.heroTitle": "الجامعة المناسبة",
    "auth.heroHighlight": "تبدأ من قرار أوضح",
    "auth.heroDesc": "ابحث، طابق، وقارن في تجربة واحدة أبسط. ملفك الشخصي هو نقطة البداية التي تخلّي النتائج أقرب لدرجاتك وميزانيتك واهتماماتك.",
    "auth.feat1": "ابنِ ملفًا شخصيًا يحفظ تفضيلاتك",
    "auth.feat2": "احصل على نتائج مخصصة حسب الدرجة والمكان والميزانية",
    "auth.feat3": "قارن بين الجامعات قبل اتخاذ القرار النهائي",

    // Onboarding
    "onboard.step": "الخطوة",
    "onboard.of": "من",
    "onboard.trackTitle": "ما هو نظامك الدراسي؟",
    "onboard.trackDesc": "نستخدم هذا لاستبعاد التخصصات التي لا تناسب مسارك الأكاديمي.",
    "onboard.scoreTitle": "ما درجتك الحالية أو المتوقعة؟",
    "onboard.scoreDesc": "يتفاعل المقياس فوراً لتعرف أين تقع درجتك قبل ترتيب الجامعات.",
    "onboard.interestsTitle": "ما المجالات التي تريدها؟",
    "onboard.interestsDesc": "اختر أكثر من مجال لتبقى التوصيات مرنة.",
    "onboard.budgetTitle": "ما ميزانيتك السنوية؟",
    "onboard.budgetDesc": "هذا يساعدنا على تجنب الجامعات التي تقع خارج نطاقك بوضوح.",
    "onboard.locationTitle": "أين تفضل الدراسة؟",
    "onboard.locationDesc": "الموقع يجب أن يغير النتائج لكل طالب، وليس فقط الدرجة والميزانية.",
    "onboard.prefsTitle": "ما تفضيلاتك الإضافية؟",
    "onboard.prefsDesc": "تساعد هذه الحقول في تخصيص النتائج لكل طالب بدلاً من عرض نفس القائمة للجميع.",
    "onboard.resultTitle": "النتائج أصبحت شخصية لكل طالب",
    "onboard.resultDesc": "سنقوم بحفظ هذا الملف وترتيب الجامعات والتخصصات حوله.",
    "onboard.showResults": "احفظ الملف واعرض النتائج الشخصية",
    "onboard.saving": "جارٍ حفظ الملف...",

    // Compare
    "compare.title": "مقارنة الجامعات",
    "compare.subtitle": "قارن المصاريف، الحجم، الترتيب، والملف الأساسي في جدول واحد مركز.",
    "compare.badge": "قارن حتى 3 جامعات جنباً إلى جنب",
    "compare.emptyTitle": "لا توجد جامعات للمقارنة بعد",
    "compare.emptyDesc": "أضف جامعات من صفحة التصفح لبدء المقارنة.",
    "compare.clearAll": "مسح الكل",
    "compare.addUni": "أضف جامعة",
    "compare.selected": "تم اختيار",
    "compare.unis": "جامعات",
    "compare.uni": "جامعة",
    "compare.trayTitle": "جامعة جاهزة للمقارنة",
    "compare.trayDesc": "اختر حتى 3 جامعات ثم افتح المقارنة الجانبية",
    "compare.open": "افتح المقارنة",
    "compare.full": "القائمة ممتلئة",
    "compare.inCompare": "في المقارنة",
    "compare.addCompare": "أضف للمقارنة",
    "compare.emptyTray": "تفريغ",

    "footer.rights": "جميع الحقوق محفوظة © ٢٠٢٦ UniGuide",
  },
  en: {
    // Nav
    "nav.universities": "Universities",
    "nav.majors": "Majors",
    "nav.compare": "Compare",
    "nav.login": "Login",
    "nav.start": "Get Started",
    "nav.profile": "Profile",
    "nav.home": "Home",
    "nav.signup": "Sign Up",

    // Hero
    "hero.badge": "Personalized university decisions for Egyptian students",
    "hero.title": "Choose Your University",
    "hero.titleHighlight": "With a Calmer Mind and Greater Clarity",
    "hero.description": "UniGuide combines search, matching, and comparison in one journey. Instead of searching dozens of sites, get results ranked by your score, budget, location, and interests.",
    "hero.ctaMatch": "Start Matching Profile",
    "hero.ctaBrowse": "Browse Universities",

    // Pillars
    "pillar.clear.title": "Clearer Decisions",
    "pillar.clear.text": "We show realistic options first, ranked by their suitability for you, not just by fame.",
    "pillar.budget.title": "Smarter Budgeting",
    "pillar.budget.text": "Results exclude over-budget options and highlight alternatives that still fit your goals.",
    "pillar.compare.title": "Faster Comparison",
    "pillar.compare.text": "Collect universities while browsing, then open a focused comparison instead of jumping between pages.",

    // Preview
    "preview.title": "One Profile, Smarter Results",
    "preview.fit": "Profile Fit",
    "preview.step1": "Create your matching profile once",
    "preview.step2": "Enter your score and basic preferences",
    "preview.step3": "See suitable universities and the best majors within each",
    "preview.factors": "What changes the ranking",
    "preview.compare": "Add universities while browsing, then open a ready-made comparison screen instead of taking notes manually.",

    // Stats
    "stats.universities": "Egyptian Universities",
    "stats.compare": "Compare up to 3",
    "stats.profile": "One Single Profile",
    "stats.results": "Student-Oriented Results",

    // Features
    "features.title": "One Journey Instead of Many Sites",
    "features.subtitle": "Every step on the platform is designed to reduce confusion and increase decision clarity.",
    "features.cta": "Try the Full Experience",
    "features.browse.title": "Browse Universities",
    "features.browse.desc": "Clear and fast filtering between public, private, and international without distraction.",
    "features.match.title": "Personalized Matching",
    "features.match.desc": "Results built on your actual score, budget, location, and interests.",
    "features.compare.title": "Side-by-Side Compare",
    "features.compare.desc": "Add up to 3 universities and review key differences on one screen.",
    "features.majors.title": "Majors & Paths",
    "features.majors.desc": "Learn about available majors and where they can lead you after graduation.",

    // CTA
    "cta.ready": "Ready to decide better?",
    "cta.title": "Start with your profile and let the system rank the options for you",
    "cta.desc": "The goal isn't to see every university, but to first see the options where you have a real and suitable chance.",
    "cta.openCompare": "Open Comparison",

    // Common
    "common.more": "See More",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.universities": "Universities",
    "common.majors": "Majors",
    "common.eg": "in Egypt",
    "common.next": "Next",
    "common.prev": "Back",
    "common.save": "Save",
    "common.clear": "Clear",
    "common.add": "Add",
    "common.search": "Search",

    // Universities
    "uni.title": "Egyptian Universities",
    "uni.subtitle": "Browse public, private, and international universities",
    "uni.matchTitle": "Personalized Matches",
    "uni.matchSubtitle": "Recommendations ranked by your score, budget, and personal preferences",
    "uni.matchFound": "personalized university matches ranked for your profile",
    "uni.bestMajors": "Each university includes its best matching majors for you",
    "uni.found": "universities found",

    // Majors
    "major.title": "Majors",
    "major.subtitle": "Explore all available university majors in Egypt",
    "major.found": "majors found",
    "major.search": "Search for a major...",
    "major.all": "All",

    // Details
    "details.about": "About this University",
    "details.knownFor": "Most Known For",
    "details.admission": "Admission Requirements",
    "details.thanaweya": "Thanaweya Amma",
    "details.ig": "IG / IGCSE Requirements",
    "details.american": "American Diploma Requirements",
    "details.faculties": "Faculties & Schools",
    "details.availableMajors": "Available Majors",
    "details.accreditations": "Accreditations",
    "details.compareCta": "Compare with other universities",
    "details.compareDesc": "Compare key differences side-by-side",
    "details.goToCompare": "Go to Compare",
    "details.bestUnis": "Best Universities for this Major",
    "details.bestUnisDesc": "Top ranked universities for this major",
    "details.allUnis": "All Available Universities",
    "details.futureCareer": "Your Career Path",
    "details.needHelp": "Need Help?",
    "details.helpDesc": "We can help you choose the best university for your score and budget.",
    "details.tryEngine": "Try Smart Engine",
    "details.minScore": "Min Score",
    "details.tuition": "Annual Tuition",
    "details.duration": "Duration",
    "details.years": "years",
    "details.language": "Language",
    "details.free": "Free",
    "details.departments": "Departments & Majors",
    "details.details": "Details",

    // Profile
    "profile.title": "My Profile",
    "profile.logout": "Logout",
    "profile.matchingProfile": "Matching Profile",
    "profile.customize": "Personalize Your Results",
    "profile.customizeDesc": "Update your preferences once and we'll use them to rank universities and majors specifically for you.",
    "profile.completion": "Profile Completion",
    "profile.unsaved": "Unsaved changes",
    "profile.upToDate": "Up to date",
    "profile.save": "Save Changes",
    "profile.saving": "Saving...",
    "profile.success": "Matching profile saved successfully",
    "profile.academic": "Academic Track & Score",
    "profile.academicDesc": "These are the strongest signals for admissions fit.",
    "profile.score": "Score",
    "profile.scoreDesc": "Thanaweya / expected percentage",
    "profile.interests": "Interests",
    "profile.interestsDesc": "Pick multiple fields so recommendations stay broad but relevant.",
    "profile.budgetLocation": "Budget & Location",
    "profile.budgetLocationDesc": "These help remove unrealistic options before ranking.",
    "profile.budget": "Budget",
    "profile.location": "Preferred Location",
    "profile.mobility": "Mobility",
    "profile.studyPrefs": "Study Preferences",
    "profile.studyPrefsDesc": "Use these to nudge the engine toward the style of university you want.",
    "profile.type": "University Type",
    "profile.system": "Educational System",
    "profile.shortlist": "My Shortlist",
    "profile.noShortlist": "No universities in your shortlist yet",
    "profile.engine": "Recommendation Engine",
    "profile.currentProfile": "Current Matching Profile",
    "profile.profilePowered": "Your saved profile is now powering personalized recommendations.",
    "profile.profileEmpty": "Complete your profile once and reuse it anytime.",
    "profile.showResults": "Show Personalized Results",
    "profile.fullExperience": "Open Full Matching Experience",
    "profile.snapshot": "Quick Snapshot",

    // Auth
    "auth.signinTitle": "Login and continue your journey",
    "auth.signupTitle": "Create account & start matching",
    "auth.signinDesc": "Sign in to access your profile and saved results.",
    "auth.signupDesc": "Create one account and edit your matching profile anytime.",
    "auth.email": "Email Address",
    "auth.password": "Password",
    "auth.passwordHint": "Min 6 characters",
    "auth.name": "Full Name",
    "auth.namePlaceholder": "John Doe",
    "auth.phone": "Phone Number",
    "auth.track": "Academic Track",
    "auth.score": "Current Score",
    "auth.signinBtn": "Sign In",
    "auth.signupBtn": "Create Account",
    "auth.success": "Account created! Please check your email to confirm.",
    "auth.switchSignin": "Once logged in, your profile and results will be exactly as you left them.",
    "auth.switchSignup": "No extra steps needed. Create account and finish profile later.",
    "auth.heroTitle": "The Right University",
    "auth.heroHighlight": "Starts with a Clearer Decision",
    "auth.heroDesc": "Search, match, and compare in one simpler experience. Your profile is the starting point that makes results closer to your score, budget, and interests.",
    "auth.feat1": "Build a profile that saves your preferences",
    "auth.feat2": "Get personalized results by score, location, and budget",
    "auth.feat3": "Compare universities before making the final call",

    // Onboarding
    "onboard.step": "Step",
    "onboard.of": "of",
    "onboard.trackTitle": "What is your academic track?",
    "onboard.trackDesc": "We use this to remove majors that do not fit your academic path.",
    "onboard.scoreTitle": "What is your current or expected score?",
    "onboard.scoreDesc": "The meter reacts instantly so you can feel where your score sits.",
    "onboard.interestsTitle": "What fields do you prefer?",
    "onboard.interestsDesc": "Choose more than one so the recommendations stay flexible.",
    "onboard.budgetTitle": "What is your annual budget?",
    "onboard.budgetDesc": "This helps us avoid universities that are clearly outside your range.",
    "onboard.locationTitle": "Where do you prefer to study?",
    "onboard.locationDesc": "Location should change the output for every student.",
    "onboard.prefsTitle": "Any additional preferences?",
    "onboard.prefsDesc": "These fields help tailor the output for each student.",
    "onboard.resultTitle": "Results are now personalized",
    "onboard.resultDesc": "We will save this profile and rank universities around it.",
    "onboard.showResults": "Save Profile & Show Results",
    "onboard.saving": "Saving profile...",

    // Compare
    "compare.title": "University Comparison",
    "compare.subtitle": "Compare fees, size, ranking, and basic profile in one focused table.",
    "compare.badge": "Compare up to 3 universities side by side",
    "compare.emptyTitle": "No universities to compare yet",
    "compare.emptyDesc": "Add universities from the browse page to start comparing.",
    "compare.clearAll": "Clear All",
    "compare.addUni": "Add University",
    "compare.selected": "Selected",
    "compare.unis": "Universities",
    "compare.uni": "University",
    "compare.trayTitle": "university ready to compare",
    "compare.trayDesc": "Choose up to 3 universities then open side-by-side compare",
    "compare.open": "Open Compare",
    "compare.full": "Compare list full",
    "compare.inCompare": "In Comparison",
    "compare.addCompare": "Add to Compare",
    "compare.emptyTray": "Empty",

    "footer.rights": "All rights reserved © 2026 UniGuide",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "ar" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const t = (key: string) => {
    return dictionaries[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isRtl: language === "ar", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
