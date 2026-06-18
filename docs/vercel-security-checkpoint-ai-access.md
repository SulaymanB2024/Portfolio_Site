# Vercel Security Checkpoint and AI/Search Agent Access

Last updated: 2026-06-17

## Confirmed Vercel behavior

- Vercel Firewall `challenge` responses show an interstitial named "Vercel Security Checkpoint." This can come from custom firewall rules, Bot Protection, or managed WAF rulesets.
- Vercel Bot Protection is designed to challenge non-browser traffic. Verified search crawlers such as Googlebot are handled differently from generic automated fetches.
- Vercel managed rulesets include Bot Protection actions that can log or challenge and AI Bots actions that can log or deny.
- Vercel recommends testing custom firewall rules in `log` mode and observing live traffic before using `challenge`, `deny`, or `bypass`.

Primary docs:

- https://vercel.com/docs/bot-management
- https://vercel.com/docs/vercel-firewall/firewall-concepts
- https://vercel.com/docs/vercel-firewall/vercel-waf/managed-rulesets
- https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules

## Likely issue

Firecrawl/Atlas saw valid pages in one pass and later received 403 responses with the Vercel Security Checkpoint on some public routes. That pattern is consistent with a bot or firewall rule challenging automated fetches after traffic shape, user-agent, IP reputation, or managed rule evaluation changed.

Googlebot may still fetch correctly because verified bots can be excluded from Bot Protection challenges, but that does not guarantee accessibility for AI-search systems, commercial crawlers, preview fetchers, or audit tools.

## Rules to inspect in Vercel

Check the Vercel Firewall event log for affected requests and record:

- route path
- action: `log`, `challenge`, `deny`, or `bypass`
- matched rule or managed ruleset
- user agent
- bot name or bot category when available
- IP / ASN / country if shown
- request method
- response status

Inspect these settings first:

- Bot Protection mode for public HTML routes.
- AI Bots managed ruleset mode.
- Any custom rule that challenges or denies automated traffic.
- Any global challenge rule applied to all `GET` or `HEAD` traffic.
- Rate-limit rules that might be triggered by repeated route checks.

## Recommended policy for this site

Public content routes should remain fetchable by non-login automated agents:

- `/`
- `/about`
- `/resume`
- `/simple`
- `/atlas`
- `/method`
- `/markets`
- `/markets/*`
- `/ai-information`
- `/llms.txt`
- `/robots.txt`
- `/sitemap.xml`

For these routes, prefer `log` or narrow `bypass` rules over `challenge` or `deny` for trusted search/audit traffic. Keep stricter rules for form endpoints, APIs, admin paths, and abuse-prone POST requests.

If Vercel exposes bot categories in the rule builder, use a narrow bypass for trusted search, AI-search, and audit agents on public `GET` and `HEAD` requests only. Do not create a global bypass for all automated traffic.

## Verification loop

1. Put suspected blocking rules in `log` mode for public routes.
2. Re-run Firecrawl/Atlas against the public deployment.
3. Confirm public routes return 200 HTML and canonical metadata without a checkpoint page.
4. Review the Firewall event log for the same run.
5. Re-enable stricter rules only where they do not block public HTML, sitemap, robots, or source pages.
