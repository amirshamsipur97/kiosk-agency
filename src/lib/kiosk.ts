/**
 * Content for the 2026 KIOSK homepage.
 * Single source of truth for every section — copy, links and image paths.
 */

export const CONTACT = {
  phone: "+968 9816 5570",
  phoneIntl: "96898165570",
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
  { label: "Films", href: "#films", n: "01" },
  { label: "Services", href: "#services", n: "02" },
  { label: "On the ground", href: "#ground", n: "03" },
  { label: "Clients", href: "#clients", n: "04" },
  { label: "Contact", href: "#contact", n: "05" },
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

/* Images the hero trail cycles through, in the reference order. */
export const TRAIL = [
  "/k/film-04-old-new-oman.jpg",
  "/k/film-05-podcasts.jpg",
  "/k/feed-b-02.jpg",
  "/k/feed-a-03.jpg",
  "/k/feed-a-05.jpg",
  "/k/feed-b-04.jpg",
  "/k/feed-a-01.jpg",
  "/k/feed-a-02.jpg",
  "/k/feed-b-01.jpg",
  "/k/feed-a-04.jpg",
  "/k/feed-a-06.jpg",
  "/k/feed-b-05.jpg",
];

export const FILMS = [
  {
    idx: "/01",
    title: "Discover Muscat",
    meta: "Destination film · 156K views",
    href: "https://youtu.be/Cx-1w3IX5z8",
    cursor: "Watch",
    img: "/k/film-01-discover-muscat.jpg",
  },
  {
    idx: "/02",
    title: "Zunairah",
    meta: "Luxury property film",
    href: "https://youtu.be/AntUHPNAXM4",
    cursor: "Watch",
    img: "/k/film-02-zunairah.jpg",
  },
  {
    idx: "/03",
    title: "The Arc",
    meta: "Sustainability film",
    href: "https://youtu.be/mqQrEnULK14",
    cursor: "Watch",
    img: "/k/film-03-the-arc.jpg",
  },
  {
    idx: "/04",
    title: "Old → New Oman",
    meta: "Brand storytelling",
    href: "https://youtu.be/bm-v8OEZeV4",
    cursor: "Watch",
    img: "/k/film-04-old-new-oman.jpg",
  },
  {
    idx: "/05",
    title: "The Podcasts",
    meta: "96K+ views · series",
    href: CONTACT.instagram,
    cursor: "Listen",
    img: "/k/film-05-podcasts.jpg",
  },
];

/* Two counter-scrolling photo rows. Each is rendered twice for a seamless loop. */
export const FEED_A = [
  "/k/feed-a-01.jpg",
  "/k/feed-a-02.jpg",
  "/k/feed-a-03.jpg",
  "/k/feed-a-04.jpg",
  "/k/feed-a-05.jpg",
  "/k/feed-a-06.jpg",
];

export const FEED_B = [
  "/k/feed-b-01.jpg",
  "/k/feed-b-02.jpg",
  "/k/feed-b-03.jpg",
  "/k/feed-b-04.jpg",
  "/k/feed-b-05.jpg",
  "/k/film-04-old-new-oman.jpg",
];

export const SERVICES = [
  {
    idx: "/01",
    title: "Creative strategy",
    body: "Research, audience analysis and campaign planning — before any budget is spent.",
    arm: "Online",
  },
  {
    idx: "/02",
    title: "Films & content",
    body: "Commercial films, social videos, podcasts and photography — end-to-end production.",
    arm: "Online",
  },
  {
    idx: "/03",
    title: "Performance ads",
    body: "Meta, Google and YouTube campaigns built for qualified inquiries, not clicks.",
    arm: "Online",
  },
  {
    idx: "/04",
    title: "Social & CRM",
    body: "Publishing, community, WhatsApp funnels and lead qualification for sales teams.",
    arm: "Online",
  },
  {
    idx: "/05",
    title: "Stands & exhibitions",
    body: "Expo booths, mall stands and podiums — designed, fabricated and installed in-house.",
    arm: "Ground",
  },
  {
    idx: "/06",
    title: "Activations & retail",
    body: "Roadshows, POSM, in-store displays and brand experiences that move product.",
    arm: "Ground",
  },
  {
    idx: "/07",
    title: "Signage & branding",
    body: "Indoor and outdoor signage, LED, stage sets, wraps, uniforms and giveaways.",
    arm: "Ground",
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

export const CLIENTS = [
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
  { name: "Irfan Investment", sector: "Real estate" },
];

export const PROJECT_CHIPS = [
  { label: "Campaign", value: "a campaign" },
  { label: "Event / stand", value: "an event or exhibition stand" },
  { label: "Films & content", value: "films and content production" },
  { label: "Full retainer", value: "a full monthly retainer" },
];
