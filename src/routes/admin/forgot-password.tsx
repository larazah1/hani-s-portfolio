import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/admin/AuthLayout";

export const Route = createFileRoute("/admin/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout title="نسيت كلمة المرور" subtitle="إعادة تعيين كلمة المرور تتم بمساعدة مسؤول آخر.">
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          لأسباب أمنية، لا يرسل هذا الموقع روابط إعادة تعيين كلمة المرور عبر البريد الإلكتروني.
          بدلاً من ذلك، اطلب من مسؤول آخر نشط تسجيل الدخول وإنشاء رابط إعداد جديد لك من{" "}
          <span className="font-medium text-foreground">الإدارة ← المسؤولون</span>.
        </p>
        <p>
          إذا لم يتوفر أي مسؤول آخر، يمكن لمن يدير الخادم تشغيل نص استرداد مباشرةً على قاعدة
          البيانات.
        </p>
      </div>
      <div className="mt-6 text-center text-sm">
        <Link
          to="/admin/login"
          className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          العودة إلى تسجيل الدخول
        </Link>
      </div>
    </AuthLayout>
  );
}
