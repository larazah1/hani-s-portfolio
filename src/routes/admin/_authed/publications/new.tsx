import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  emptyPublicationForm,
  PublicationForm,
  type PublicationFormValues,
} from "@/components/admin/PublicationForm";
import { createPublication } from "@/server-fns/publications";

export const Route = createFileRoute("/admin/_authed/publications/new")({
  component: NewPublicationPage,
});

function NewPublicationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: PublicationFormValues) =>
      createPublication({
        data: {
          ...values,
          year: Number(values.year),
          areaAr: values.areaAr || undefined,
          doi: values.doi || undefined,
          url: values.url || undefined,
          summary: values.summary || undefined,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["publications"] });
      void router.navigate({ to: "/admin/publications" });
    },
    onError: (e: Error) => setError(e.message || "حدث خطأ ما."),
  });

  return (
    <div>
      <p className="eyebrow">المنشورات</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        إضافة منشور
      </h1>
      <div className="mt-8">
        <PublicationForm
          initial={emptyPublicationForm}
          submitLabel="إنشاء منشور"
          isSubmitting={mutation.isPending}
          error={error}
          onSubmit={(values) => {
            setError(null);
            mutation.mutate(values);
          }}
        />
      </div>
    </div>
  );
}
