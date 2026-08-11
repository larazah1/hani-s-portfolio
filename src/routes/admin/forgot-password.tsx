import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/admin/AuthLayout";

export const Route = createFileRoute("/admin/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot Password" subtitle="Password resets are peer-assisted.">
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          For security, this site doesn&rsquo;t email password reset links. Instead, ask another
          active admin to sign in and generate a new setup link for you from{" "}
          <span className="font-medium text-foreground">Admin → Admins</span>.
        </p>
        <p>
          If no other admin is available, whoever manages the server can run a recovery script
          directly against the database.
        </p>
      </div>
      <div className="mt-6 text-center text-sm">
        <Link
          to="/admin/login"
          className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
