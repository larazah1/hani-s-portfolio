import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertCircle, Copy, ShieldOff, ShieldCheck as ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { inviteAdmin, listAdmins, resetAdminPassword, setAdminStatus } from "@/server-fns/admins";

export const Route = createFileRoute("/admin/_authed/admins")({
  component: AdminsPage,
});

function AdminsPage() {
  const { admin: self } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admins"], queryFn: () => listAdmins() });
  const rows = data ?? [];

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [linkDialog, setLinkDialog] = useState<{ email: string; url: string } | null>(null);
  const [disableTarget, setDisableTarget] = useState<(typeof rows)[number] | null>(null);

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["admins"] });
  }

  function showLink(email: string, setupPath: string) {
    const url = `${window.location.origin}${setupPath}`;
    setLinkDialog({ email, url });
  }

  const inviteMutation = useMutation({
    mutationFn: (email: string) => inviteAdmin({ data: { email } }),
    onSuccess: (result) => {
      if (!result.ok) {
        setInviteError(result.error);
        return;
      }
      setInviteError(null);
      setInviteEmail("");
      invalidate();
      showLink(inviteEmail.toLowerCase(), result.setupPath);
    },
  });

  const statusMutation = useMutation({
    mutationFn: (opts: { adminId: string; status: "active" | "disabled" }) =>
      setAdminStatus({ data: opts }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      invalidate();
      setDisableTarget(null);
    },
  });

  const resetMutation = useMutation({
    mutationFn: (opts: { adminId: string; email: string }) =>
      resetAdminPassword({ data: { adminId: opts.adminId } }),
    onSuccess: (result, opts) => {
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      showLink(opts.email, result.setupPath);
    },
  });

  async function copyLink() {
    if (!linkDialog) return;
    try {
      await navigator.clipboard.writeText(linkDialog.url);
      toast.success("تم نسخ الرابط.");
    } catch {
      toast.error("تعذّر النسخ تلقائيًا — انسخ الرابط يدويًا.");
    }
  }

  return (
    <div>
      <div>
        <p className="eyebrow">الإعدادات</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
          المسؤولون
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          امنح صلاحية الوصول لبريد إلكتروني إضافي. لا يوجد إرسال تلقائي — انسخ رابط الإعداد وأرسله
          إليهم مباشرةً.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-5">
        <p className="text-sm font-medium">دعوة مسؤول جديد</p>
        <form
          className="mt-3 flex flex-wrap items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setInviteError(null);
            inviteMutation.mutate(inviteEmail);
          }}
        >
          <Input
            type="email"
            required
            placeholder="name@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="max-w-xs"
            dir="ltr"
          />
          <Button type="submit" disabled={inviteMutation.isPending}>
            {inviteMutation.isPending ? "جارٍ الإرسال…" : "إرسال الدعوة"}
          </Button>
        </form>
        {inviteError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {inviteError}
          </div>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">جارٍ التحميل…</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const isSelf = row.id === self.id;
              return (
                <li key={row.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium" dir="ltr">
                        {row.email}
                      </p>
                      <Badge
                        variant={
                          row.status === "active"
                            ? "default"
                            : row.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {row.status === "active"
                          ? "نشط"
                          : row.status === "pending"
                            ? "قيد الإعداد"
                            : "معطل"}
                      </Badge>
                      {isSelf && <Badge variant="outline">أنت</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {row.lastLoginAt
                        ? `آخر تسجيل دخول ${new Date(row.lastLoginAt).toLocaleString()}`
                        : "لم يسجّل الدخول بعد"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {row.status !== "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetMutation.mutate({ adminId: row.id, email: row.email })}
                        disabled={resetMutation.isPending}
                      >
                        إعادة تعيين كلمة المرور
                      </Button>
                    )}
                    {row.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetMutation.mutate({ adminId: row.id, email: row.email })}
                        disabled={resetMutation.isPending}
                      >
                        إعادة إرسال رابط الإعداد
                      </Button>
                    )}
                    {row.status === "active" && !isSelf && (
                      <Button variant="outline" size="sm" onClick={() => setDisableTarget(row)}>
                        <ShieldOff className="h-3.5 w-3.5" />
                        تعطيل
                      </Button>
                    )}
                    {row.status === "disabled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => statusMutation.mutate({ adminId: row.id, status: "active" })}
                      >
                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                        تفعيل
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AlertDialog open={!!disableTarget} onOpenChange={(open) => !open && setDisableTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل تريد تعطيل هذا المسؤول؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيفقد {disableTarget?.email} صلاحية الوصول إلى لوحة الإدارة فورًا. يمكنك إعادة تفعيله
              في أي وقت.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                disableTarget &&
                statusMutation.mutate({ adminId: disableTarget.id, status: "disabled" })
              }
            >
              تعطيل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!linkDialog} onOpenChange={(open) => !open && setLinkDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>رابط الإعداد لـ {linkDialog?.email}</AlertDialogTitle>
            <AlertDialogDescription>
              أرسل هذا الرابط إليهم مباشرةً (سلاك، رسالة نصية، شخصيًا). ينتهي بعد 7 أيام ويمكن
              استخدامه مرة واحدة فقط.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Label htmlFor="setup-link" className="sr-only">
              رابط الإعداد
            </Label>
            <Input
              id="setup-link"
              readOnly
              value={linkDialog?.url ?? ""}
              className="text-xs"
              dir="ltr"
            />
            <Button type="button" variant="outline" size="icon" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLinkDialog(null)}>تم</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
