// Cloudflare Pages Function — served at POST /api/checkout
//
// Receives the browser's basket ({ items: [{ slug, qty }] }), looks up the
// AUTHORITATIVE Stripe price for each slug server-side (so a tampered client
// can't change prices), creates a Stripe Checkout Session, and returns its URL.
//
// SETUP:
//   In the Cloudflare Pages dashboard → your project → Settings →
//   Environment variables, add a SECRET (encrypted) variable named
//   STRIPE_SECRET_KEY. Use your Stripe TEST key (sk_test_...) for the preview,
//   and the LIVE key (sk_live_...) for production. NEVER commit the secret key.

import { teas } from "../../src/data/teas.js";

const priceBySlug = Object.fromEntries(teas.map((t) => [t.slug, t.priceId]));

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

export async function onRequestPost(context) {
	const { request, env } = context;

	const secret = env.STRIPE_SECRET_KEY;
	if (!secret) {
		return json({ error: "Server not configured (missing STRIPE_SECRET_KEY)." }, 500);
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Invalid request." }, 400);
	}

	const items = Array.isArray(body?.items) ? body.items : [];
	if (items.length === 0) {
		return json({ error: "Your basket is empty." }, 400);
	}

	// Validate and build line items from the server-side price map.
	const lineItems = [];
	for (const item of items) {
		const slug = String(item?.slug || "");
		const qty = Math.floor(Number(item?.qty));
		const priceId = priceBySlug[slug];

		if (!priceId || priceId.startsWith("price_REPLACE_ME")) {
			return json({ error: `Product not available: ${slug || "unknown"}.` }, 400);
		}
		if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
			return json({ error: `Invalid quantity for ${slug}.` }, 400);
		}
		lineItems.push({ price: priceId, quantity: qty });
	}

	// Build success/cancel URLs from the request origin so this also works on
	// Cloudflare preview deployments, not just the live domain.
	const origin = new URL(request.url).origin;

	const params = new URLSearchParams();
	params.set("mode", "payment");
	params.set("success_url", `${origin}/success?session_id={CHECKOUT_SESSION_ID}`);
	params.set("cancel_url", `${origin}/cancel`);
	lineItems.forEach((li, i) => {
		params.set(`line_items[${i}][price]`, li.price);
		params.set(`line_items[${i}][quantity]`, String(li.quantity));
	});

	// Collect a shipping address. Add more ISO country codes as you ship wider.
	params.set("shipping_address_collection[allowed_countries][0]", "GB");

	// OPTIONAL: charge shipping. Create a Shipping rate in the Stripe dashboard
	// (Products → Shipping rates), then uncomment and paste its id (shr_...):
	// params.set("shipping_options[0][shipping_rate]", "shr_REPLACE_ME");

	let session;
	try {
		const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${secret}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params.toString(),
		});
		session = await resp.json();
		if (!resp.ok) {
			return json({ error: session?.error?.message || "Payment provider error." }, 502);
		}
	} catch {
		return json({ error: "Could not reach the payment provider." }, 502);
	}

	return json({ url: session.url });
}
