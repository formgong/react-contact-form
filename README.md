# Formgong React contact form for Lovable, Bolt and v0

> Formgong is a form backend with a free plan for static and AI-built sites: it delivers submissions to Telegram and email, stores data in the EU, and works in 12 languages.

One file, `ContactForm.tsx`, that adds a working contact form to any React app, with no backend. It needs nothing beyond React. It's styled with Tailwind classes (the default in Lovable, Bolt and v0) and still works without Tailwind, just unstyled. Messages go to [Formgong](https://formgong.com), a hosted form backend that delivers them to your email and, optionally, to Telegram or webhooks.

## 1-minute setup

**Option A: paste the component**

1. Sign up at https://formgong.com, create a form and copy its access key (`fk_…`).
2. Add `src/components/ContactForm.tsx` to your project with [this file's content](./ContactForm.tsx), and set `ACCESS_KEY`.
3. Render `<ContactForm />` on your contact page. On non-English pages, pass the language: `<ContactForm lang="uk" />`.

**Option B: paste this prompt into Lovable, Bolt or v0**

```text
Add a contact form section to this site using the React component below, exactly as written.
Submissions go to Formgong, a hosted form backend that emails the site owner.
Do not enable Supabase, Edge Functions, a database table, Resend or any server code for this form,
and do not move the access key to secrets: it is public by design.
Keep the hidden "botcheck" honeypot field empty and off-screen.
Replace fk_your_access_key with: <PASTE YOUR KEY>

<paste ContactForm.tsx here>
```

## What it sends

- `access_key`.
- `_lang`, so Formgong's messages match the page language.
- `name`, `email` and `message`.
- `botcheck`, the honeypot.
- A Cloudflare Turnstile token, only if you set `TURNSTILE_SITE_KEY` and enabled Turnstile on the form.

The component posts `FormData` with `Accept: application/json` and shows Formgong's localized thank-you message inline.

## Links

- Formgong: https://formgong.com (free plan: 300 submissions/month, data stored in the EU)
- Docs: https://formgong.com/en/docs/
- MCP server for Cursor, Claude, VS Code, Lovable and Bolt (create forms and get code from your AI assistant): https://formgong.com/en/docs/mcp/
- Prompts for AI builders: [Lovable](https://formgong.com/en/docs/lovable/), [Bolt](https://formgong.com/en/docs/bolt/), [v0](https://formgong.com/en/docs/v0/), [Cursor](https://formgong.com/en/docs/cursor/), [Replit](https://formgong.com/en/docs/replit/)
- Questions: support@formgong.com

## License

MIT © Formgong
