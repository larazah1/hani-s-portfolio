import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
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
import { changePassword } from "@/server-fns/auth";

export const Route = createFileRoute("/admin/_authed/change-password")({
  component: ChangePasswordPage,
});

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "أدخل كلمة المرور الحالية."),
    newPassword: z.string().min(10, "يجب أن تتكون كلمة المرور من 10 أحرف على الأقل."),
    confirmPassword: z.string().min(1, "أكّد كلمة المرور الجديدة."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين.",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof formSchema>;

function ChangePasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSuccess(false);
    const result = await changePassword({
      data: { currentPassword: values.currentPassword, newPassword: values.newPassword },
    });
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setSuccess(true);
    form.reset();
  }

  return (
    <div>
      <p className="eyebrow">الإعدادات</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        تغيير كلمة المرور
      </h1>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        اختر كلمة مرور قوية وفريدة. ستبقى مسجّلاً للدخول على هذا الجهاز.
      </p>

      <div className="mt-8 max-w-sm rounded-lg border border-border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الحالية</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
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
                  <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
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
            {success && (
              <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-foreground" />
                تم تحديث كلمة المرور.
              </div>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "جارٍ الحفظ…" : "تحديث كلمة المرور"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
