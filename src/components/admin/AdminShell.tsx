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
  Languages,
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
  { label: "Overview", items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Site Structure", items: [{ to: "/admin/pages", label: "Pages", icon: FileText }] },
  {
    label: "Content",
    items: [
      { to: "/admin/publications", label: "Publications", icon: BookMarked },
      { to: "/admin/media", label: "Interviews & Articles", icon: Newspaper },
      { to: "/admin/recommendations", label: "Recommendations", icon: Quote },
    ],
  },
  {
    label: "Profile & About",
    items: [
      { to: "/admin/profile", label: "Profile & Hero", icon: UserRound },
      { to: "/admin/career", label: "Career & Experience", icon: Briefcase },
      { to: "/admin/education", label: "Education", icon: GraduationCap },
      { to: "/admin/expertise", label: "Expertise", icon: Sparkles },
      { to: "/admin/research-specialties", label: "Research Specialties", icon: Sparkles },
      { to: "/admin/memberships", label: "Memberships & Committees", icon: Landmark },
      { to: "/admin/activities", label: "Scientific Activities", icon: Activity },
      { to: "/admin/languages", label: "Languages", icon: Languages },
      { to: "/admin/interests", label: "Interests", icon: Heart },
      { to: "/admin/stats", label: "Statistics", icon: BarChart3 },
      { to: "/admin/social-links", label: "Social Links", icon: Link2 },
    ],
  },
  {
    label: "Inbox",
    items: [{ to: "/admin/messages", label: "Contact Messages", icon: Inbox }],
  },
  {
    label: "Settings",
    items: [
      { to: "/admin/settings", label: "Website Settings", icon: Settings },
      { to: "/admin/admins", label: "Admins", icon: ShieldCheck },
      { to: "/admin/change-password", label: "Change Password", icon: KeyRound },
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
      <Sidebar>
        <SidebarHeader className="px-3 py-4">
          <p className="font-[family-name:var(--font-display)] text-base font-semibold leading-tight">
            Zahran Portal
          </p>
          <p className="eyebrow">Admin</p>
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
            Log out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <SidebarTrigger />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold">
            Zahran Portal Admin
          </p>
        </div>
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
