import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MediaForm, type MediaFormValues } from "@/components/admin/MediaForm";
import { getMediaItem, updateMediaItem } from "@/server-fns/media";

export const Route = createFileRoute("/admin/_authed/media/$mediaId")({
  component: EditMediaPage,
});

function EditMediaPage() {
  const { mediaId } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["media-item", mediaId],
    queryFn: () => getMediaItem({ data: { id: mediaId } }),
  });

  const mutation = useMutation({
    mutationFn: (values: MediaFormValues) =>
      updateMediaItem({
        data: {
          id: mediaId,
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
    onError: (e: Error) => setError(e.message || "Something went wrong."),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Item not found.</p>;

  return (
    <div>
      <p className="eyebrow">Interviews & Articles</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        Edit Item
      </h1>
      <div className="mt-8">
        <MediaForm
          initial={{
            title: data.title,
            titleAr: data.titleAr ?? "",
            source: data.source,
            dateLabel: data.dateLabel,
            type: data.type,
            description: data.description ?? "",
            videoUrl: data.videoUrl ?? "",
            articleUrl: data.articleUrl ?? "",
            thumbnail: data.thumbnail ?? "",
            featured: data.featured,
            status: data.status,
          }}
          submitLabel="Save Changes"
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
