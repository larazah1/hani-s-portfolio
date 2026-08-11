import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  emptyRecommendationForm,
  RecommendationForm,
  type RecommendationFormValues,
} from "@/components/admin/RecommendationForm";
import { createRecommendation } from "@/server-fns/recommendations";

export const Route = createFileRoute("/admin/_authed/recommendations/new")({
  component: NewRecommendationPage,
});

function NewRecommendationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: RecommendationFormValues) => createRecommendation({ data: values }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      void router.navigate({ to: "/admin/recommendations" });
    },
    onError: (e: Error) => setError(e.message || "حدث خطأ ما."),
  });

  return (
    <div>
      <p className="eyebrow">التوصيات</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        إضافة توصية
      </h1>
      <div className="mt-8">
        <RecommendationForm
          initial={emptyRecommendationForm}
          submitLabel="إنشاء"
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
