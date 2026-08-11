import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/admin/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { acceptInvite } from "@/server-fns/auth";

export const Route = createFileRoute("/admin/setup")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: AdminSetupPage,
});

const setupFormSchema = z
  .object({
    password: z.string().min(10, "Password must be at least 10 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
type SetupFormValues = z.infer<typeof setupFormSchema>;

function AdminSetupPage() {
  const { token } = Route.useSearch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This setup link is missing its token.">
        <p className="text-sm text-muted-foreground">
          Ask another admin to send you a new setup link from Admin → Admins, or contact whoever
          manages the site.
        </p>
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

  async function onSubmit(values: SetupFormValues) {
    setServerError(null);
    const result = await acceptInvite({
      data: { token: token as string, password: values.password },
    });
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    await router.invalidate();
    await router.navigate({ to: "/admin" });
  }

  return (
    <AuthLayout title="Set Your Password" subtitle="Choose a password to activate your account.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Setting up…" : "Activate Account"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
