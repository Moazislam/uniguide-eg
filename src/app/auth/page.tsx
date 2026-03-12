"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // لو الطالب logged in خليه يروح للـ profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/profile");
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push("/profile");
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1a3a5c] flex items-center justify-center mx-auto mb-3">
            <span className="text-[#d4a843] font-bold text-xl font-cairo">U</span>
          </div>
          <h1 className="text-2xl font-black text-[#1a3a5c] font-cairo">UniGuide</h1>
          <p className="text-sm text-gray-500 font-cairo mt-1">سجّل دخولك وابدأ رحلتك الجامعية</p>
          <p className="text-xs text-gray-400 font-cairo">Sign in to start your university journey</p>
        </div>

        {/* Auth UI */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#1a3a5c",
                    brandAccent: "#2a5a8c",
                    inputBackground: "#faf7f2",
                    inputBorder: "#e5e7eb",
                    inputBorderFocus: "#d4a843",
                  },
                  radii: {
                    borderRadiusButton: "12px",
                    inputBorderRadius: "12px",
                  },
                  fonts: {
                    bodyFontFamily: "Cairo, sans-serif",
                    buttonFontFamily: "Cairo, sans-serif",
                    inputFontFamily: "Cairo, sans-serif",
                  },
                },
              },
              className: {
                button: "font-cairo font-bold",
                label: "font-cairo text-sm",
                input: "font-cairo",
              },
            }}
            providers={["google"]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "البريد الإلكتروني / Email",
                  password_label: "كلمة المرور / Password",
                  button_label: "تسجيل الدخول / Sign In",
                  link_text: "عندك حساب؟ سجّل دخولك",
                },
                sign_up: {
                  email_label: "البريد الإلكتروني / Email",
                  password_label: "كلمة المرور / Password",
                  button_label: "إنشاء حساب / Sign Up",
                  link_text: "معندكش حساب؟ سجّل دلوقتي",
                },
              },
            }}
            redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/profile`}
          />
        </div>

        <p className="text-center text-xs text-gray-400 font-cairo mt-4">
          بتسجيلك، بتوافق على شروط الاستخدام وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
}
