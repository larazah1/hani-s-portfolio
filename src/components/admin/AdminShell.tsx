import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  FileText,
  BookMarked,
  Newspaper,
  Quote,
  UserRound,
  Briefcase,
  GraduationCap,
  Sparkles,
  Landmark,
  Activity,
  Heart,
  BarChart3,
  Link2,
  Inbox,
  Settings,
  ShieldCheck,
  KeyRound,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout } from "@/server-fns/auth";
import { getUnreadMessageCount } from "@/server-fns/contact";
import type { CurrentAdmin } from "@/server-fns/current-admin";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  { label: "نظرة عامة", items: [{ to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard }] },
  { label: "هيكل الموقع", items: [{ to: "/admin/pages", label: "الصفحات", icon: FileText }] },
  {
    label: "المحتوى",
    items: [
      { to: "/admin/publications", label: "المنشورات", icon: BookMarked },
      { to: "/admin/media", label: "المقابلات والمقالات", icon: Newspaper },
      { to: "/admin/recommendations", label: "التوصيات", icon: Quote },
    ],
  },
  {
    label: "الملف الشخصي ونبذة عني",
    items: [
      { to: "/admin/profile", label: "الملف الشخصي والصفحة الرئيسية", icon: UserRound },
      { to: "/admin/career", label: "المسيرة المهنية والخبرات", icon: Briefcase },
      { to: "/admin/education", label: "التعليم", icon: GraduationCap },
      { to: "/admin/expertise", label: "مجالات الخبرة", icon: Sparkles },
      { to: "/admin/research-specialties", label: "التخصصات البحثية", icon: Sparkles },
      { to: "/admin/memberships", label: "العضويات واللجان", icon: Landmark },
      { to: "/admin/activities", label: "الأنشطة العلمية", icon: Activity },
      { to: "/admin/interests", label: "الاهتمامات", icon: Heart },
      { to: "/admin/stats", label: "الإحصائيات", icon: BarChart3 },
      { to: "/admin/social-links", label: "روابط التواصل الاجتماعي", icon: Link2 },
    ],
  },
  {
    label: "البريد الوارد",
    items: [{ to: "/admin/messages", label: "رسائل التواصل", icon: Inbox }],
  },
  {
    label: "الإعدادات",
    items: [
      { to: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
      { to: "/admin/admins", label: "المسؤولون", icon: ShieldCheck },
      { to: "/admin/change-password", label: "تغيير كلمة المرور", icon: KeyRound },
    ],
  },
];

export function AdminShell({ admin, children }: { admin: CurrentAdmin; children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: unreadCount } = useQuery({
    queryKey: ["unread-message-count"],
    queryFn: () => getUnreadMessageCount(),
    refetchInterval: 30_000,
  });

  async function handleLogout() {
    await logout();
    await router.invalidate();
    await router.navigate({ to: "/admin/login" });
  }

  return (
    <SidebarProvider>
      <Sidebar side="right">
        <SidebarHeader className="px-3 py-4">
          <p className="font-[family-name:var(--font-display)] text-base font-semibold leading-tight">
            بوابة زهران
          </p>
          <p className="eyebrow">الإدارة</p>
        </SidebarHeader>
        <SidebarContent>
          {NAV_GROUPS.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive =
                      item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.to}>
                            <item.icon />
                            <span>{item.label}</span>
                            {item.to === "/admin/messages" && !!unreadCount && (
                              <Badge className="ms-auto h-5 min-w-5 justify-center px-1">
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="gap-3 px-3 pb-4">
          <div className="truncate text-xs text-sidebar-foreground/70">{admin.email}</div>
          <Button variant="outline" size="sm" className="justify-start" onClick={handleLogout}>
            <LogOut />
            تسجيل الخروج
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <SidebarTrigger />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold">
            إدارة بوابة زهران
          </p>
        </div>
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
