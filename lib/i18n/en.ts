// Canonical English UI strings. The Portuguese file (pt.ts) mirrors this
// exact shape. Product/category content is translated separately in the DB.
const en = {
  nav: {
    shop: "Shop",
    about: "About",
    delivery: "Delivery",
    contact: "Contact",
    cart: "Cart",
    menu: "Menu",
  },
  hero: {
    kicker: "Handcrafted in Maputo",
    titleLine1: "You work too much.",
    titleEm: "Light something.",
    body: "Soft Rituals makes handcrafted candles and soaps for people who forget to stop. Five quiet minutes, sculpted by hand, poured one at a time. Small rituals, big calm.",
    shopCta: "Shop the collection",
    storyCta: "Our story",
  },
  home: {
    browseTitle: "Browse by ritual",
    viewAll: "View all",
    featuredTitle: "The ones everyone asks about",
    shopAll: "Shop all",
    ideaKicker: "The idea",
    ideaTitlePre: "A soft ritual is a small moment ",
    ideaTitleEm: "you keep for yourself.",
    ideaBody:
      "Not a big change. Not a new routine. A flame lit while the kettle boils. A bar of soap that smells like a garden. One candle on the table after dinner. We make these things by hand in our kitchen in Maputo, so your busiest days keep one quiet corner.",
    ideaCta: "Read our story",
  },
  shop: {
    allTitle: "All products",
    allBlurb:
      "Everything is sculpted, poured and wrapped by hand in Maputo — in small batches, never in a factory.",
    all: "All",
    sort: "Sort",
    sortFeatured: "Featured",
    sortPriceAsc: "Price: low to high",
    sortPriceDesc: "Price: high to low",
    sortName: "Name A–Z",
    productOne: "product",
    productMany: "products",
    emptyPre: "Nothing here yet — new batches arrive often. ",
    emptyLink: "See everything",
  },
  product: {
    breadcrumbShop: "Shop",
    details: "The details",
    deliveryNote: "Delivery in Maputo arranged personally after you order",
    alsoLike: "You may also like",
    addToCart: "Add to cart",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
  },
  cart: {
    title: "Your cart",
    close: "Close",
    empty: "Your cart is empty — the calmest it will ever be.",
    emptyCta: "Browse the shop",
    subtotal: "Subtotal",
    deliveryNote:
      "Delivery in Maputo is arranged after you order — we confirm everything personally.",
    checkout: "Go to checkout",
    remove: "Remove",
  },
  checkout: {
    title: "Checkout",
    intro:
      "No account needed. We confirm every order personally before anything moves.",
    name: "Your name",
    namePh: "Maria Santos",
    phone: "Phone (WhatsApp)",
    phonePh: "+258 84 000 0000",
    email: "Email (optional)",
    emailPh: "you@example.com",
    area: "Delivery area",
    areaPlaceholder: "Choose your area in Maputo",
    note: "Note (optional)",
    notePh: "It's a gift / preferred delivery day / anything we should know",
    place: "Place order",
    placing: "Placing your order…",
    payNote:
      "Payment is on delivery (cash or M-Pesa). We'll confirm your order and the delivery fee personally before anything is charged.",
    emptyTitle: "Your cart is empty",
    emptyBody: "Find something small and calm first.",
    emptyCta: "Browse the shop",
    summaryTitle: "Your order",
    qty: "Qty",
    total: "Total",
    deliveryFee: "Delivery fee arranged with you — it depends on your area.",
    errorGeneric:
      "Something went wrong on our side. Please try again, or DM us on Instagram @ssoft.rituals.",
  },
  order: {
    thanks: "Thank you",
    received:
      "Your order is in. We'll confirm everything personally — usually within the day — and arrange delivery with you.",
    receivedPaid:
      "Your order is in and your payment went through. We'll confirm everything personally — usually within the day — and arrange delivery with you.",
    orderNumber: "Order number",
    total: "Total",
    payOnDelivery:
      "Payment on delivery — cash or M-Pesa. Delivery fee arranged with you.",
    payCard: "Payment by card. Delivery fee arranged with you.",
    keepNumberPre: "Keep this number — and if you'd like anything changed, just ",
    keepNumberLink: "DM us on Instagram",
    keepBrowsing: "Keep browsing",
    waOrderCta: "WhatsApp us about this order",
    waOrderMessage: "Hello Soft Rituals! I'm writing about my order ",
  },
  about: {
    kicker: "Our story",
    titlePre: "Made at home, ",
    titleEm: "the slow way.",
    p1: "Soft Rituals started in a kitchen in Maputo, with one pot of wax and a lot of patience. The first candles were for our own table — lit at the end of days that ran too long, for people who answer one more email before dinner.",
    p2: "Today every candle is still poured by hand and every soap is still cut by hand. Flowers are sculpted petal by petal. Gift boxes are packed one at a time. When a batch sells out, we make more — slowly, because that is the whole point.",
    p3: "We believe the cure for a loud day is not a holiday you keep postponing. It is five quiet minutes you actually take. Our work is to make those five minutes beautiful.",
    cta: "Shop the collection",
    values: [
      { title: "Hand-poured", text: "Each candle poured one at a time, never in a factory." },
      { title: "Small batches", text: "We make a little, often — so everything is fresh." },
      { title: "Handmade with love", text: "Every piece wrapped and tagged by hand, like a gift." },
      { title: "Made in Maputo", text: "Created here in Mozambique, with love." },
    ],
  },
  delivery: {
    kicker: "Delivery & orders",
    titlePre: "Simple, personal, ",
    titleEm: "arranged with you.",
    intro:
      "We are a small workshop, not a warehouse — and that is your advantage. Every order is confirmed by a person, packed by hand and delivered the way you prefer.",
    faqs: [
      {
        q: "How does ordering work?",
        a: "Add what you love to the cart and check out — it takes a minute and you don't need an account. We then confirm your order personally (usually by WhatsApp or Instagram) before anything moves, so you always talk to a human.",
      },
      {
        q: "Where do you deliver?",
        a: "Across Maputo and Matola, arranged with you after the order — we agree the day, the place and the delivery fee together. For other cities, message us first and we'll see what's possible.",
      },
      {
        q: "How do I pay?",
        a: "On delivery — cash or M-Pesa. Online card payment is coming soon; for now we keep it simple and personal.",
      },
      {
        q: "How long does it take?",
        a: "If your pieces are in stock, usually 1–3 days. If we're making a fresh batch for you, we'll tell you honestly when we confirm — handmade takes the time it takes.",
      },
      {
        q: "Can I order a gift?",
        a: "Yes — everything ships wrapped and tagged by hand. Tell us in the order note if it's a gift and we'll make sure it arrives looking like one, with no price inside.",
      },
      {
        q: "Candle care?",
        a: "First burn: let the top melt fully so it burns evenly. Trim the wick to about 5 mm before each light. Never leave a flame alone, and keep sculpted pieces out of direct sun — they're wax, and Maputo is warm.",
      },
    ],
    stillTitle: "Still wondering something?",
    stillBody:
      "Message us on Instagram — we answer personally, usually the same day.",
    contactCta: "Contact us",
  },
  contact: {
    kicker: "Contact",
    titlePre: "Talk to a person, ",
    titleEm: "not a ticket.",
    body: "Orders, gift ideas, custom pieces for events, or just to ask what's fresh this week — message us on WhatsApp or Instagram and we'll answer personally, usually the same day.",
    dmCta: "DM us on Instagram — @ssoft.rituals",
    waCta: "Order on WhatsApp",
    waMessage: "Hello Soft Rituals! I'd like to place an order.",
    whereTitle: "Where",
    whereBody:
      "Maputo, Mozambique. Delivery across Maputo and Matola, arranged with you.",
    whenTitle: "When",
    whenBody:
      "We reply personally, usually within the day — a little slower on pouring days.",
  },
  privacy: {
    kicker: "Privacy",
    title: "Your details, kept simple.",
    updated: "Last updated: 8 July 2026",
    sections: [
      {
        h: "Who we are",
        p: "Soft Rituals is a small handmade candle and soap business in Maputo, Mozambique. This page explains what happens to the details you give us when you order.",
      },
      {
        h: "What we collect",
        p: "When you place an order we ask only for what delivery needs: your name, phone number, delivery area and any note you add. Browsing the shop requires no account and no sign-up.",
      },
      {
        h: "What we use it for",
        p: "Only to confirm and deliver your order — usually with a WhatsApp or Instagram message from us. We do not send marketing, we do not sell or share your details with anyone, and we do not use advertising or tracking tools.",
      },
      {
        h: "Where it lives",
        p: "Orders are stored securely with our database provider (Supabase, hosted in the European Union). Payment on delivery means we never see or store card numbers.",
      },
      {
        h: "Your choices",
        p: "Ask us any time to see or delete the details we hold about you — one WhatsApp or Instagram message is enough.",
      },
    ],
    contactCta: "Contact us",
  },
  footer: {
    tagline:
      "Handcrafted candles and soaps from Maputo, Mozambique. Small rituals, big calm.",
    shopHead: "Shop",
    allProducts: "All products",
    infoHead: "Information",
    aboutUs: "About us",
    deliveryOrders: "Delivery & orders",
    contact: "Contact",
    privacy: "Privacy",
    findHead: "Find us",
    location: "Maputo, Mozambique",
    rights: "Handmade with love.",
    motto: "Light. Relax. Repeat.",
  },
};

export default en;
export type Dictionary = typeof en;
