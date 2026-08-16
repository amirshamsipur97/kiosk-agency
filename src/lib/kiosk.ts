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
  { label: "On the ground", href: "#ground", n: "04" },
  { label: "Contact", href: "#contact", n: "05" },
  // The only long-form content on the site today; still the pre-2026 design.
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

/** `arm` is the Online / Ground badge the landing page rows carry. */
export const SERVICES = [
  {
    idx: "/01",
    title: "Creative strategy",
    arm: "Online",
    body: "We turn business goals into clear creative direction, campaign concepts, and stronger brand communication.",
    img: "/k/feed/irfan-investment.jpg",
  },
  {
    idx: "/02",
    title: "Films & content",
    arm: "Online",
    body: "We create films, photography, and digital content designed to capture attention and tell your brand story.",
    img: "/k/feed/juva-1.jpg",
  },
  {
    idx: "/03",
    title: "Performance ads",
    arm: "Online",
    body: "We build performance-driven campaigns focused on brand awareness, qualified lead generation, and measurable growth.",
    img: "/k/feed/mk-properties-2.jpg",
  },
  {
    idx: "/04",
    title: "Stands & exhibitions",
    arm: "Ground",
    body: "We design and build exhibition stands that bring your brand to life in physical spaces.",
    img: "/k/build-02-exhibition-arena.jpg",
  },
  {
    idx: "/05",
    title: "Activations & retail",
    arm: "Ground",
    body: "We create brand activations and retail experiences that turn spaces into memorable customer interactions.",
    img: "/k/build-08-instore-retail.jpg",
  },
  {
    idx: "/06",
    title: "Signage & branding",
    arm: "Ground",
    body: "We create visual identities and signage systems that make your brand consistent and recognizable across every touchpoint.",
    img: "/k/build-11-office-branding.jpg",
  },
  {
    idx: "/07",
    title: "Web & CRM",
    arm: "Online",
    body: "Websites and CRM solutions designed to capture leads, organize customer data, and support business growth.",
    img: "/k/feed/mk-properties-4.jpg",
  },
  {
    idx: "/08",
    title: "Social media management",
    arm: "Online",
    body: "We manage your social media from planning and publishing to audience engagement, keeping your brand active, consistent, and connected.",
    img: "/k/feed/movenpick-1.jpg",
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

export const GROUND = [
  { img: "/k/num-02-builds.jpg", caption: "Expo booth — gaming" },
  { img: "/k/build-02-exhibition-arena.jpg", caption: "Exhibition arena build" },
  {
    img: "/k/build-03-mall-display-automotive.jpg",
    caption: "Mall display — automotive",
  },
  { img: "/k/build-04-ticketing-units.jpg", caption: "Ticketing & event units" },
  { img: "/k/num-01-years.jpg", caption: "Stage & conference set" },
  { img: "/k/num-03-events.jpg", caption: "Outdoor festival build" },
  { img: "/k/num-04-leads.jpg", caption: "Outdoor brand activation" },
  { img: "/k/build-08-instore-retail.jpg", caption: "In-store retail activation" },
  { img: "/k/build-09-posm-pallet.jpg", caption: "POSM — pallet display" },
  { img: "/k/build-10-retail-pillars.jpg", caption: "Custom retail pillars" },
  { img: "/k/build-11-office-branding.jpg", caption: "Office & venue branding" },
  { img: "/k/build-12-giveaways.jpg", caption: "Promotional giveaways" },
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

