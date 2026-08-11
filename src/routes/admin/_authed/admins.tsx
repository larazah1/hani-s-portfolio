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
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy automatically — select and copy the link manually.");
    }
  }

  return (
    <div>
      <div>
        <p className="eyebrow">Settings</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Admins
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant access to more emails. There&rsquo;s no automated email — copy the setup link and
          send it to them directly.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-5">
        <p className="text-sm font-medium">Invite a new admin</p>
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
          />
          <Button type="submit" disabled={inviteMutation.isPending}>
            {inviteMutation.isPending ? "Sending…" : "Send Invite"}
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
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const isSelf = row.id === self.id;
              return (
                <li key={row.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{row.email}</p>
                      <Badge
                        variant={
                          row.status === "active"
                            ? "default"
                            : row.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {row.status}
                      </Badge>
                      {isSelf && <Badge variant="outline">You</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {row.lastLoginAt
                        ? `Last signed in ${new Date(row.lastLoginAt).toLocaleString()}`
                        : "Never signed in"}
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
                        Reset password
                      </Button>
                    )}
                    {row.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetMutation.mutate({ adminId: row.id, email: row.email })}
                        disabled={resetMutation.isPending}
                      >
                        Resend setup link
                      </Button>
                    )}
                    {row.status === "active" && !isSelf && (
                      <Button variant="outline" size="sm" onClick={() => setDisableTarget(row)}>
                        <ShieldOff className="h-3.5 w-3.5" />
                        Disable
                      </Button>
                    )}
                    {row.status === "disabled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => statusMutation.mutate({ adminId: row.id, status: "active" })}
                      >
                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                        Enable
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
            <AlertDialogTitle>Disable this admin?</AlertDialogTitle>
            <AlertDialogDescription>
              {disableTarget?.email} will immediately lose access to the admin panel. You can
              re-enable them at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                disableTarget &&
                statusMutation.mutate({ adminId: disableTarget.id, status: "disabled" })
              }
            >
              Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!linkDialog} onOpenChange={(open) => !open && setLinkDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setup link for {linkDialog?.email}</AlertDialogTitle>
            <AlertDialogDescription>
              Send this link to them directly (Slack, text, in person). It expires in 7 days and can
              only be used once.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Label htmlFor="setup-link" className="sr-only">
              Setup link
            </Label>
            <Input id="setup-link" readOnly value={linkDialog?.url ?? ""} className="text-xs" />
            <Button type="button" variant="outline" size="icon" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLinkDialog(null)}>Done</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
