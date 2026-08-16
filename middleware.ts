import { next } from '@vercel/functions';

import { trailingSlashRedirectUrl } from './packages/bot-observer/canonical-url.js';
import {
  createBotEvent,
  getBotObserverRuntimeConfig,
  shouldObserveRequest,
} from './packages/bot-observer/middleware-adapter.js';
import { sendSignedEvent } from './packages/bot-observer/signer.js';

let lastDeliveryWarningAt = 0;

interface RequestContext {
  waitUntil(promise: Promise<unknown>): void;
}

function reportDeliveryFailure(): void {
  const now = Date.now();
  if (now - lastDeliveryWarningAt < 60_000) return;
  lastDeliveryWarningAt = now;
  console.warn('[bot-observer] signed collector delivery failed');
}

export default function middleware(request: Request, context: RequestContext) {
  const canonicalUrl = trailingSlashRedirectUrl(request.url);
  if (canonicalUrl) {
    return new Response(null, {
      status: 308,
      headers: {
        Location: canonicalUrl,
      },
    });
  }

  const observerConfig = getBotObserverRuntimeConfig(process.env);
  if (observerConfig && shouldObserveRequest(request)) {
    const event = createBotEvent(request, observerConfig);
    context.waitUntil(
      sendSignedEvent(event, observerConfig)
        .then((status) => {
          if (status < 200 || status >= 300) reportDeliveryFailure();
        })
        .catch(reportDeliveryFailure),
    );
  }

  return next();
}

export const config = {
  runtime: 'edge',
  matcher: [
    '/((?!api(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|assets(?:/|$)|fonts(?:/|$)|healthz?$|favicon\\.(?:ico|svg)$|.*\\.(?:css|js|mjs|map|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot)$).*)',
  ],
};
