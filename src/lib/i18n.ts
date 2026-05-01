export function translateAuthError(error: string, isAr: boolean): string {
  if (!error) return "";

  const errorMap: Record<string, { ar: string; en: string }> = {
    "Invalid login credentials": {
      ar: "بيانات تسجيل الدخول غير صحيحة",
      en: "Invalid login credentials",
    },
    "Email not confirmed": {
      ar: "لم يتم تأكيد البريد الإلكتروني بعد",
      en: "Email not confirmed",
    },
    "User already registered": {
      ar: "هذا البريد الإلكتروني مسجل بالفعل",
      en: "User already registered",
    },
    "Password should be at least 6 characters": {
      ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
      en: "Password should be at least 6 characters",
    },
    "Invalid email": {
      ar: "البريد الإلكتروني غير صحيح",
      en: "Invalid email",
    },
  };

  // Find exact match or partial match
  const entry = Object.entries(errorMap).find(([key]) => error.includes(key));
  
  if (entry) {
    return isAr ? entry[1].ar : entry[1].en;
  }

  // Fallback
  return error;
}
