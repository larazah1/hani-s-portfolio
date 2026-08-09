import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { profile, socialLinks } from "@/content/site";

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

const field =
  "w-full rounded-sm border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-accent";

function ContactPage() {
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // Messages will be stored in the admin inbox once the backend is enabled.
    setTimeout(() => {
      setSending(false);
      toast.success("Thank you — your message has been recorded.");
      (e.target as HTMLFormElement).reset();
    }, 500);
  }

  return (
    <Section eyebrow="Contact" title="Get in touch">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Your name" className={field} />
            <input name="email" type="email" required placeholder="Email address" className={field} />
          </div>
          <input name="subject" required placeholder="Subject" className={field} />
          <textarea name="message" required rows={6} placeholder="Message" className={field} />
          <button
            type="submit"
            disabled={sending}
            className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>

        <aside className="space-y-4 text-sm">
          {profile.email && (
            <div>
              <p className="eyebrow">Email</p>
              <p className="mt-1">{profile.email}</p>
            </div>
          )}
          {profile.phone && (
            <div>
              <p className="eyebrow">Phone</p>
              <p className="mt-1">{profile.phone}</p>
            </div>
          )}
          {profile.location && (
            <div>
              <p className="eyebrow">Location</p>
              <p className="mt-1">{profile.location}</p>
            </div>
          )}
          {socialLinks.length > 0 && (
            <div>
              <p className="eyebrow">Profiles</p>
              <ul className="mt-1 space-y-1">
                {socialLinks.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-4">
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
  );
}