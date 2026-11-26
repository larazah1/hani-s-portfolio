import { Linkedin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { safeHref } from "@/lib/safe-url";

/**
 * Icon-only contact links: LinkedIn (from the social links), email (mailto:)
 * and phone (tel:). "dark" is for navy backgrounds (hero, footer), "light" for
 * the page background.
 */
export function ContactIcons({
  email,
  phone,
  socialLinks = [],
  tone = "light",
  className = "",
}: {
  email?: string | null;
  phone?: string | null;
  socialLinks?: { label: string; url: string }[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const { t } = useLanguage();
  const linkedin = socialLinks.find(
    (s) => /linkedin/i.test(s.label) || /linkedin\.com/i.test(s.url),
  );

  const links = [
    linkedin && { href: linkedin.url, label: "LinkedIn", Icon: Linkedin, external: true },
    email && { href: `mailto:${email}`, label: `${t("email")}: ${email}`, Icon: Mail },
    phone && {
      href: `tel:${phone.replace(/\s+/g, "")}`,
      label: `${t("phone")}: ${phone}`,
      Icon: Phone,
    },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Mail; external?: boolean }[];

  if (links.length === 0) return null;

  const style =
    tone === "dark"
      ? "border-white/25 text-white hover:bg-white hover:text-surface-deep"
      : "border-border bg-card text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground";

  return (
    <ul className={`flex gap-3 ${className}`}>
      {links.map(({ href, label, Icon, external }) => (
        <li key={href}>
          <a
            href={safeHref(href)}
            aria-label={label}
            title={label}
            {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${style}`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
