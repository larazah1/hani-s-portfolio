import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { deleteContactMessage, listContactMessages, setMessageStatus } from "@/server-fns/contact";

export const Route = createFileRoute("/admin/_authed/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: () => listContactMessages(),
  });
  const rows = data ?? [];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<(typeof rows)[number] | null>(null);

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    void queryClient.invalidateQueries({ queryKey: ["unread-message-count"] });
  }

  const statusMutation = useMutation({
    mutationFn: (opts: { id: string; status: "read" | "unread" }) =>
      setMessageStatus({ data: opts }),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContactMessage({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
    },
  });

  function toggleExpand(row: (typeof rows)[number]) {
    const opening = expandedId !== row.id;
    setExpandedId(opening ? row.id : null);
    if (opening && row.status === "unread") {
      statusMutation.mutate({ id: row.id, status: "read" });
    }
  }

  return (
    <div>
      <div>
        <p className="eyebrow">البريد الوارد</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
          رسائل التواصل
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          الرسائل المرسلة عبر نموذج التواصل في الموقع العام.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">جارٍ التحميل…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">لا توجد رسائل بعد.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const isExpanded = expandedId === row.id;
              const isUnread = row.status === "unread";
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(row)}
                    className="flex w-full items-start gap-3 px-5 py-4 text-start hover:bg-secondary/40"
                  >
                    {isUnread ? (
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                    ) : (
                      <MailOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={isUnread ? "font-semibold" : "font-medium"}>{row.subject}</p>
                        {isUnread && <Badge>جديدة</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {row.name} <span dir="ltr">&lt;{row.email}&gt;</span> &middot;{" "}
                        {new Date(row.createdAt).toLocaleString()}
                      </p>
                      {!isExpanded && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {row.message}
                        </p>
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-4 ps-12">
                      <p className="whitespace-pre-wrap rounded-md border border-border bg-secondary/30 p-4 text-sm">
                        {row.message}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${row.email}`}>الرد عبر البريد الإلكتروني</a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            statusMutation.mutate({
                              id: row.id,
                              status: isUnread ? "read" : "unread",
                            })
                          }
                        >
                          {isUnread ? "تعليم كمقروءة" : "تعليم كغير مقروءة"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteTarget(row)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل تريد حذف هذه الرسالة؟</AlertDialogTitle>
            <AlertDialogDescription>
              من {deleteTarget?.name} — لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
