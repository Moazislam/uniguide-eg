export interface AppError {
  messageAr: string;
  messageEn: string;
  originalError?: any;
  context?: string;
}

export function wrapSupabaseError(error: any, context?: string): AppError {
  console.error(`Supabase Error [${context}]:`, error);

  let messageAr = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
  let messageEn = "An unexpected error occurred. Please try again.";

  if (error.code === "PGRST116") {
    messageAr = "لم يتم العثور على البيانات المطلوبة.";
    messageEn = "The requested data was not found.";
  } else if (error.code === "42501") {
    messageAr = "ليس لديك صلاحية للوصول إلى هذه البيانات.";
    messageEn = "You do not have permission to access this data.";
  } else if (error.message?.includes("network")) {
    messageAr = "خطأ في الاتصال بالشبكة. تأكد من اتصالك بالإنترنت.";
    messageEn = "Network error. Please check your internet connection.";
  }

  return {
    messageAr,
    messageEn,
    originalError: error,
    context,
  };
}
