import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  // The admin panel is always English/LTR, regardless of what language a
  // visitor left the public site in — `dir`/`lang` are global <html>
  // attributes, not scoped to a route subtree, so we force them here and
  // restore the public site's actual preference on the way out.
  const { language, dir } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    return () => {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    };
  }, [language, dir]);

  return <Outlet />;
}
