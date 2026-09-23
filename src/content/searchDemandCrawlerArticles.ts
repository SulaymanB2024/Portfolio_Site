import type { ResearchArticle } from './articleModels';

const DATE = '2026.09.23';
const CRAWLER_POLICY = '/research/ai-crawlers/ai-search-crawler-policy';
const ROBOTS_BOUNDARY = '/research/ai-crawlers/robots-txt-courtesy-not-access-control';

const openAiBots = {
  label: 'OpenAI — Overview of OpenAI Crawlers',
  href: 'https://developers.openai.com/api/docs/bots',
  lastVerified: DATE,
};
const openAiSearch = {
  label: 'OpenAI — ChatGPT Search publisher guidance',
  href: 'https://help.openai.com/en/articles/9237897-chatgpt-search',
  lastVerified: DATE,
};
const anthropicBots = {
  label: 'Anthropic — ClaudeBot, Claude-User, and Claude-SearchBot guidance',
  href: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  lastVerified: DATE,
};
const perplexityBots = {
  label: 'Perplexity — crawler and user-agent documentation',
  href: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers',
  lastVerified: DATE,
};
const googleCommon = {
  label: 'Google — common crawlers and Google-Extended',
  href: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  lastVerified: DATE,
};
const googleVerify = {
  label: 'Google — verify crawler and fetcher requests',
  href: 'https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests',
  lastVerified: DATE,
};
const googleAiSearch = {
  label: 'Google Search Central — AI features and publisher controls',
  href: 'https://developers.google.com/search/docs/appearance/ai-features',
  lastVerified: DATE,
};

const commonResources = [
  {
    label: 'AI crawler robots.txt policy guide',
    href: CRAWLER_POLICY,
    description: 'Copy-ready policy patterns for separating search discovery, training crawlers, and user-triggered fetchers.',
    format: 'WEB',
  },
  {
    label: 'robots.txt access-control boundary',
    href: ROBOTS_BOUNDARY,
    description: 'Why crawler policy is not authentication or authorization, with RFC 9309 context.',
    format: 'WEB',
  },
];

export const CRAWLER_SEARCH_DEMAND_ARTICLES: ResearchArticle[] = [
  {
    kind: 'research',
    cluster: 'ai-crawlers',
    slug: 'openai-crawlers-oai-searchbot-gptbot-chatgpt-user-adsbot',
    number: '39',
    category: 'AI CRAWLERS',
    title: 'OAI-SearchBot vs GPTBot vs ChatGPT-User vs OAI-AdsBot',
    seoTitle: 'OAI-SearchBot vs GPTBot vs ChatGPT-User vs OAI-AdsBot',
    subtitle: 'OpenAI now exposes four distinct web-access identities for search, model development, user-triggered fetches, and ad landing-page validation.',
    seoDescription: 'Compare OAI-SearchBot, GPTBot, ChatGPT-User and OAI-AdsBot: what each does, whether robots.txt applies, and which published IP ranges to verify.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'OpenAI crawler / product purpose / control',
      note: 'The same company exposes separate web-access identities because search eligibility, training policy, user fetches, and ads review are different decisions.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '8 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Treat each OpenAI web-access identity as a separate policy surface: OAI-SearchBot controls ChatGPT Search eligibility, GPTBot expresses model-training preference, ChatGPT-User is user-triggered, and OAI-AdsBot validates submitted ad landing pages.',
    conclusion: {
      title: 'Do not write one “OpenAI bot” rule',
      content: 'Choose the product outcome first, then target the documented token. A publisher can allow OAI-SearchBot while disallowing GPTBot; ChatGPT-User and OAI-AdsBot have different triggering and policy semantics. Verify important traffic with OpenAI’s published network ranges rather than trusting the User-Agent header alone.',
    },
    evidenceBoundary: 'OpenAI can change crawler names, versions, IP ranges, and product behavior. This page reflects official documentation checked September 23, 2026. robots.txt expresses crawler policy; it does not authenticate a request or secure private content.',
    metrics: [
      { label: 'OpenAI identities compared', value: '4' },
      { label: 'Search crawler', value: 'OAI-SEARCHBOT' },
      { label: 'Training crawler', value: 'GPTBOT' },
      { label: 'Ads validator', value: 'OAI-ADSBOT' },
    ],
    resources: commonResources,
    content: [
      'OpenAI’s crawler names now map to four materially different jobs. OAI-SearchBot is the automatic crawler used to make pages eligible for ChatGPT Search. GPTBot is the crawler associated with content that may be used to improve and train generative foundation models. ChatGPT-User is a user-triggered fetcher used when a ChatGPT or Custom GPT action visits a page. OAI-AdsBot checks landing pages submitted for ChatGPT ads.',
      'The distinction matters because a single robots.txt decision can produce the wrong product outcome. OpenAI explicitly documents that OAI-SearchBot and GPTBot settings are independent: a site can allow search discovery while disallowing the training crawler.',
    ],
    sections: [
      {
        id: 'searchbot',
        title: 'OAI-SearchBot controls automatic ChatGPT Search crawling',
        paragraphs: [
          'OpenAI says OAI-SearchBot is used to surface websites in ChatGPT Search. Sites that opt out are not shown in search answers, though OpenAI notes they can still appear as navigational links. OpenAI recommends allowing both the crawler token and traffic from its published searchbot IP ranges.',
          'OpenAI also notes that crawler-policy changes can take roughly 24 hours to propagate. That makes production verification a two-step process: fetch the deployed robots.txt immediately, then observe server logs after the policy has had time to be consumed.',
        ],
      },
      {
        id: 'gptbot',
        title: 'GPTBot is the model-development crawler',
        paragraphs: [
          'GPTBot is documented separately from search. OpenAI says content collected by GPTBot may be used to make generative AI foundation models more useful and safe; disallowing GPTBot indicates that the site’s content should not be used for that training purpose.',
          'Blocking GPTBot is therefore not the same as opting out of ChatGPT Search. Conflating the two can remove a site from a discovery channel when the publisher only intended to express a training preference.',
        ],
      },
      {
        id: 'user-and-ads',
        title: 'ChatGPT-User and OAI-AdsBot are triggered by different events',
        paragraphs: [
          'ChatGPT-User supports particular user actions. OpenAI describes it as non-automatic crawling and says robots.txt rules may not apply because the fetch is initiated by a user. It is not the control for Search eligibility.',
          'OAI-AdsBot visits pages submitted as ads to validate safety and relevance. OpenAI states that the landing-page data collected by OAI-AdsBot is not used to train its generative foundation models. An advertiser that blocks the ads validator can create an ads-review problem without changing its GPTBot policy.',
        ],
      },
      {
        id: 'policy-matrix',
        title: 'A usable policy matrix',
        paragraphs: [
          'Want ChatGPT Search visibility but no GPTBot training crawl? Allow OAI-SearchBot and disallow GPTBot. Want neither? Block both automatic crawler tokens. Need submitted ads reviewed? Keep OAI-AdsBot reachable. Want to reason about user-triggered fetches? Treat ChatGPT-User separately from the automatic-crawler policy.',
          'At the firewall or CDN layer, pair the claimed User-Agent with current provider-published IP ranges. A header string is trivial to spoof.',
        ],
      },
    ],
    sources: [openAiBots, openAiSearch],
  },
  {
    kind: 'research',
    cluster: 'crawler-engineering',
    slug: 'verify-ai-crawlers-server-logs',
    number: '40',
    category: 'CRAWLER ENGINEERING',
    title: 'How to Verify an AI Crawler in Server Logs',
    seoTitle: 'How to Verify AI Crawlers in Server Logs: UA + IP Checks',
    subtitle: 'A User-Agent match is a lead, not proof. Verification should join request logs to provider-published IP ranges, response codes, robots policy, and time-bounded network data.',
    seoDescription: 'Verify GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and other AI crawlers in logs using User-Agent parsing, IP-range checks, status codes and request evidence.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Server log / User-Agent / IP range',
      note: 'Identity is an evidence chain: claimed token, source network, request path, response code, and the provider’s current published ranges.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '10 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Crawler attribution should be probabilistic until network evidence confirms it: parse the claimed User-Agent, validate the source IP against the provider’s current ranges or verification method, then preserve the HTTP response and robots state.',
    conclusion: {
      title: 'Log evidence should survive a spoofed User-Agent',
      content: 'A trustworthy crawler observation names the token, source IP, provider-verification result, URL, timestamp, HTTP status, robots policy in force, and whether a CDN or proxy altered the apparent client address. Anything less is traffic labeling, not identity verification.',
    },
    evidenceBoundary: 'Provider IP ranges can change, proxies can mask client addresses, and some user-triggered fetchers have different robots behavior from automatic crawlers. Network-range matching supports attribution but does not identify the individual end user or prove how fetched content was later used.',
    metrics: [
      { label: 'Minimum identity signals', value: 'UA + NETWORK' },
      { label: 'Operational signals', value: 'PATH + STATUS + TIME' },
      { label: 'Common spoof risk', value: 'USER-AGENT ONLY' },
      { label: 'Evidence date', value: DATE },
    ],
    resources: commonResources,
    content: [
      'Searching access logs for “GPTBot” or “ClaudeBot” is useful, but it is not verification. Any client can send a copied User-Agent string. For crawler analytics, allowlisting, abuse controls, or a public study, the log record should be joined to provider-published network evidence and the actual HTTP response.',
      'The practical data model is small: timestamp, host, path, query string if retained, claimed User-Agent, source IP after trusted-proxy normalization, HTTP status, bytes, edge/WAF action, and a verification field such as verified-range, failed-range, unknown-range, or user-triggered class.',
    ],
    sections: [
      {
        id: 'normalize-the-log',
        title: 'First recover the real client IP',
        paragraphs: [
          'On a site behind Cloudflare, Fastly, a load balancer, or another reverse proxy, the socket peer may be the proxy rather than the crawler. Use the platform’s trusted client-IP field or forwarding header only after configuring a trusted proxy chain; accepting arbitrary X-Forwarded-For headers from the public internet creates another spoofing path.',
          'Preserve the original request metadata long enough to audit a classification error. A derived daily count without the underlying IP, path, and status code is hard to reproduce.',
        ],
      },
      {
        id: 'match-provider-ranges',
        title: 'Match the source address to current provider ranges',
        paragraphs: [
          'OpenAI publishes separate JSON IP ranges for OAI-SearchBot, GPTBot, ChatGPT-User, and OAI-AdsBot. Perplexity publishes ranges for PerplexityBot and Perplexity-User. Anthropic publishes bot network information from its crawler guidance. Fetch the current provider file on a schedule instead of hard-coding a list indefinitely.',
          'For Google, the official method supports matching published IP lists or performing reverse-DNS and forward-DNS verification. That is a useful model for any crawler study: provider network evidence should be stronger than the string in the header.',
        ],
      },
      {
        id: 'join-policy-and-response',
        title: 'A verified bot can still be blocked',
        paragraphs: [
          'Identity and access are separate fields. Once a request is attributed, record whether robots.txt allowed the automatic crawler and whether the edge actually returned 200, 301, 403, 429, 5xx, or another response. A nominally allowed bot that receives 403 from the WAF is not successfully crawling the page.',
          'Rate limiting often appears as a traffic-shape problem rather than an explicit robots problem. OpenAI’s advertiser guidance specifically points site owners toward 429 responses, firewall logs, bot-mitigation events, and throttling rules when crawler access fails.',
        ],
      },
      {
        id: 'classification-output',
        title: 'Store observations, not just totals',
        paragraphs: [
          'A useful record might read: OAI-SearchBot claimed; source IP matched the current OpenAI SearchBot ranges; GET /research/...; 200 response; robots allowed; first seen 14:04:12Z; verification file fetched at 13:00Z. That statement can be audited later.',
          'Do not infer indexing, citation, model training, or a human user from a successful fetch. The server proves that bytes were requested and served. Product behavior is a separate measurement problem.',
        ],
      },
    ],
    sources: [openAiBots, anthropicBots, perplexityBots, googleVerify],
  },
  {
    kind: 'research',
    cluster: 'ai-crawlers',
    slug: 'claude-crawlers-claudebot-searchbot-user',
    number: '41',
    category: 'AI CRAWLERS',
    title: 'ClaudeBot vs Claude-SearchBot vs Claude-User',
    seoTitle: 'ClaudeBot vs Claude-SearchBot vs Claude-User: What Each Does',
    subtitle: 'Anthropic separates model-development crawling, web-search crawling, and user-directed retrieval into three robots with different purposes.',
    seoDescription: 'Compare ClaudeBot, Claude-SearchBot and Claude-User: training, search, user retrieval, robots.txt controls, crawl-delay support and verification.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Anthropic crawler / search / user fetch',
      note: 'The three Claude identities answer different publisher questions, so a blanket Claude rule discards useful control.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '7 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Anthropic’s crawler taxonomy separates training-oriented collection, search indexing, and user-requested retrieval, allowing a publisher to express distinct policies instead of one all-or-nothing Claude decision.',
    conclusion: {
      title: 'Target the Claude identity that matches the outcome',
      content: 'ClaudeBot is the model-development crawler, Claude-SearchBot supports search, and Claude-User supports user-directed retrieval. Site owners should maintain separate robots groups when they want separate outcomes and verify important traffic against Anthropic’s current published network information.',
    },
    evidenceBoundary: 'Anthropic’s guidance and network ranges can change. robots.txt is a crawler-policy layer, not authentication. This page reports official documentation as checked September 23, 2026 and does not infer training or citation from a server request.',
    metrics: [
      { label: 'Anthropic crawler identities', value: '3' },
      { label: 'Training', value: 'CLAUDEBOT' },
      { label: 'Search', value: 'CLAUDE-SEARCHBOT' },
      { label: 'User retrieval', value: 'CLAUDE-USER' },
    ],
    resources: commonResources,
    content: [
      'Anthropic documents three web robots because “Claude accessed my site” can mean three different things. ClaudeBot collects public web content that may contribute to model development. Claude-SearchBot supports web search. Claude-User fetches content when a person asks Claude to visit or use a page.',
      'The separation is operationally useful. A publisher that is comfortable appearing in Claude search results but does not want future automatic model-development crawling can write different groups instead of blocking every Claude-branded request.',
    ],
    sections: [
      {
        id: 'claudebot',
        title: 'ClaudeBot: model-development crawling',
        paragraphs: [
          'Anthropic says ClaudeBot helps improve the utility and safety of its generative models by collecting web content that could potentially contribute to training. Restricting ClaudeBot signals that future material from the site should be excluded from Anthropic’s model-training datasets.',
          'That policy should not be described as a cryptographic guarantee about every historical copy of content. It is a documented crawler-control signal for future collection behavior.',
        ],
      },
      {
        id: 'searchbot',
        title: 'Claude-SearchBot: web-search discovery',
        paragraphs: [
          'Claude-SearchBot is the search-oriented identity. It exists so publishers can treat Claude’s search feature differently from model-development crawling.',
          'As with other search crawlers, a robots allow rule can still be defeated by a WAF, rate limiter, CDN challenge, or network block. Production access has to be checked in server or edge logs.',
        ],
      },
      {
        id: 'claude-user',
        title: 'Claude-User: retrieval at a user’s direction',
        paragraphs: [
          'Claude-User supports fetches initiated by people using Claude. This class is closer to a user-agent proxy than a conventional discovery crawler, so its traffic pattern and policy meaning differ from ClaudeBot.',
          'Anthropic’s 2026 guidance also says its bots respect robots directives and supports the non-standard Crawl-delay extension. That implementation detail should be verified against current docs before relying on it as a permanent standard.',
        ],
      },
      {
        id: 'verification',
        title: 'How to classify Anthropic traffic in logs',
        paragraphs: [
          'Store the exact claimed token, source IP, status code, and timestamp. Then compare the source address with Anthropic’s current bot/network information. Treat an unmatched “ClaudeBot” header as unverified rather than silently counting it as Anthropic.',
          'Finally, keep the result scoped to access. A 200 response from a verified crawler demonstrates a successful fetch, not whether the page entered a model dataset or appeared in a Claude answer.',
        ],
      },
    ],
    sources: [anthropicBots],
  },
  {
    kind: 'research',
    cluster: 'ai-crawlers',
    slug: 'perplexitybot-vs-perplexity-user',
    number: '42',
    category: 'AI CRAWLERS',
    title: 'PerplexityBot vs Perplexity-User',
    seoTitle: 'PerplexityBot vs Perplexity-User: Search Crawl vs User Fetch',
    subtitle: 'PerplexityBot is the automatic search crawler; Perplexity-User retrieves pages in response to user requests. Perplexity publishes separate IP ranges for both.',
    seoDescription: 'PerplexityBot vs Perplexity-User: learn which bot supports search indexing, which fetches on user request, how robots.txt differs, and how to verify both.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'PerplexityBot / Perplexity-User / verification',
      note: 'Automatic search crawling and user-triggered page retrieval use separate identities and published network ranges.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '7 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Perplexity separates automatic search discovery from user-requested retrieval: PerplexityBot is the search crawler, while Perplexity-User is a user-triggered fetcher that generally ignores robots.txt.',
    conclusion: {
      title: 'Perplexity exposes two different access paths',
      content: 'Use PerplexityBot when reasoning about automatic Search visibility and Perplexity-User when reasoning about user-triggered retrieval. Verify either identity with the published IP endpoints plus the User-Agent instead of trusting the header alone.',
    },
    evidenceBoundary: 'Perplexity states that crawler-policy changes can take time and that current IP lists should be treated as the source of truth. This article reflects documentation checked September 23, 2026. A fetch does not prove ranking, citation, or training use.',
    metrics: [
      { label: 'Automatic search crawler', value: 'PERPLEXITYBOT' },
      { label: 'User-triggered fetcher', value: 'PERPLEXITY-USER' },
      { label: 'Training use of PerplexityBot', value: 'NO, PER DOCS' },
      { label: 'Published IP lists', value: '2' },
    ],
    resources: commonResources,
    content: [
      'Perplexity documents two web-access identities. PerplexityBot automatically gathers and indexes information so websites can surface and be linked in Perplexity search results. Perplexity-User fetches pages in response to a person’s question.',
      'Perplexity explicitly says PerplexityBot is not used to crawl content for AI foundation models. It also says Perplexity-User is not used for web crawling or foundation-model training. Those statements make the pair different from a search-versus-training split such as OAI-SearchBot versus GPTBot.',
    ],
    sections: [
      {
        id: 'perplexitybot',
        title: 'PerplexityBot is the search-discovery crawler',
        paragraphs: [
          'Perplexity recommends allowing PerplexityBot in robots.txt and allowing its published IP ranges if a publisher wants the site to appear in Perplexity search results. The crawler has its own full User-Agent string and current JSON IP source.',
          'Blocking the token expresses an automatic crawling preference. A separate WAF block can still prevent access even when robots.txt permits it.',
        ],
      },
      {
        id: 'perplexity-user',
        title: 'Perplexity-User is a user-triggered fetcher',
        paragraphs: [
          'Perplexity says Perplexity-User supports actions initiated by users and may visit a page to answer a question and include a link in the response. Because a user requested the fetch, the documentation says this fetcher generally ignores robots.txt.',
          'That makes it operationally different from the automatic search crawler. A site that needs strict access control cannot rely on robots.txt to protect private paths from user-triggered fetch mechanisms; authentication belongs at the application or edge layer.',
        ],
      },
      {
        id: 'waf',
        title: 'Perplexity recommends User-Agent plus IP checks at the WAF',
        paragraphs: [
          'The current documentation gives explicit WAF guidance: combine User-Agent conditions with source IPs from Perplexity’s official JSON endpoints. It advises fetching those current ranges rather than assuming a static list.',
          'This is also a sound analytics rule. If a request claims PerplexityBot but comes from an unrelated network, classify it as spoofed or unverified instead of contaminating crawler counts.',
        ],
      },
      {
        id: 'publisher-policy',
        title: 'The publisher decision is search visibility versus user retrieval',
        paragraphs: [
          'For automatic Perplexity discovery, the relevant token is PerplexityBot. For a user asking Perplexity to retrieve a page, the relevant identity is Perplexity-User. The two requests may hit the same URL but represent different product flows.',
          'Keep the access evidence separate from answer-system performance. Server logs can establish a request and response; they cannot establish why an answer cited or did not cite the page.',
        ],
      },
    ],
    sources: [perplexityBots],
  },
  {
    kind: 'research',
    cluster: 'ai-crawlers',
    slug: 'google-extended-search-gemini-ai-overviews',
    number: '43',
    category: 'AI CRAWLERS',
    title: 'Does Google-Extended Affect Google Search, Gemini, or AI Overviews?',
    seoTitle: 'Google-Extended: Gemini Control, Not Google Search or AI Overviews',
    subtitle: 'Google-Extended is a robots.txt product token for certain Gemini training and grounding uses. Google says it does not affect Search inclusion or Search ranking.',
    seoDescription: 'What does Google-Extended block? It controls certain Gemini training and grounding uses, not Google Search inclusion or ranking. Learn how AI Overviews differ.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Googlebot / Google-Extended / Gemini',
      note: 'Google-Extended is a policy token, not a separate crawler User-Agent and not the control for ordinary Google Search visibility.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '8 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Google-Extended should not be used as a Search opt-out: Google documents it as a standalone product token for certain Gemini training and grounding uses, while Googlebot and normal Search preview controls govern Google Search and its AI features.',
    conclusion: {
      title: 'Google-Extended and Google Search are separate controls',
      content: 'Blocking Google-Extended does not remove a site from Google Search or act as a Search ranking signal according to Google. AI Overviews and AI Mode are Search features governed through normal Google Search crawl, index, and preview controls rather than a separate Google-Extended crawler.',
    },
    evidenceBoundary: 'Google changes product documentation over time. This note reports the documented scope of Google-Extended and Search AI controls as checked September 23, 2026. It does not claim that robots.txt can stop content already indexed from every downstream product use.',
    metrics: [
      { label: 'Separate HTTP UA', value: 'NO' },
      { label: 'Affects Search inclusion', value: 'NO, PER GOOGLE' },
      { label: 'Search ranking signal', value: 'NO, PER GOOGLE' },
      { label: 'Gemini uses', value: 'TRAINING + GROUNDING CONTROLS' },
    ],
    resources: commonResources,
    content: [
      'Google-Extended is easy to misread because its name looks like a crawler. Google says it has no separate HTTP User-Agent string. It is a robots.txt product token that tells Google whether content it crawls may be used for certain Gemini model training and grounding uses.',
      'Google also says Google-Extended does not affect whether a site is included in Google Search and is not used as a Search ranking signal. That means it is not the right control for removing a site from Google results, AI Overviews, or AI Mode.',
    ],
    sections: [
      {
        id: 'what-it-controls',
        title: 'What Google-Extended controls',
        paragraphs: [
          'Google documents Google-Extended as a publisher control for whether crawled site content can be used to train future generations of Gemini models powering Gemini Apps and the Vertex AI API for Gemini, and for specified grounding uses involving the Google Search index.',
          'Because the token has no independent HTTP User-Agent, you should not expect a distinct “Google-Extended” request line in access logs. The control is read from robots.txt and applied within Google’s product systems.',
        ],
      },
      {
        id: 'what-it-does-not-control',
        title: 'What it does not control',
        paragraphs: [
          'Google explicitly says Google-Extended does not affect inclusion in Google Search and is not a Search ranking signal. Blocking it should therefore not be described as blocking Googlebot or opting out of organic Search.',
          'If the goal is to prevent Google from crawling or indexing a page, use the normal Search mechanisms appropriate to that goal, such as robots.txt for crawl control, noindex for indexing control, or authentication for private content.',
        ],
      },
      {
        id: 'ai-overviews',
        title: 'AI Overviews and AI Mode are Google Search features',
        paragraphs: [
          'Google’s Search documentation treats AI Overviews and AI Mode as Search features. Pages must be eligible for normal Google Search crawling and indexing to participate, and Search preview controls such as nosnippet can affect what Google displays.',
          'So the important distinction is product boundary: Google-Extended is a Gemini-related publisher token; Googlebot and Search controls determine Search participation, including Search’s AI presentation layers.',
        ],
      },
      {
        id: 'logs',
        title: 'Why log analysis cannot find a Google-Extended bot',
        paragraphs: [
          'There is no separate Google-Extended request User-Agent to count. Access logs will show the Google crawler/fetcher that actually made a request, not the product token Google later applies to downstream uses.',
          'For Google crawler identity, Google publishes IP-based and DNS verification methods. Apply those to the actual request identity, then evaluate Google-Extended as a robots policy state rather than a network identity.',
        ],
      },
    ],
    sources: [googleCommon, googleAiSearch, googleVerify],
  },
  {
    kind: 'research',
    cluster: 'ai-crawlers',
    slug: 'ai-crawler-registry',
    number: '44',
    category: 'AI CRAWLERS',
    title: 'AI Crawler Registry: Search, Training, User Fetchers, and Product Bots',
    seoTitle: 'AI Crawler Registry: GPTBot, ClaudeBot, PerplexityBot & More',
    subtitle: 'A maintained field guide to the major AI-facing crawler identities, what they are for, how robots.txt applies, and what network evidence can verify them.',
    seoDescription: 'AI crawler registry for OpenAI, Anthropic, Perplexity and Google: user agents, search vs training purpose, robots controls, user-triggered fetchers and verification sources.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Crawler registry / product purpose / verification',
      note: 'A useful crawler registry classifies purpose before product name: search, model development, user fetch, ads/product validation, or ordinary Search crawling.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'The useful unit in an AI crawler registry is not “AI company”; it is a specific web-access identity with a documented purpose, robots behavior, and verifiable network source.',
    conclusion: {
      title: 'Maintain the registry as operational infrastructure',
      content: 'Crawler names and IP ranges change. A durable registry stores the provider, token, purpose, automatic-versus-user-triggered class, robots semantics, official network source, and last-verified date. Policy rules and log analytics should both derive from that record instead of hand-maintained folklore.',
    },
    evidenceBoundary: 'This registry focuses on major publisher-facing identities documented by OpenAI, Anthropic, Perplexity, and Google as of September 23, 2026. It is not a claim that every AI product crawler is listed, and individual providers can change behavior or add agents after the evidence date.',
    metrics: [
      { label: 'Providers covered', value: '4' },
      { label: 'Primary classes', value: 'SEARCH / TRAINING / USER / PRODUCT' },
      { label: 'Verification', value: 'OFFICIAL DOCS + NETWORK' },
      { label: 'Refresh rule', value: 'DATE EVERY RECORD' },
    ],
    resources: commonResources,
    content: [
      '“AI crawler” has become too broad to be an operational category. OAI-SearchBot and PerplexityBot exist for search discovery. GPTBot and ClaudeBot are tied to model-development crawling. ChatGPT-User, Claude-User, and Perplexity-User are user-triggered retrieval identities. OAI-AdsBot exists for ad landing-page review. Google-Extended is not even a separate HTTP crawler; it is a robots product token.',
      'A registry should make those differences machine-readable. The minimum fields are provider, token, purpose, automatic or user-triggered status, robots policy semantics, full or sample User-Agent, official IP/range endpoint where available, documentation URL, first-seen date, last-verified date, and notes about product-specific exceptions.',
    ],
    sections: [
      {
        id: 'registry',
        title: 'Current high-value registry entries',
        paragraphs: [
          'OpenAI: OAI-SearchBot for Search, GPTBot for model-development crawling, ChatGPT-User for user-triggered fetches, OAI-AdsBot for ad landing-page validation. Anthropic: ClaudeBot for model development, Claude-SearchBot for search, Claude-User for user-directed retrieval. Perplexity: PerplexityBot for search and Perplexity-User for user requests.',
          'Google requires a different mental model. Googlebot powers ordinary Search crawling; Google-Extended is a policy token for defined Gemini uses rather than a separate network User-Agent. Google also documents user-triggered fetchers separately.',
        ],
        table: {
          caption: 'Publisher-facing AI and Search web-access identities',
          columns: ['Provider', 'Identity', 'Primary purpose', 'Automatic?', 'Key control'],
          rows: [
            ['OpenAI', 'OAI-SearchBot', 'ChatGPT Search discovery', 'Yes', 'robots.txt + published IP ranges'],
            ['OpenAI', 'GPTBot', 'Model-development crawling', 'Yes', 'robots.txt + published IP ranges'],
            ['OpenAI', 'ChatGPT-User', 'User-triggered retrieval', 'No', 'Access control; robots may not apply'],
            ['OpenAI', 'OAI-AdsBot', 'Ad landing-page validation', 'Triggered by ad submission', 'Reachability + published IP ranges'],
            ['Anthropic', 'ClaudeBot', 'Model-development crawling', 'Yes', 'robots.txt + provider network evidence'],
            ['Anthropic', 'Claude-SearchBot', 'Search crawling', 'Yes', 'robots.txt + provider network evidence'],
            ['Anthropic', 'Claude-User', 'User-directed retrieval', 'No', 'Provider-documented bot policy'],
            ['Perplexity', 'PerplexityBot', 'Search discovery', 'Yes', 'robots.txt + published IP ranges'],
            ['Perplexity', 'Perplexity-User', 'User-triggered retrieval', 'No', 'Generally ignores robots.txt; IP verification'],
            ['Google', 'Google-Extended', 'Gemini training/grounding policy token', 'Not a separate UA', 'robots.txt product token'],
          ],
        },
      },
      {
        id: 'policy',
        title: 'Generate policy from purpose, not brand',
        paragraphs: [
          'A publisher may want search discovery but not automatic model-development crawling. OpenAI and Anthropic expose separate tokens that can express that outcome. A blanket Disallow for every token containing the provider name throws away that granularity.',
          'User-triggered fetchers need another decision because several providers document robots behavior differently for user requests. Private content still belongs behind authentication regardless of crawler policy.',
        ],
      },
      {
        id: 'verification',
        title: 'Keep a network-verification column',
        paragraphs: [
          'OpenAI and Perplexity publish product-specific IP JSON files. Google publishes crawler IP data and DNS verification methods. Anthropic publishes bot/network guidance. Store the official endpoint rather than copying a list into a wiki that will age silently.',
          'When ingesting logs, stamp the exact range-file retrieval time used for classification. That makes a historical attribution reproducible even after the provider changes its current network ranges.',
        ],
      },
      {
        id: 'maintenance',
        title: 'What should trigger a registry refresh',
        paragraphs: [
          'Refresh when a provider changes crawler documentation, a new token appears in logs, a known token arrives from previously unseen networks, or a product launches a new search, ads, agent, or user-fetch workflow. A periodic scheduled check catches quieter changes.',
          'Version the registry. Crawler policy is infrastructure: an unrecorded semantic change can alter search visibility, training preference, WAF behavior, and analytics at the same time.',
        ],
      },
    ],
    sources: [openAiBots, anthropicBots, perplexityBots, googleCommon, googleVerify],
  },
];
