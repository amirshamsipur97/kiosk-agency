/**
 * Content for the 2026 KIOSK homepage.
 * Single source of truth for every section — copy, links and image paths.
 */

export const CONTACT = {
  phone: "+968 909 909 23",
  phoneIntl: "96890990923",
  /* Second line, shown beside the first wherever the number is listed. */
  phone2: "+968 9092 0764",
  phone2Intl: "96890920764",
  email: "info@kioskoman.com",
  instagram: "https://www.instagram.com/kiosk.om/",
  instagramHandle: "@kiosk.om",
  maps: "https://maps.app.goo.gl/4hH1taqhDPKe5At7A",
  studio: "Al Ghubrah St., Muscat",
} as const;

export const wa = (text?: string) =>
  `https://api.whatsapp.com/send?phone=${CONTACT.phoneIntl}` +
  (text ? `&text=${encodeURIComponent(text)}` : "");

export const MENU = [
  { label: "Services", href: "/services", n: "01" },
  { label: "Clients", href: "/clients", n: "02" },
  { label: "Films", href: "/films", n: "03" },
  { label: "On the ground", href: "/on-the-ground", n: "04" },
  { label: "Contact", href: "#contact", n: "05" },
  { label: "Blog", href: "/insights", n: "06" },
];

export const TICKER = [
  "Strategy",
  "Films",
  "Social",
  "Advertising",
  "Lead generation",
  "Stands",
  "Activations",
  "Signage",
  "Branding",
];

/* Images the hero trail cycles through. */
export const TRAIL = [
  "/k/feed/ferrari.jpg",
  "/k/feed/jw-marriott.jpg",
  "/k/feed/lamborghini-1.jpg",
  "/k/feed/mk-properties-5.jpg",
  "/k/feed/porsche-1.jpg",
  "/k/feed/movenpick-1.jpg",
  "/k/feed/bentley.jpg",
  "/k/feed/dar-global.jpg",
  "/k/feed/alfa-romeo.jpg",
  "/k/feed/rhyton-gold.jpg",
  "/k/feed/zunairah.jpg",
  "/k/feed/mall-of-oman.jpg",
];

export const FILMS = [
  {
    idx: "/01",
    title: "Discover Muscat",
    meta: "Destination film · 156K views",
    href: "https://youtu.be/Cx-1w3IX5z8",
    cursor: "Watch",
    img: "/k/feed/mk-properties-1.jpg",
  },
  {
    idx: "/02",
    title: "Zunairah",
    meta: "Luxury property film",
    href: "https://youtu.be/AntUHPNAXM4",
    cursor: "Watch",
    img: "/k/feed/zunairah.jpg",
  },
  {
    idx: "/03",
    title: "The Arc",
    meta: "Sustainability film",
    href: "https://youtu.be/mqQrEnULK14",
    cursor: "Watch",
    img: "/k/feed/oxy-national-day.jpg",
  },
  {
    idx: "/04",
    title: "Old → New Oman",
    meta: "Brand storytelling",
    href: "https://youtu.be/bm-v8OEZeV4",
    cursor: "Watch",
    img: "/k/feed/mall-of-oman.jpg",
  },
  {
    idx: "/05",
    title: "The Podcasts",
    meta: "96K+ views · series",
    href: CONTACT.instagram,
    cursor: "Listen",
    img: "/k/feed/irfan-investment.jpg",
  },
];

/* Two counter-scrolling photo rows. Each is rendered twice for a seamless loop. */
export const FEED_A = [
  "/k/feed/mk-properties-1.jpg",
  "/k/feed/porsche-1.jpg",
  "/k/feed/juva-1.jpg",
  "/k/feed/atana-hotels.jpg",
  "/k/feed/ferrari.jpg",
  "/k/feed/dar-global.jpg",
  "/k/feed/movenpick-1.jpg",
  "/k/feed/lamborghini-1.jpg",
  "/k/feed/mk-properties-2.jpg",
  "/k/feed/chic-derma.jpg",
  "/k/feed/supercars-majlis.jpg",
  "/k/feed/hotel-indigo.jpg",
  "/k/feed/oxy-national-day.jpg",
  "/k/feed/mk-properties-3.jpg",
  "/k/feed/rhyton-gold.jpg",
  "/k/feed/gac-oman.jpg",
];

export const FEED_B = [
  "/k/feed/jw-marriott.jpg",
  "/k/feed/alfa-romeo.jpg",
  "/k/feed/mk-properties-4.jpg",
  "/k/feed/movenpick-2.jpg",
  "/k/feed/bentley.jpg",
  "/k/feed/juva-2.jpg",
  "/k/feed/mall-of-oman.jpg",
  "/k/feed/porsche-2.jpg",
  "/k/feed/bait-al-bahr.jpg",
  "/k/feed/lamborghini-2.jpg",
  "/k/feed/mk-properties-5.jpg",
  "/k/feed/liva.jpg",
  "/k/feed/pampers.jpg",
  "/k/feed/movenpick-3.jpg",
  "/k/feed/zunairah.jpg",
  "/k/feed/irfan-investment.jpg",
];

export const SERVICES = [
  {
    idx: "/01",
    title: "Creative strategy",
    body: "We turn business goals into clear creative direction, campaign concepts, and stronger brand communication.",
    img: "/k/feed/irfan-investment.jpg",
  },
  {
    idx: "/02",
    title: "Films & content",
    body: "We create films, photography, and digital content designed to capture attention and tell your brand story.",
    img: "/k/feed/juva-1.jpg",
  },
  {
    idx: "/03",
    title: "Performance ads",
    body: "We build performance-driven campaigns focused on brand awareness, qualified lead generation, and measurable growth.",
    img: "/k/feed/mk-properties-2.jpg",
  },
  {
    idx: "/04",
    title: "Stands & exhibitions",
    body: "We design and build exhibition stands that bring your brand to life in physical spaces.",
    img: "/k/build-02-exhibition-arena.jpg",
  },
  {
    idx: "/05",
    title: "Activations & retail",
    body: "We create brand activations and retail experiences that turn spaces into memorable customer interactions.",
    img: "/k/build-08-instore-retail.jpg",
  },
  {
    idx: "/06",
    title: "Signage & branding",
    body: "We create visual identities and signage systems that make your brand consistent and recognizable across every touchpoint.",
    img: "/k/build-11-office-branding.jpg",
  },
  {
    idx: "/07",
    title: "Web & CRM",
    body: "Websites and CRM solutions designed to capture leads, organize customer data, and support business growth.",
    img: "/k/feed/mk-properties-4.jpg",
  },
  {
    idx: "/08",
    title: "Social media management",
    body: "We manage your social media from planning and publishing to audience engagement, keeping your brand active, consistent, and connected.",
    img: "/k/feed/movenpick-1.jpg",
  },
];

/**
 * What the blog covers. There are no articles written yet, so the page shows
 * the subjects rather than pretending to a back catalogue. Add entries with a
 * `href` and a `date` as pieces are published and the card becomes a link.
 */
export const JOURNAL: {
  idx: string;
  title: string;
  body: string;
  img: string;
  href?: string;
  date?: string;
}[] = [
  {
    idx: "/01",
    title: "SEO insights",
    img: "/k/ground/stand-aisle-long.jpg",
    body: "Tactics and frameworks for organic growth that keeps compounding after the campaign stops.",
  },
  {
    idx: "/02",
    title: "Marketing strategies",
    img: "/k/ground/event-expo-hall.jpg",
    body: "Performance playbooks aimed at qualified lead generation rather than impressions.",
  },
  {
    idx: "/03",
    title: "Automation guides",
    img: "/k/ground/stand-aisle-snacks.jpg",
    body: "Removing manual work from a sales floor so a small team can carry a large pipeline.",
  },
  {
    idx: "/04",
    title: "Real estate marketing",
    img: "/k/ground/render-compound.jpg",
    body: "Lead systems built for property businesses, from first click to a booked viewing.",
  },
  {
    idx: "/05",
    title: "Website optimisation",
    img: "/k/ground/render-admin-building.jpg",
    body: "Turning the traffic you already pay for into measurable conversions.",
  },
  {
    idx: "/06",
    title: "Growth systems",
    img: "/k/ground/event-exhibition-floor.jpg",
    body: "Connecting every channel into one engine instead of a set of disconnected efforts.",
  },
  {
    idx: "/07",
    title: "Case study breakdowns",
    img: "/k/ground/production-awards-wall.jpg",
    body: "What worked on a real account, why it worked, and how to repeat it.",
  },
  {
    idx: "/08",
    title: "Industry trends",
    img: "/k/ground/event-ballroom-ceiling.jpg",
    body: "Where digital growth in the GCC is heading, and what it changes for a marketing budget.",
  },
];

export const NUMBERS = [
  {
    target: 17,
    suffix: "",
    title: "Years across the GCC",
    body: "From a Muscat production floor in 2009 to campaigns and builds in five countries.",
    img: "/k/num-01-years.jpg",
  },
  {
    target: 1000,
    suffix: "+",
    title: "Builds fabricated in-house",
    body: "Stands, displays and signage cut, welded, printed and installed by our own team.",
    img: "/k/num-02-builds.jpg",
  },
  {
    target: 50,
    suffix: "+",
    title: "Events designed & delivered",
    body: "Expos, festivals, roadshows and conferences — drawing to handover, one supplier.",
    img: "/k/num-03-events.jpg",
  },
  {
    target: 200,
    suffix: "+",
    title: "Qualified leads to sales teams",
    body: "Real buyers with purchasing capability — screened, not counted as clicks.",
    img: "/k/num-04-leads.jpg",
  },
];

/**
 * The landing page strip. Twelve builds picked to span every kind of work,
 * landscape framing first because the strip crops to 16/11.
 */
export const GROUND = [
  { img: "/k/ground/event-expo-hall.jpg", caption: "Expo hall, backlit stands" },
  { img: "/k/ground/stand-aisle-long.jpg", caption: "Aisle takeover, hypermarket" },
  {
    img: "/k/ground/signage-police-academy.jpg",
    caption: "Academy signage, illuminated",
  },
  {
    img: "/k/ground/event-ballroom-ceiling.jpg",
    caption: "Ballroom ceiling installation",
  },
  {
    img: "/k/ground/production-awards-wall.jpg",
    caption: "Awards backdrop and stage set",
  },
  { img: "/k/ground/school-display-wall.jpg", caption: "School display wall" },
  {
    img: "/k/ground/event-expo-stands.jpg",
    caption: "Expo stands, built and installed",
  },
  {
    img: "/k/ground/production-facade-emblem.jpg",
    caption: "Facade emblem and lettering",
  },
  { img: "/k/ground/stand-aisle-snacks.jpg", caption: "Snack aisle branding" },
  { img: "/k/ground/signage-barracks.jpg", caption: "Channel letters, lit" },
  { img: "/k/ground/signage-the-corner.jpg", caption: "Storefront sign" },
  {
    img: "/k/ground/event-exhibition-floor.jpg",
    caption: "Exhibition floor, multiple stands",
  },
];

/**
 * The /on-the-ground page, in the categories the archive is filed under.
 * Captions describe what is in the frame; location labels are the client's own.
 */
export const GROUND_SETS = [
  {
    slug: "stands",
    label: "Retail stands",
    body: "Gondola ends, full aisle takeovers and illuminated display bays. Measured in store, built in our workshop and installed overnight so the doors open on time.",
    shots: [
      { img: "/k/ground/stand-aisle-long.jpg", caption: "Full aisle, overhead band" },
      { img: "/k/ground/stand-aisle-snacks.jpg", caption: "Snack aisle, printed header" },
      { img: "/k/ground/stand-aisle-floor.jpg", caption: "Floor graphic and shelf strips" },
      { img: "/k/ground/stand-aisle-petcare.jpg", caption: "Pet care aisle takeover" },
      { img: "/k/ground/stand-aisle-bakery.jpg", caption: "Bakery aisle, branded gondola" },
      { img: "/k/ground/stand-union-barsha-3.jpg", caption: "Union Barsha, lit display bay" },
      { img: "/k/ground/stand-union-barsha-2.jpg", caption: "Union Barsha, tea and beverages" },
      { img: "/k/ground/stand-union-barsha-4.jpg", caption: "Union Barsha, end bay" },
      { img: "/k/ground/stand-union-barsha-1.jpg", caption: "Union Barsha, aisle front" },
      { img: "/k/ground/stand-union-hamriya-1.jpg", caption: "Union Hamriya, display bay" },
      { img: "/k/ground/stand-union-hamriya-2.jpg", caption: "Union Hamriya, shelf units" },
      { img: "/k/ground/stand-union-jumeirah-1.jpg", caption: "Union Jumeirah, display bay" },
      { img: "/k/ground/stand-union-jumeirah-2.jpg", caption: "Union Jumeirah, aisle run" },
      { img: "/k/ground/stand-sharjah-qurain-1.jpg", caption: "Sharjah Qurain, lit bay" },
      { img: "/k/ground/stand-sharjah-qurain-2.jpg", caption: "Sharjah Qurain, beauty unit" },
      { img: "/k/ground/stand-sharjah-halwan.jpg", caption: "Sharjah Halwan, lit bay" },
      { img: "/k/ground/stand-lulu-khalidiya-3.jpg", caption: "Lulu Khalidiya, aisle takeover" },
      { img: "/k/ground/stand-lulu-khalidiya-1.jpg", caption: "Lulu Khalidiya, floor graphic" },
      { img: "/k/ground/stand-lulu-khalidiya-2.jpg", caption: "Lulu Khalidiya, aisle run" },
      { img: "/k/ground/stand-lulu-qusais-1.jpg", caption: "Lulu Qusais, aisle takeover" },
      { img: "/k/ground/stand-lulu-qusais-2.jpg", caption: "Lulu Qusais, floor graphic" },
      { img: "/k/ground/stand-lulu-wahda-1.jpg", caption: "Lulu Wahda, aisle takeover" },
    ],
  },
  {
    slug: "events",
    label: "Events & exhibitions",
    body: "Expo halls, conventions and awards nights. Stand, stage, ceiling and floor delivered as one package, on a schedule that does not move.",
    shots: [
      { img: "/k/ground/event-expo-hall.jpg", caption: "Expo hall, backlit stands" },
      { img: "/k/ground/event-exhibition-floor.jpg", caption: "Exhibition floor, multiple stands" },
      { img: "/k/ground/event-expo-stands.jpg", caption: "Expo stands, built and installed" },
      { img: "/k/ground/event-ballroom-ceiling.jpg", caption: "Ballroom ceiling installation" },
      { img: "/k/ground/event-awards-plinths.jpg", caption: "Awards night, plinth layout" },
      { img: "/k/ground/event-floral-letters.jpg", caption: "Convention letters, floral finish" },
    ],
  },
  {
    slug: "production",
    label: "Production",
    body: "Facade emblems, landmark letters and printed walls. Cut, welded, printed and finished in house, then installed by the same team that made them.",
    shots: [
      { img: "/k/ground/production-awards-wall.jpg", caption: "Awards backdrop, printed wall" },
      { img: "/k/ground/production-facade-emblem.jpg", caption: "Facade emblem and lettering" },
      { img: "/k/ground/production-landmark-letters.jpg", caption: "Landmark letters, waterfront" },
      { img: "/k/ground/production-facade-cladding.jpg", caption: "Facade cladding and identification" },
    ],
  },
  {
    slug: "signage",
    label: "Signage",
    body: "Channel letters, backlit lettering and building identification. Designed to read as well at night as at noon.",
    shots: [
      { img: "/k/ground/signage-police-academy.jpg", caption: "Dubai Police Academy, illuminated" },
      { img: "/k/ground/signage-barracks.jpg", caption: "Channel letters, Arabic and English" },
      { img: "/k/ground/signage-the-corner.jpg", caption: "Storefront sign, The Corner" },
    ],
  },
  {
    slug: "schools",
    label: "Schools & institutions",
    body: "Corridor displays, honour walls and framed installations. Quiet work that has to survive a thousand pupils a day.",
    shots: [
      { img: "/k/ground/school-display-wall.jpg", caption: "Curved display wall, corridor" },
      { img: "/k/ground/school-honour-wall.jpg", caption: "Honour wall, framed panels" },
      { img: "/k/ground/school-stair-gallery.jpg", caption: "Stair gallery, framed prints" },
    ],
  },
  {
    slug: "3d",
    label: "3D & visualisation",
    body: "Every build starts as a drawing. We render the structure before anything is cut, so what is signed off is what gets installed.",
    shots: [
      { img: "/k/ground/render-canopy.jpg", caption: "Canopy structure, concept render" },
      { img: "/k/ground/render-majlis.jpg", caption: "Majlis interior, concept render" },
      { img: "/k/ground/render-admin-building.jpg", caption: "Admin building, concept render" },
      { img: "/k/ground/render-villa.jpg", caption: "Villa facade, concept render" },
      { img: "/k/ground/render-compound.jpg", caption: "Compound elevation, concept render" },
    ],
  },
];

/**
 * The brand wall. `featured` names carry an accent-tinted outline so the
 * newer marquee logos read differently from the back catalogue.
 */
export const CLIENTS: { name: string; sector: string; featured?: boolean }[] = [
  { name: "Samsung", sector: "Electronics" },
  { name: "Unilever", sector: "FMCG" },
  { name: "Nike", sector: "Sportswear" },
  { name: "Emirates", sector: "Aviation" },
  { name: "Etihad", sector: "Aviation" },
  { name: "Chevrolet", sector: "Automotive" },
  { name: "Huawei", sector: "Technology" },
  { name: "Gillette", sector: "FMCG" },
  { name: "GSK", sector: "Healthcare" },
  { name: "Nickelodeon", sector: "Media" },
  { name: "Kellogg's", sector: "FMCG" },
  { name: "Castrol", sector: "Automotive" },
  { name: "Pringles", sector: "FMCG" },
  { name: "Sensodyne", sector: "Healthcare" },
  { name: "Adidas", sector: "Sportswear" },
  { name: "Ooredoo", sector: "Telecom" },
  { name: "Meraas", sector: "Real estate" },
  { name: "DEWA", sector: "Utilities" },
  { name: "Pedigree", sector: "Pet care" },
  { name: "Whiskas", sector: "Pet care" },
  { name: "RAKBANK", sector: "Banking" },
  { name: "Fox Movies", sector: "Media" },
  { name: "MK Properties", sector: "Real estate" },
  { name: "Irfan Investment", sector: "Investment" },
  { name: "JW Marriott", sector: "Hospitality", featured: true },
  { name: "Shangri-La", sector: "Hospitality", featured: true },
  { name: "Bentley", sector: "Automotive", featured: true },
  { name: "Lamborghini", sector: "Automotive", featured: true },
  { name: "Ferrari", sector: "Automotive", featured: true },
  { name: "Bank Dhofar", sector: "Banking", featured: true },
  { name: "OQ", sector: "Energy", featured: true },
];

/** Rows the brand wall splits into; names are dealt out round-robin. */
export const WALL_ROWS = 4;

/** Headline figure for the tally. The wall itself names a subset of these. */
export const BRAND_COUNT = 40;

