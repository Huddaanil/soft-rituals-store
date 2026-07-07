// Soft Rituals — product catalog.
// This file is the fallback source of truth; the same data is seeded
// into Supabase (supabase/store_schema.sql). Prices are in Mozambican
// meticais (MZN). Prices marked from stall labels; others are
// placeholders awaiting Samira's confirmation.

export type Category = {
  slug: string;
  name: string;
  blurb: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number; // MZN
  image: string;
  alt: string;
  short: string;
  story: string[];
  notes: string[];
  featured?: boolean;
  seoTitle: string;
  seoDescription: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "candles",
    name: "Candles",
    blurb: "Sculpted by hand, poured one at a time.",
  },
  {
    slug: "dessert-candles",
    name: "Dessert Candles",
    blurb: "They look delicious. They are wax.",
  },
  {
    slug: "gift-boxes",
    name: "Gift Boxes",
    blurb: "Wrapped, tagged and ready to give.",
  },
  {
    slug: "soaps",
    name: "Soaps",
    blurb: "Gentle on skin, made in small batches.",
  },
];

export const PRODUCTS: Product[] = [
  // ---------- CANDLES ----------
  {
    slug: "dahlia-bowl-set",
    name: "Dahlia Bowl Set",
    category: "candles",
    price: 1450,
    image: "/products/flower-bowl-set.jpg",
    alt: "Pink dahlia candle in a fluted ceramic pot with matching bud vase and oval tray",
    short: "A wax dahlia in a fluted ceramic pot — with its own vase and tray.",
    story: [
      "Some people keep flowers on their desk. You keep deadlines. This is the compromise: a dahlia sculpted petal by petal in soft pink wax, set in a fluted ceramic pot you'll keep long after the candle is gone.",
      "It comes as a set — pot, bud vase and oval tray — so the corner of your desk becomes the one place in your day that is finished, tidy and calm.",
    ],
    notes: ["Hand-sculpted wax dahlia", "Reusable ceramic pot, vase and tray", "Made in Maputo"],
    featured: true,
    seoTitle: "Dahlia Bowl Set — hand-sculpted flower candle | Soft Rituals",
    seoDescription:
      "A pink wax dahlia in a fluted ceramic pot with matching vase and tray. Hand-sculpted candle, made in Maputo. Small rituals, big calm.",
  },
  {
    slug: "flower-oval-bowl",
    name: "Flower Oval Bowl",
    category: "candles",
    price: 1650,
    image: "/products/flower-oval-bowl.svg",
    alt: "Large white oval bowl candle in cream wax set with six sculpted flowers — a big orange cherry blossom at the centre, pink and yellow blooms around it",
    short: "A big oval bowl of cream wax planted with six wax flowers — an orange blossom at its heart.",
    story: [
      "Six flowers, one bowl, no vase to top up. A pink chrysanthemum and a bright yellow blossom sit up top, a sage-grey leaf and a wide orange cherry blossom hold the middle, and a pair of roses — one yellow, one pink — close the bottom. All of it sculpted in wax and set into a large white oval bowl of soft cream.",
      "It's the centrepiece for the table you keep meaning to tidy. Light a wick when the evening needs slowing down, or leave it whole as a garden that asks nothing of you.",
    ],
    notes: ["Six hand-sculpted wax flowers", "Large white oval bowl", "Orange blossom centrepiece"],
    featured: true,
    seoTitle: "Flower Oval Bowl — large sculpted flower candle | Soft Rituals",
    seoDescription:
      "A large white oval bowl candle set with six wax flowers around an orange cherry blossom. Hand-sculpted, made in Maputo by Soft Rituals.",
  },
  {
    slug: "succulent-oval-bowl",
    name: "Succulent Oval Bowl",
    category: "candles",
    price: 1250,
    image: "/products/succulent-oval-bowl.svg",
    alt: "Small white oval bowl candle in cream wax planted with six sculpted succulents in greens and teal",
    short: "A small oval bowl of six wax succulents. The desert garden that never needs watering.",
    story: [
      "A teal agave, a lime maple leaf, a ruffled echeveria, a plump dark-green cluster, a teal leaf and a tidy green rosette — six little succulents sculpted in wax and nestled into a small white oval bowl of cream.",
      "For the windowsill that's seen a few plants come and go. This one holds its shape through every forgotten watering, and lights one wick at a time when you want it to.",
    ],
    notes: ["Six sculpted wax succulents", "Small white oval bowl", "Greens and teal tones"],
    seoTitle: "Succulent Oval Bowl — small sculpted succulent candle | Soft Rituals",
    seoDescription:
      "A small white oval bowl candle planted with six wax succulents in green and teal. The garden you cannot kill, handmade in Maputo.",
  },
  {
    slug: "succulent-garden-box",
    name: "Succulent Garden Box",
    category: "candles",
    price: 1200,
    image: "/products/succulent-box.jpg",
    alt: "Four sculpted succulent candles planted on real pebbles in a white tray",
    short: "Four wax succulents on real pebbles. The garden that survives you.",
    story: [
      "You forgot to water the last plant. And the one before that. This garden holds no grudge: a teal lotus, a green echeveria, a dark little cactus and a pale peony, sculpted in wax and planted on real pebbles.",
      "Light one wick at a time, or keep it whole on the shelf as proof that something in your care is thriving.",
    ],
    notes: ["Four sculpted succulents", "Set on real pebbles", "Looks after itself"],
    seoTitle: "Succulent Garden Box — sculpted candle set | Soft Rituals",
    seoDescription:
      "Four hand-sculpted succulent candles on real pebbles in a white tray. The plant you cannot kill. Handmade in Maputo by Soft Rituals.",
  },
  {
    slug: "carved-bouquet-pillar",
    name: "Carved Bouquet Pillar",
    category: "candles",
    price: 950,
    image: "/products/carved-pillar.jpg",
    alt: "Soft pink pillar candle carved with roses, lilies and daisies",
    short: "A whole bouquet carved from wax, in the softest pink.",
    story: [
      "Roses, lilies and daisies, carved into one soft pink pillar. It looks like something you'd be given at the end of a very good week — so give it to yourself before the week even starts.",
      "Burn it slowly in the evenings and the flowers glow from inside. Or never burn it at all. We won't check.",
    ],
    notes: ["Carved floral relief", "Slow-burning pillar", "Glows from within as it burns"],
    featured: true,
    seoTitle: "Carved Bouquet Pillar — floral carved candle | Soft Rituals",
    seoDescription:
      "A pink pillar candle carved with roses, lilies and daisies. Hand-carved, slow-burning, made in Maputo. Small rituals, big calm.",
  },
  {
    slug: "bubble-cube",
    name: "Bubble Cube",
    category: "candles",
    price: 350,
    image: "/products/bubble-cube.jpg",
    alt: "Cream bubble cube candle in a kraft gift box on green paper",
    short: "The little cream cube everyone reaches for first.",
    story: [
      "Small, round-shouldered and impossible not to pick up. The bubble cube is the candle equivalent of a deep breath — modest, soft, exactly enough.",
      "Keep one by the kettle. Light it while the water boils. That's the whole ritual, and it works.",
    ],
    notes: ["Fits in one hand", "Cream finish", "An easy first candle"],
    seoTitle: "Bubble Cube — small cream candle | Soft Rituals",
    seoDescription:
      "A small cream bubble cube candle, handmade in Maputo. The five-minute ritual for people who work too much.",
  },
  {
    slug: "starfish-and-shells",
    name: "Starfish & Shells",
    category: "candles",
    price: 350,
    image: "/products/starfish.jpg",
    alt: "Star-shaped candle with grey rim and white wax, decorated with wax seashells",
    short: "A starfish full of wax seashells. The sea, without the traffic to Costa do Sol.",
    story: [
      "White wax poured into a grey starfish, finished with little shells in blue and cream. Three wicks, so the light spreads like late afternoon on the water.",
      "For the person who keeps saying they need a beach day and keeps not taking one.",
    ],
    notes: ["Three wicks", "Wax shell details", "Sculpted starfish vessel"],
    seoTitle: "Starfish & Shells — seaside candle | Soft Rituals",
    seoDescription:
      "A starfish-shaped candle with wax seashells and three wicks. The beach day you keep postponing, handmade in Maputo.",
  },
  {
    slug: "ocean-in-a-glass",
    name: "Ocean in a Glass",
    category: "candles",
    price: 1000,
    image: "/products/ocean-glass.jpg",
    alt: "Round glass candle with deep blue gel wax, sand and shells like the sea floor",
    short: "Deep blue gel, real sand, little shells. An aquarium that needs nothing from you.",
    story: [
      "Look closely: sand at the bottom, shells on the reef, and that deep clear blue that only exists in water and in this glass. It took hours to layer. It takes one match to enjoy.",
      "Burn it at your desk and watch the light move through the blue. Closest thing to a dive you can do in a meeting.",
    ],
    notes: ["Layered gel wax", "Real sand and shell details", "Round glass vessel"],
    seoTitle: "Ocean in a Glass — blue gel candle | Soft Rituals",
    seoDescription:
      "A deep blue gel candle layered with real sand and shells. The ocean for your desk, handmade in Maputo by Soft Rituals.",
  },
  {
    slug: "little-buddha",
    name: "Little Buddha",
    category: "candles",
    price: 200,
    image: "/products/buddha.jpg",
    alt: "Soft pink Buddha candle sitting in a kraft gift box with green paper",
    short: "A calm little figure in soft pink. He has never checked his email.",
    story: [
      "He sits. That's it. That's the skill. A small Buddha in soft pink wax, perfectly content to do absolutely nothing — which makes him the most qualified teacher in your house.",
      "Put him where the day gets loud: next to the laptop, by the phone charger, on the kitchen counter at 18:00.",
    ],
    notes: ["Hand-poured figure", "Soft pink wax", "Boxed and gift-ready"],
    seoTitle: "Little Buddha — calm figure candle | Soft Rituals",
    seoDescription:
      "A small pink Buddha candle, hand-poured in Maputo. A quiet teacher for loud days. Small rituals, big calm.",
  },

  // ---------- DESSERT CANDLES ----------
  {
    slug: "iced-latte",
    name: "Iced Latte",
    category: "dessert-candles",
    price: 750,
    image: "/products/iced-latte.jpg",
    alt: "Iced Latte candle — creamy wax latte in a fluted glass topped with wax chocolates",
    short: "A creamy latte topped with wax chocolates. Zero caffeine after 17:00.",
    story: [
      "You've had your last coffee of the day — your doctor, your spouse and your sleep all agree. This one is wax: a creamy latte in a fluted glass, piled with little chocolate drops.",
      "Light it at the hour you'd normally pour another cup. Same comfort. Better night.",
    ],
    notes: ["Fluted glass vessel", "Wax chocolate topping", "The decaf that isn't coffee at all"],
    featured: true,
    seoTitle: "Iced Latte — dessert candle | Soft Rituals",
    seoDescription:
      "A creamy latte candle in a fluted glass topped with wax chocolates. The after-hours coffee with zero caffeine. Handmade in Maputo.",
  },
  {
    slug: "strawberry-matcha",
    name: "Strawberry Matcha",
    category: "dessert-candles",
    price: 750,
    image: "/products/strawberry-matcha.jpg",
    alt: "Strawberry Matcha candle — green wax with two wax strawberries in a frosted glass",
    short: "Green tea and strawberries in a frosted glass. Fresh, sweet, very calm.",
    story: [
      "Matcha green poured over berry pink, in a frosted glass that catches the afternoon light. Two wax strawberries sit on top like they have nowhere else to be.",
      "This is the candle for the slow hour — the one you keep promising yourself and finally taking.",
    ],
    notes: ["Layered green and pink wax", "Frosted textured glass", "Wax strawberry topping"],
    seoTitle: "Strawberry Matcha — dessert candle | Soft Rituals",
    seoDescription:
      "A strawberry matcha candle in a frosted glass — green tea calm with wax strawberries on top. Handmade in Maputo by Soft Rituals.",
  },
  {
    slug: "blossom",
    name: "Blossom",
    category: "dessert-candles",
    price: 550,
    image: "/products/blossom.jpg",
    alt: "Blossom candle — clear wax holding real dried flowers in a square glass",
    short: "Real dried flowers held in clear wax. Spring, caught in a glass.",
    story: [
      "Tiny dried buds and petals, suspended in clear wax like the first week of spring decided to stay. Every Blossom is different, because every handful of flowers is.",
      "As it burns, the light finds the petals one by one. It's the slowest possible way to watch flowers — which is rather the point.",
    ],
    notes: ["Real dried flowers", "Clear wax, square glass", "Each one unique"],
    seoTitle: "Blossom — dried flower candle | Soft Rituals",
    seoDescription:
      "Clear wax holding real dried flowers in a square glass. Spring in slow motion, handmade in Maputo. Small rituals, big calm.",
  },
  {
    slug: "candy-sundae",
    name: "Candy Sundae",
    category: "dessert-candles",
    price: 900,
    image: "/products/sundae.jpg",
    alt: "Sundae candle piled with wax whipped cream, candies, strawberries and a waffle",
    short: "Whipped cream, candy, strawberries, a waffle — all wax, all yours.",
    story: [
      "Every sweet thing you were told to stop eating, piled into one glass: whipped cream, bonbons, strawberries, a little chocolate waffle. Calories: zero. Joy: complete.",
      "It's the loudest thing we make, and somehow it still says relax.",
    ],
    notes: ["Sculpted wax toppings", "Faceted glass coupe", "Zero calories, all of them"],
    seoTitle: "Candy Sundae — dessert candle | Soft Rituals",
    seoDescription:
      "A sundae candle piled with wax cream, candy and strawberries. Dessert with zero calories, handmade in Maputo by Soft Rituals.",
  },
  {
    slug: "berry-trifle-bowl",
    name: "Berry Trifle Bowl",
    category: "dessert-candles",
    price: 1100,
    image: "/products/berry-bowl.jpg",
    alt: "Berry trifle candle in a crystal bowl with lid — red and gold layers with wax berries",
    short: "A crystal bowl of wax berries with its own lid. The centrepiece that never melts in the heat.",
    story: [
      "Layers of red, gold and clear wax, studded with dark berries, in a proper crystal bowl with a proper crystal lid. It looks like Sunday lunch at your aunt's house, the good one.",
      "Three wicks under the surface. Keep the lid for when guests get curious.",
    ],
    notes: ["Crystal bowl with lid", "Three wicks", "Layered berry detail"],
    seoTitle: "Berry Trifle Bowl — crystal dessert candle | Soft Rituals",
    seoDescription:
      "A berry trifle candle in a lidded crystal bowl with three wicks. The centrepiece that keeps, handmade in Maputo.",
  },
  {
    slug: "berry-spritz",
    name: "Berry Spritz",
    category: "dessert-candles",
    price: 1000,
    image: "/products/berry-glass.jpg",
    alt: "Berry spritz candle — pink gel wax with wax berries in a gold-rimmed glass",
    short: "A pink spritz in a gold-rimmed glass. Happy hour, no headache.",
    story: [
      "Pink gel poured over wax raspberries and dark cherries, in a stemmed glass with a gold rim. Hold it up to the window and it's Friday, whatever the calendar says.",
      "The only cocktail that improves your evening and your Monday.",
    ],
    notes: ["Gold-rimmed stemmed glass", "Gel wax with berry details", "No hangover included"],
    seoTitle: "Berry Spritz — cocktail candle | Soft Rituals",
    seoDescription:
      "A pink cocktail candle with wax berries in a gold-rimmed glass. Happy hour without the headache, handmade in Maputo.",
  },

  // ---------- GIFT BOXES ----------
  {
    slug: "tulip-trio",
    name: "Tulip Trio",
    category: "gift-boxes",
    price: 700,
    image: "/products/tulip-trio.jpg",
    alt: "Three tulip candles — white, red and yellow — in a kraft gift box on green paper grass",
    short: "Three tulip candles on a bed of green. A bouquet that keeps.",
    story: [
      "White, red and yellow tulips on a bed of green paper grass, in a kraft box with a window. Flowers wilt by Thursday; these wait patiently for as long as you need them to.",
      "The gift for someone who has everything except twenty quiet minutes.",
    ],
    notes: ["Three sculpted tulips", "Kraft window box", "Ready to give as-is"],
    featured: true,
    seoTitle: "Tulip Trio — candle gift box | Soft Rituals",
    seoDescription:
      "Three tulip candles in a windowed kraft gift box. The bouquet that doesn't wilt, handmade in Maputo by Soft Rituals.",
  },
  {
    slug: "hamsa-and-rose",
    name: "Hamsa & Rose",
    category: "gift-boxes",
    price: 650,
    image: "/products/hamsa-rose.jpg",
    alt: "Pearly hamsa hand beside a cream rose candle in a kraft gift box",
    short: "A hand of blessings beside a cream rose, together in one box.",
    story: [
      "A pearly hamsa — the hand of blessings — resting beside a cream rose candle on green paper grass. Quiet protection and quiet beauty, boxed together.",
      "For new homes, new babies, new chapters, and the people you pray for in traffic.",
    ],
    notes: ["Detailed hamsa", "Cream rose candle", "Kraft window box"],
    seoTitle: "Hamsa & Rose — blessing gift box | Soft Rituals",
    seoDescription:
      "A hamsa hand with a cream rose candle in a kraft gift box. Quiet blessings, handmade in Maputo. Small rituals, big calm.",
  },
  {
    slug: "cupcake-box",
    name: "Cupcake Box",
    category: "gift-boxes",
    price: 750,
    image: "/products/cupcake-box.jpg",
    alt: "Pink cupcake and ice-cream candles in a white gift box with pink paper",
    short: "Cupcake and ice-cream candles in pink. The birthday cake that lasts.",
    story: [
      "Little cupcakes and ice-cream cones in every shade of pink, nested in a white box. It arrives looking like a patisserie window and stays looking like one.",
      "Send it instead of cake to the friend who is 'not doing birthdays this year'. Watch them do birthdays.",
    ],
    notes: ["Assorted dessert candles", "Pink gift presentation", "Birthday-proof"],
    seoTitle: "Cupcake Box — dessert candle gift box | Soft Rituals",
    seoDescription:
      "Cupcake and ice-cream candles in a pink gift box. The birthday cake that lasts all year, handmade in Maputo.",
  },

  // ---------- SOAPS ----------
  {
    slug: "organic-watermelon-soap",
    name: "Organic Watermelon Soap",
    category: "soaps",
    price: 250,
    image: "/products/organic-watermelon.svg",
    alt: "Illustration of the Organic Watermelon soap — red, white and green layered slice",
    short: "Layered like the real fruit. The happiest bar in the bathroom.",
    story: [
      "Red, white and green, layered like a proper slice — seeds and all. It turns the two minutes at the sink into the lightest part of your day.",
      "Made in small batches; when it sells out, we make more. Slowly.",
    ],
    notes: ["Layered slice design", "Gentle on skin", "Small batches"],
    seoTitle: "Organic Watermelon Soap — handmade soap | Soft Rituals",
    seoDescription:
      "A layered watermelon soap — red, white and green, seeds and all. Handmade in small batches in Maputo by Soft Rituals.",
  },
  {
    slug: "citrus-herb-soap",
    name: "Citrus Herb Soap",
    category: "soaps",
    price: 250,
    image: "/products/citrus-herb.svg",
    alt: "Illustration of the Citrus Herb soap — golden round bar speckled with herbs",
    short: "Golden and clear, speckled with real herbs. Garden-clean.",
    story: [
      "A golden, glassy round speckled with real herbs. It smells like a garden that someone else weeds — fresh, zesty, effortless.",
      "Best used slowly, at the end of days that went fast.",
    ],
    notes: ["Real herb speckles", "Golden clear bar", "Fresh and zesty"],
    seoTitle: "Citrus Herb Soap — handmade soap | Soft Rituals",
    seoDescription:
      "A golden clear soap speckled with real herbs. Garden-fresh and zesty, handmade in small batches in Maputo.",
  },
  {
    slug: "flower-garden-soaps",
    name: "Flower Garden Soaps",
    category: "soaps",
    price: 300,
    image: "/products/flower-garden.svg",
    alt: "Illustration of the Flower Garden soaps — daisy and blossom shaped bars",
    short: "Daisies, roses and blossoms — a bouquet you can wash with.",
    story: [
      "Soaps shaped like a Sunday market bouquet: daisies, roses, little blossoms. Too pretty for the soap dish, which is exactly why they belong there.",
      "Keep them for guests, or admit that you are also a guest in your own home and use them tonight.",
    ],
    notes: ["Assorted flower shapes", "Gentle on skin", "Guest-worthy, self-worthy"],
    seoTitle: "Flower Garden Soaps — handmade flower soaps | Soft Rituals",
    seoDescription:
      "Flower-shaped handmade soaps — daisies, roses and blossoms. A bouquet you can wash with, made in Maputo by Soft Rituals.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function formatMZN(amount: number): string {
  return `${amount.toLocaleString("pt-MZ").replace(/ /g, " ")} MT`;
}
