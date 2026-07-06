export const services = [
  {
    id: 1,
    slug: "swedish-massage",
    name: "Swedish Massage",
    subtitle: "Relax · Restore · Recharge",
    category: "Massage",
    description:
      "A calming full-body massage that eases muscle tension, improves circulation, and promotes deep relaxation through long, flowing strokes and gentle kneading.",
    duration: "60 – 90 Minutes",
    startingPrice: 120,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    slug: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    subtitle: "Release · Rebuild · Recover",
    category: "Massage",
    description:
      "Designed to target chronic muscle tension and relieve deep-seated pain through firm therapeutic pressure on the deeper layers of muscle and connective tissue.",
    duration: "60 – 90 Minutes",
    startingPrice: 150,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    slug: "hot-stone-therapy",
    name: "Hot Stone Therapy",
    subtitle: "Warm · Ground · Restore",
    category: "Massage",
    description:
      "Smooth heated basalt stones melt away stress, restore balance, and penetrate deep muscle tissue to produce a level of release that hands alone cannot achieve.",
    duration: "90 Minutes",
    startingPrice: 170,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    slug: "aromatherapy",
    name: "Aromatherapy Massage",
    subtitle: "Sense · Soothe · Elevate",
    category: "Massage",
    description:
      "An immersive sensory ritual blending the healing intelligence of pure essential oils with expert massage technique to balance mood and nourish the skin.",
    duration: "60 Minutes",
    startingPrice: 135,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    slug: "facial-treatment",
    name: "Luxury Facial",
    subtitle: "Clarify · Hydrate · Glow",
    category: "Facial",
    description:
      "Revitalize tired skin with a bespoke nourishing facial — deep cleanse, exfoliation, targeted serums, and a relaxing facial massage — tailored to your skin on the day.",
    duration: "60 Minutes",
    startingPrice: 110,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    slug: "body-scrub",
    name: "Body Scrub & Polish",
    subtitle: "Exfoliate · Renew · Illuminate",
    category: "Body Treatment",
    description:
      "A full-body exfoliation ritual using mineral and botanical scrubs to remove dead skin cells, stimulate circulation, and leave skin impeccably smooth and luminous.",
    duration: "45 Minutes",
    startingPrice: 100,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    slug: "couples-retreat",
    name: "Couples Spa Retreat",
    subtitle: "Connect · Unwind · Together",
    category: "Wellness Package",
    description:
      "Share a luxurious spa experience in a private suite for two, with dual therapists working simultaneously and each guest selecting their preferred treatment style.",
    duration: "90 Minutes",
    startingPrice: 250,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    slug: "prenatal-massage",
    name: "Prenatal Massage",
    subtitle: "Nurture · Support · Comfort",
    category: "Massage",
    description:
      "A gentle massage specially tailored to support comfort, relaxation, and wellbeing during pregnancy — easing back pain, reducing swelling, and improving sleep.",
    duration: "60 Minutes",
    startingPrice: 125,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  },
];

export default services;

export const getServiceBySlug = (slug) =>
  services.find((s) => s.slug === slug) || null;

export const getFeaturedServices = () => services.filter((s) => s.featured);

export const getCategories = () => [
  "All",
  ...Array.from(new Set(services.map((s) => s.category))),
];
