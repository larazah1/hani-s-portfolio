import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { emptyMediaForm, MediaForm, type MediaFormValues } from "@/components/admin/MediaForm";
import { createMediaItem } from "@/server-fns/media";

export const Route = createFileRoute("/admin/_authed/media/new")({
  component: NewMediaPage,
});

function NewMediaPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: MediaFormValues) =>
      createMediaItem({
        data: {
          ...values,
          titleAr: values.titleAr || undefined,
          description: values.description || undefined,
          videoUrl: values.videoUrl || undefined,
          articleUrl: values.articleUrl || undefined,
          thumbnail: values.thumbnail || undefined,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["media"] });
      void router.navigate({ to: "/admin/media" });
    },
    onError: (e: Error) => setError(e.message || "حدث خطأ ما."),
  });

  return (
    <div>
      <p className="eyebrow">المقابلات والمقالات</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        إضافة مقابلة / مقال
      </h1>
      <div className="mt-8">
        <MediaForm
          initial={emptyMediaForm}
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
