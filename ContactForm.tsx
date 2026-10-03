/**
 * Formgong contact form for Lovable, Bolt, v0 and any Vite/React + Tailwind project.
 * No backend, Supabase function, Edge Function or email service needed:
 * the browser posts to Formgong, which emails the site owner (and Telegram/webhooks if connected).
 *
 * 1. Create a form at https://formgong.com and copy its access key (fk_…).
 * 2. Paste it into ACCESS_KEY below. The key is public by design and belongs in frontend code.
 * 3. Render <ContactForm /> where you want the form.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";

const ENDPOINT = "https://formgong.com/submit";
const ACCESS_KEY = "fk_your_access_key";
/** Optional Cloudflare Turnstile site key. Leave empty unless Turnstile is enabled in the form settings. */
const TURNSTILE_SITE_KEY = "";

type State = "idle" | "sending" | "sent" | "error";

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void } }
}

export default function ContactForm({ lang }: { lang?: string }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const captcha = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !captcha.current) return;
    const mount = () => {
      if (window.turnstile && captcha.current && !widget.current) {
        widget.current = window.turnstile.render(captcha.current, { sitekey: TURNSTILE_SITE_KEY, language: lang || document.documentElement.lang || "en" });
      }
    };
    if (window.turnstile) return mount();
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = mount;
    document.head.appendChild(script);
  }, [lang]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const body = new FormData(form);
    body.set("access_key", ACCESS_KEY);
    body.set("_lang", lang || document.documentElement.lang || "en");
    setState("sending");
    setMessage("Sending…");
    try {
      const response = await fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body });
      const result = (await response.json()) as { success: boolean; message?: string };
      setState(result.success ? "sent" : "error");
      setMessage(result.success ? result.message || "Thank you! Your message has been sent." : result.message || "Something went wrong. Please try again.");
      if (result.success) form.reset();
    } catch {
      setState("error");
      setMessage("Network error. Check your connection and try again.");
    } finally {
      if (widget.current) window.turnstile?.reset(widget.current);
    }
  }

  const field = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";
  return (
    <form onSubmit={onSubmit} aria-busy={state === "sending"} className="mx-auto grid w-full max-w-lg gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <label className="grid gap-1.5 text-sm font-medium text-gray-800">
        Name
        <input name="name" autoComplete="name" required className={field} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-gray-800">
        Email
        <input type="email" name="email" autoComplete="email" required className={field} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-gray-800">
        Message
        <textarea name="message" rows={5} required className={field} />
      </label>
      {/* Honeypot: hidden from people, filled by bots. Keep it empty and off-screen. */}
      <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
        <input name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>
      {TURNSTILE_SITE_KEY ? <div ref={captcha} /> : null}
      <button type="submit" disabled={state === "sending"} className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send"}
      </button>
      <p role="status" className={state === "error" ? "text-sm text-red-700" : "text-sm text-green-700"}>{message}</p>
    </form>
  );
}
