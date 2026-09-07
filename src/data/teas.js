// Single source of truth for the tea catalogue.
// Used by the product page (display) AND the checkout Function (authoritative
// price lookup), so you only edit product details in one place.
//
// TODO before going live:
//   1. In Stripe, create each tea as a Product with a GBP Price.
//   2. Copy each Price's ID (looks like "price_1AbC...") into `priceId` below.
//   3. Keep `price` (in pounds) in sync for display — the REAL charge always
//      comes from the Stripe Price, never from this number, so a mismatch here
//      can only mislead the shopper, it can't overcharge them.

export const teas = [
	{
		slug: "foragers-delight",
		name: "Forager's Delight",
		price: 24.0,
		priceId: "price_REPLACE_ME_FORAGERS",
		origin: "Liugui, Kaohsiung, Taiwan | Altitude: 1,400 metres above sea level",
		scene: "Early spring in the forest, gentle glow through the curtains.",
		description:
			"Foraged from rare and wild native Taiwanese species <em>Camellia formosensis</em>, this delicate white tea offers a silky infusion with earthy hints of mint and cinnamon. Ideal for languorous mornings or quiet afternoon walks.",
		shortDescription:
			"A delicate white tea foraged from native Camellia formosensis in Liugui, Taiwan. Velvety with notes of mint and cinnamon.",
	},
	{
		slug: "winter-harvest",
		name: "Winter Harvest",
		price: 22.0,
		priceId: "price_REPLACE_ME_WINTER",
		origin: "Mingjian, Nantou, Taiwan | Altitude: 300-600 metres above sea level",
		scene: "Autumn air, windows cracked, the scent of fallen leaves.",
		description:
			"Grown in red laterite soil and picked in the cooler months, this <em>Sijichun</em> oolong is naturally floral and sleek. A soothingly restorative tea to clear the air.",
		shortDescription:
			"A naturally sweet Sijichun oolong from Nantou with floral and elegant notes. Grown in red laterite soil.",
	},
	{
		slug: "sweet-pearls",
		name: "Sweet Pearls",
		price: 25.0,
		priceId: "price_REPLACE_ME_PEARLS",
		origin: "Alishan, Chiayi, Taiwan | Altitude: 800-1,000 metres above sea level",
		scene: "Summer afternoons, golden shimmer, laughter in the background.",
		description:
			"This <em>Jin Xuan</em> milk oolong from Alishan is creamy and uplifting, with notes of popcorn, toasted grain, and molasses. A comforting and joyful finish.",
		shortDescription:
			"A Jin Xuan milk oolong from Alishan, with notes of molasses and sweet popcorn. Creamy and comforting.",
	},
	{
		slug: "icy-peak",
		name: "Icy Peak",
		price: 26.0,
		priceId: "price_REPLACE_ME_ICY",
		origin: "Lugu, Nantou, Taiwan | Altitude: 600-800 metres above sea level",
		scene: "Deep winter evening, vinyl playing low, soft wool, warm hands.",
		description:
			"A roasted <em>Dong Ding</em> oolong that's smoky and full-bodied, with a long finish. Notes of honey, cacao, and ripe melon unfold slowly over each infusion.",
		shortDescription:
			"A roasted Dong Ding oolong from Lugu. Smoky and full-bodied with notes of honey, cacao, and melon.",
	},
	{
		slug: "amber-twists",
		name: "Amber Twists",
		price: 28.0,
		priceId: "price_REPLACE_ME_AMBER",
		origin: "Lalashan, Taoyuan, Taiwan | Altitude: 1,600 metres above sea level",
		scene: "Late summer dusk, mist curling through old trees.",
		description:
			"Fully fermented and grown beneath Lalashan's forest canopy, this tea opens with a dry, woody note before revealing mellow orchard fruit and lush cypress needles.",
		shortDescription:
			"A fully fermented tea from Lalashan. Dry opening with mellow orchard fruit and a cypress warmth.",
	},
];
