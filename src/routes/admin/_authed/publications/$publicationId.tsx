import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PublicationForm, type PublicationFormValues } from "@/components/admin/PublicationForm";
import { getPublication, updatePublication } from "@/server-fns/publications";

export const Route = createFileRoute("/admin/_authed/publications/$publicationId")({
  component: EditPublicationPage,
});

function EditPublicationPage() {
  const { publicationId } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["publication", publicationId],
    queryFn: () => getPublication({ data: { id: publicationId } }),
  });

  const mutation = useMutation({
    mutationFn: (values: PublicationFormValues) =>
      updatePublication({
        data: {
          id: publicationId,
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

  if (isLoading) return <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>;
  if (!data) return <p className="text-sm text-muted-foreground">المنشور غير موجود.</p>;

  return (
    <div>
      <p className="eyebrow">المنشورات</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        تعديل المنشور
      </h1>
      <div className="mt-8">
        <PublicationForm
          initial={{
            title: data.title,
            titleAr: data.titleAr,
            authors: data.authors,
            journal: data.journal,
            year: String(data.year),
            type: data.type,
            area: data.area,
            areaAr: data.areaAr ?? "",
            doi: data.doi ?? "",
            url: data.url ?? "",
            summary: data.summary ?? "",
            featured: data.featured,
          }}
          submitLabel="حفظ التغييرات"
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
