export const services = [
  {
    id: 1,
    _id: "6a43aec54c45d71f214b4582",
    slug: "swedish-massage",
    name: "Swedish Massage",
    subtitle: "Relax · Restore · Recharge",
    category: "Massage",
    description:
      "An exquisite classic full-body therapy utilizing long, fluid strokes and meticulous kneading techniques to diminish muscle fatigue, optimize circulatory flow, and induce profound serenity.",
    duration: "60 – 90 Minutes",
    startingPrice: 25,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
  },
  {
  id: 2,
  _id: "6a51d2e26d770efd7d166626",
  slug: "erotic-massage",
  name: "Erotic Massage",
  subtitle: "Intimate · Relax · Rejuvenate",
  category: "Massage",
  description:
    "A luxurious relaxation experience designed to promote deep physical comfort, stress relief, and personalized wellness in a private, discreet setting with a professional therapist.",
  duration: "60 – 90 Minutes",
  startingPrice: 45,
  featured: true,
  image:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
},
  {
    id: 3,
    _id: "6a4a123b49cbb50230a0c206",
    slug: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    subtitle: "Release · Rebuild · Recover",
    category: "Massage",
    description:
      "A targeted therapeutic treatment that employs deliberate, high-intensity pressure to reach sub-dermal muscle layers and structural tissues, effectively dissolving chronic tension and structural discomfort.",
    duration: "60 – 90 Minutes",
    startingPrice: 35,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    _id: "6a4a123c49cbb50230a0c207",
    slug: "hot-stone-therapy",
    name: "Hot Stone Therapy",
    subtitle: "Warm · Ground · Restore",
    category: "Massage",
    description:
      "An ultra-premium thermal experience harnessing polished basalt stones crafted by nature to channel deep, penetrating heat into sore muscle groups, unraveling stress beyond the capabilities of traditional touch.",
    duration: "90 Minutes",
    startingPrice: 55,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    _id: "6a4a123c49cbb50230a0c208",
    slug: "aromatherapy",
    name: "Aromatherapy Massage",
    subtitle: "Sense · Soothe · Elevate",
    category: "Massage",
    description:
      "A multisensory restorative odyssey pairing custom-blended, organic botanical essences with specialized master massage strokes to balance cognitive state, calm the nervous system, and lavish the skin.",
    duration: "60 Minutes",
    startingPrice: 35,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    _id: "6a4a123d49cbb50230a0c209",
    slug: "facial-treatment",
    name: "Luxury Facial",
    subtitle: "Clarify · Hydrate · Glow",
    category: "Facial",
    description:
      "An advanced skin-refining treatment utilizing customized premium serums, careful exfoliation, and a sculpting facial massage to optimize hydration and cultivate a youthful, radiant visage.",
    duration: "60 Minutes",
    startingPrice: 40,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    _id: "6a4a123d49cbb50230a0c20a",
    slug: "body-scrub",
    name: "Body Scrub & Polish",
    subtitle: "Exfoliate · Renew · Illuminate",
    category: "Body Treatment",
    description:
      "An upscale full-body cell renewal ritual integrating mineral-rich compounds and premium botanicals to sweep away imperfections, enhance skin texturization, and unveil an incandescent, luminous glow.",
    duration: "45 Minutes",
    startingPrice: 30,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    _id: "6a4a123d49cbb50230a0c20b",
    slug: "couples-retreat",
    name: "Couples Spa Retreat",
    subtitle: "Connect · Unwind · Together",
    category: "Wellness Package",
    description:
      "An opulent, shared sanctuary experience tailored within an elite private suite. Two master therapists curate individualized paths of pure relaxation for both guests concurrently.",
    duration: "90 Minutes",
    startingPrice: 75,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 9,
    _id: "6a4a123e49cbb50230a0c20c",
    slug: "prenatal-massage",
    name: "Prenatal Massage",
    subtitle: "Nurture · Support · Comfort",
    category: "Massage",
    description:
      "A profoundly secure, expert-guided therapy designed exclusively for expectant mothers to alleviate physical stress points, minimize joint tension, and foster nurturing serenity.",
    duration: "60 Minutes",
    startingPrice: 40,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  },
];

export default services;

export const getServiceBySlug = (slug) =>
  services.find((service) => service.slug === slug) || null;

export const getFeaturedServices = () =>
  services.filter((service) => service.featured);

export const getCategories = () => [
  "All",
  ...new Set(services.map((service) => service.category)),
];