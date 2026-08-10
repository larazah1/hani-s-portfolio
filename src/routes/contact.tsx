import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Mail, Phone } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profile, socialLinks } from "@/content/site";
import { useLanguage } from "@/lib/language";

const title = "Contact — Dr. Hani Mahmoud Zahran";
const description =
  "Get in touch with Dr. Hani Mahmoud Zahran for research collaboration, advisory work or speaking engagements.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  subject: z.string().trim().min(3, "Please enter a subject."),
  message: z.string().trim().min(10, "Message should be at least 10 characters."),
});
type ContactValues = z.infer<typeof contactSchema>;

function ContactPage() {
  const { t, pick } = useLanguage();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactValues) {
    setStatus("idle");
    try {
      // Messages will be stored in the admin inbox once the backend is enabled.
      await new Promise<void>((resolve) => setTimeout(resolve, 600));
      void values;
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <p className="eyebrow">{t("contact")}</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">{t("letsConnect")}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("contactIntro")}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fullName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("fullNamePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subject")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("subjectPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("message")}</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder={t("messagePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
                {form.formState.isSubmitting ? t("sending") : t("sendMessage")}
              </Button>

              {status === "success" && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 py-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-foreground" />
                  {t("sendSuccess")}
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t("sendError")}
                </div>
              )}
            </form>
          </Form>

          <aside className="space-y-4 text-sm">
            <div>
              <p className="eyebrow">{t("email")}</p>
              <a
                href={`mailto:${profile.email}`}
                dir="ltr"
                className="mt-1 flex items-center gap-2 hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {profile.email}
              </a>
            </div>
            <div>
              <p className="eyebrow">{t("phone")}</p>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                dir="ltr"
                className="mt-1 flex items-center gap-2 hover:underline"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {profile.phone}
              </a>
            </div>
            {profile.location && (
              <div>
                <p className="eyebrow">{t("location")}</p>
                <p className="mt-1">{pick(profile.location, profile.locationAr)}</p>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div>
                <p className="eyebrow">{t("profiles")}</p>
                <ul className="mt-1 space-y-1">
                  {socialLinks.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline underline-offset-4"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
