import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  RecommendationForm,
  type RecommendationFormValues,
} from "@/components/admin/RecommendationForm";
import { getRecommendation, updateRecommendation } from "@/server-fns/recommendations";

export const Route = createFileRoute("/admin/_authed/recommendations/$recommendationId")({
  component: EditRecommendationPage,
});

function EditRecommendationPage() {
  const { recommendationId } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["recommendation", recommendationId],
    queryFn: () => getRecommendation({ data: { id: recommendationId } }),
  });

  const mutation = useMutation({
    mutationFn: (values: RecommendationFormValues) =>
      updateRecommendation({ data: { id: recommendationId, ...values } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      void router.navigate({ to: "/admin/recommendations" });
    },
    onError: (e: Error) => setError(e.message || "حدث خطأ ما."),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>;
  if (!data) return <p className="text-sm text-muted-foreground">غير موجود.</p>;

  return (
    <div>
      <p className="eyebrow">التوصيات</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        تعديل التوصية
      </h1>
      <div className="mt-8">
        <RecommendationForm
          initial={{
            name: data.name,
            position: data.position,
            organization: data.organization,
            body: data.body,
            dateLabel: data.dateLabel ?? "",
            featured: data.featured,
            status: data.status,
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
