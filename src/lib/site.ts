// All business details and copy live here so they can be edited in one place.
// Copy is taken from the original ellacare.com (archived Jan 2026), lightly
// edited for spelling and clarity. Items marked TODO need owner confirmation.

export const site = {
  name: "EllaCare",
  legalName: "Ella Care LLC",
  tagline: "A quality alternative to a nursing home",
  kind: "Adult Family Home",
  slogan: "A home away from home",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellacare.com",
  address: {
    street: "2330 189th Place SW",
    city: "Lynnwood",
    region: "WA",
    postalCode: "98036",
  },
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=2330+189th+Place+SW,+Lynnwood,+WA+98036",
  // TODO: confirm which number should be primary. The old header listed
  // 425-551-8910 (cell); the footer and contact page listed 425-776-4026 (home).
  phones: {
    main: { label: "Main", display: "(425) 776-4026", tel: "+14257764026" },
    cell: { label: "Cell", display: "(425) 551-8910", tel: "+14255518910" },
    emergency: { label: "Emergency", display: "(408) 230-5565", tel: "+14082305565" },
    fax: { label: "Fax", display: "(425) 670-2037" },
  },
  // TODO: add the DSHS Adult Family Home license number, if you want it shown.
  licenseNumber: "",
};

export const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Care & Services" },
  { href: "/residences", label: "Our Home" },
  { href: "/dining", label: "Dining" },
  { href: "/activities", label: "Activities" },
  { href: "/safety", label: "Safety" },
];

export const highlights = [
  {
    title: "Round-the-clock care",
    body: "Monitoring, alerting and response 7 days a week, 24 hours a day, with a nurse on call at all times.",
  },
  {
    title: "Home-cooked meals",
    body: "Three fresh, home-cooked meals a day, with nutritious snacks available any time and menus tailored to each resident.",
  },
  {
    title: "Personal care",
    body: "Help with bathing, personal care and medication management from a caring, well-trained staff.",
  },
  {
    title: "A real home",
    body: "A quiet residential neighborhood in Lynnwood, with private and shared rooms, a sun room and outdoor space.",
  },
];

export const basicServices = [
  "24/7 monitoring, alerting and response",
  "Bathing and personal care",
  "Three home-cooked meals daily, plus snacks any time",
  "Medication management",
  "Full-time housekeeping",
  "Scheduled transportation",
  "Holiday and seasonal parties for residents and families",
];

export const medicalServices = [
  "Home doctor",
  "Nurse on call 24/7",
  "On-site visits from occupational and physical therapists",
  "Medication management",
];

export const activities = [
  "Arts and crafts: painting, drawing, pottery",
  "Quilting and sewing",
  "Scrapbooking",
  "Puzzles",
  "Games, cards and dominoes",
  "Gardening",
  "Movie nights",
  "Library visits",
  "Outdoor walks",
  "Birthday and holiday celebrations",
];

export type Room = { title: string; src: string; category: string };

// Photos from the original Residences page.
export const rooms: Room[] = [
  { title: "Bedroom one", src: "/images/rooms/room-4315.jpg", category: "Sleeping" },
  { title: "Bedroom two", src: "/images/rooms/room-4281.jpg", category: "Sleeping" },
  { title: "Bedroom three", src: "/images/rooms/room-4262.jpg", category: "Sleeping" },
  { title: "Bathroom", src: "/images/rooms/room-4266.jpg", category: "Bathing" },
  { title: "Shower", src: "/images/rooms/room-4268.jpg", category: "Bathing" },
  { title: "Bathroom and shower", src: "/images/rooms/room-4289.jpg", category: "Bathing" },
  { title: "Living room", src: "/images/rooms/room-4271.jpg", category: "Relaxing" },
  { title: "Dining room", src: "/images/rooms/room-4308.jpg", category: "Eating & cooking" },
  { title: "Kitchen", src: "/images/rooms/room-4305.jpg", category: "Eating & cooking" },
  { title: "Sun room", src: "/images/rooms/room-4275.jpg", category: "Relaxing" },
];

export const testimonials = [
  {
    quote:
      "Mom suffers from dementia/Alzheimer’s, and her deterioration has really been painful. We moved Mom to EllaCare in early June, and the improvement has been dramatic. It is really gratifying to see her more like her old self than she has been in some time. One big improvement is that EllaCare embraces new technology. Mom had pretty much stopped talking while on the phone, but once we started Skyping with her she seemed to recognize us and engage in some limited conversations. We now get to see her smile. She seems to really like the people and has taken a shine to Bee. She likes the food and seems to be a lot happier, so we are extremely glad we decided to have her stay there.",
    author: "Carol DeQuoy",
    relation: "Family of a resident",
    highlight: "We now get to see her smile.",
  },
];

export const faqs = [
  {
    q: "What is an adult family home?",
    a: "An adult family home is a licensed residential home that cares for a small number of adults. Residents get personal care, meals and supervision in a real house rather than an institution, which is why many families choose it as an alternative to a nursing home.",
  },
  {
    q: "Who is a good fit for EllaCare?",
    a: "We start with an interactive enrollment process: you and your loved one visit, meet our staff, and we talk through care needs together. That gives everyone a chance to decide whether EllaCare is the right home.",
  },
  {
    q: "Do you offer private rooms?",
    a: "Yes. We have both private and shared rooms, assigned based on availability and medical needs. We work closely with each resident to meet their room needs.",
  },
  {
    q: "Can families stay in touch?",
    a: "Absolutely. Every room has a private telephone (calls between 7 a.m. and 10 p.m.), and we help residents video call with family and friends. Visitors are always welcome. Please call ahead to set up a time.",
  },
  {
    q: "Can you accommodate language, hearing or vision needs?",
    a: "Yes. We assist residents who are hearing or vision impaired or who have limited English proficiency. Let us know your preferred form of communication, and if you need an interpreter we will arrange one.",
  },
  {
    q: "Is EllaCare smoke-free?",
    a: "Yes. Smoking is not allowed in or around the home. There is a designated outdoor smoking area.",
  },
];

// "At a glance" answers for the home page; each links to its detail page.
export const glance = [
  {
    key: "care",
    title: "24/7 care",
    body: "Round-the-clock monitoring, alerting and response, every day of the year.",
    href: "/services",
  },
  {
    key: "medical",
    title: "Nurse on call",
    body: "Nurse available 24/7, a home doctor, on-site OT/PT visits and medication management.",
    href: "/services#medical",
  },
  {
    key: "rooms",
    title: "Private & shared rooms",
    body: "Comfortable bedrooms, each with its own phone. Assigned by availability and medical needs.",
    href: "/residences",
  },
  {
    key: "meals",
    title: "Home-cooked meals",
    body: "Three fresh meals a day plus snacks any time, with menus tailored to each resident.",
    href: "/dining",
  },
  {
    key: "family",
    title: "Family stays close",
    body: "Visitors welcome by appointment, in-room phones and video calls with loved ones.",
    href: "/services#connected",
  },
  {
    key: "location",
    title: "Lynnwood, WA",
    body: "A quiet residential neighborhood in the heart of Lynnwood.",
    href: "/contact#visit",
  },
] as const;

export const trustPoints = ["24/7 care", "Nurse on call", "Private rooms", "Home-cooked meals"];
