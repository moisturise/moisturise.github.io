# Shop setup (Stripe + Cloudflare Pages)

The storefront is a client-side basket (`src/components/Cart.astro`) that hands off
to Stripe Checkout via a Cloudflare Pages Function (`functions/api/checkout.js`).
No secret keys live in this repo.

## 1. Create products in Stripe (test mode first)

1. Toggle Stripe to **Test mode**.
2. For each tea, create a **Product** with a **GBP Price**.
3. Copy each Price ID (`price_1AbC...`) into `src/data/teas.js` → `priceId`, and
   keep the display `price` (in pounds) in sync.

## 2. Add the secret key to Cloudflare (never to the repo)

Cloudflare dashboard → your Pages project → **Settings → Environment variables**:

- Add an **encrypted** variable `STRIPE_SECRET_KEY`.
- **Preview** environment → your Stripe **test** key (`sk_test_...`).
- **Production** environment → your Stripe **live** key (`sk_live_...`).

Only the *secret* key is needed — this flow creates the Checkout Session
server-side and redirects to Stripe's hosted page, so no publishable key is
required in the browser.

## 3. Shipping (optional)

In `functions/api/checkout.js`, shipping-address collection is limited to `GB`.
To charge for shipping, create a **Shipping rate** in Stripe (Products →
Shipping rates) and uncomment the `shipping_options[0][shipping_rate]` line with
its `shr_...` id. Add more country codes to widen where you ship.

## 4. Test

- Push to a branch → Cloudflare builds a **preview URL**.
- Add teas to the basket, click **Checkout**, pay with test card
  `4242 4242 4242 4242` (any future expiry / any CVC / any postcode).
- You should land on `/success`; a cancelled payment lands on `/cancel`.

## 5. Go live

Set the production `STRIPE_SECRET_KEY` to your live key, flip Stripe to Live
mode, swap the `price_...` IDs for live-mode ones if they differ, and merge to
`main`. Cloudflare deploys automatically.

## Anti-tampering note

Prices are never trusted from the browser. The Function maps each basket item's
`slug` to a Stripe Price ID server-side (`src/data/teas.js`), so the amount
charged always comes from Stripe, not from anything the client sends.
