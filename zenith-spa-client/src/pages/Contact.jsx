import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaCalendarCheck,
  FaBolt,
  FaUserTie,
  FaStar,
  FaChevronDown,
} from "react-icons/fa";

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Browse our therapists or services, select your preferred option, and complete the booking form. You will receive a booking reference immediately after submission.",
  },
  {
    q: "How do I upload my payment proof?",
    a: "After submitting your booking, you will be taken to the payment page where you can upload a screenshot or photo of your payment receipt for our team to verify.",
  },
  {
    q: "Can I choose my therapist?",
    a: "Yes. You can browse all available therapists, view their profiles and specializations, and select the one that best fits your needs before completing your booking.",
  },
  {
    q: "How do I track my booking?",
    a: "Use your booking reference on the Track Booking page to view your appointment status, payment verification progress, and download your confirmation PDF once approved.",
  },
  {
    q: "Can I reschedule my appointment?",
    a: "Yes. Contact our support team via WhatsApp or email with your booking reference and your preferred new date and time. We will do our best to accommodate your request.",
  },
];

const CONTACT_CARDS = [
  {
    icon: FaPhoneAlt,
    title: "Call Us",
    lines: ["Available daily", "Response within minutes"],
    action: { label: "Call Now", href: "tel:+10000000000" },
    accent: "bg-teal-50 text-teal-700 ring-teal-100",
    iconBg: "bg-teal-100 text-teal-700",
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    lines: ["Chat instantly", "Send photos and questions"],
    action: { label: "Message Us", href: "https://wa.me/10000000000", external: true },
    accent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: FaEnvelope,
    title: "Email",
    lines: ["hello@zenithspa.com", "We reply within 24 hours"],
    action: { label: "Send Email", href: "mailto:hello@zenithspa.com" },
    accent: "bg-amber-50 text-amber-700 ring-amber-100",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    icon: FaCalendarCheck,
    title: "Availability",
    lines: ["Available Daily", "Flexible Scheduling", "Appointment Based"],
    action: { label: "Book Now", href: "/booking", internal: true },
    accent: "bg-stone-50 text-stone-700 ring-stone-100",
    iconBg: "bg-stone-100 text-stone-600",
  },
];

const WHY_CARDS = [
  {
    icon: FaBolt,
    title: "Fast Response",
    description: "Our team responds to all enquiries promptly. Most messages are answered within minutes during operating hours.",
  },
  {
    icon: FaUserTie,
    title: "Professional Support",
    description: "Every enquiry is handled with the discretion and care you would expect from a luxury wellness brand.",
  },
  {
    icon: FaStar,
    title: "Personalized Assistance",
    description: "We tailor every interaction to your individual needs, whether you have a simple question or want to plan a private event.",
  },
];

const SUBJECTS = [
  "General Enquiry",
  "Booking Assistance",
  "Corporate Wellness",
  "Private Event Planning",
  "Payment Support",
  "Other",
];

const inputCls = "w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3.5 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100";

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => e.preventDefault();
  const toggleFaq = (i) => setOpenFaq((prev) => (prev === i ? null : i));

  return (
    <div className="min-h-screen bg-[#F8F6F2]">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-stone-900 pb-20 pt-40">
        <img
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1800&q=80"
          alt="Zenith Spa"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-300">
            Contact Us
          </span>
          <h1 className="mt-6 text-4xl font-light leading-tight text-white md:text-6xl">
            {"Let\u2019s Create Your Perfect"}
            <br />
            <span className="font-semibold text-teal-300">Wellness Experience</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-300">
            Whether you are booking your next spa experience, planning a private wellness event, or simply have a question, our team is ready to help.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/booking" className="rounded-2xl bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-lg">
              Book Appointment
            </Link>
            <Link to="/therapists" className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
              Meet Our Therapists
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Get In Touch</p>
          <h2 className="mt-3 text-3xl font-light text-stone-900 md:text-4xl">
            {"We\u2019re Here When You Need Us"}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map(({ icon: Icon, title, lines, action, iconBg }) => (
            <div key={title} className="flex flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-stone-100 transition hover:-translate-y-1 hover:shadow-md">
              <div className={"mb-5 flex h-12 w-12 items-center justify-center rounded-2xl " + iconBg}>
                <Icon size={18} />
              </div>
              <h3 className="text-base font-bold text-stone-900">{title}</h3>
              <div className="mt-2 flex-1 space-y-1">
                {lines.map((l) => <p key={l} className="text-sm text-stone-500">{l}</p>)}
              </div>
              <div className="mt-6">
                {action.internal ? (
                  <Link to={action.href} className="text-sm font-semibold text-teal-700 transition hover:text-teal-800">
                    {action.label} →
                  </Link>
                ) : (
                  <a href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}
                    className="text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                  >
                    {action.label} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT FORM ──────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Send a Message</p>
            <h2 className="mt-3 text-3xl font-light text-stone-900 md:text-4xl">{"We\u2019d Love to Hear From You"}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-500">
              Fill in the form below and our team will respond as soon as possible.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" className={inputCls} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className={inputCls}>
                <option value="">Select a subject...</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us how we can help..." className={inputCls + " resize-none"} />
            </div>
            <button type="submit" className="w-full rounded-2xl bg-teal-700 py-4 text-sm font-bold text-white transition hover:bg-teal-800 hover:shadow-lg active:scale-[0.99]">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ── WHY CONTACT ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Why Zenith Spa</p>
          <h2 className="mt-3 text-3xl font-light text-stone-900 md:text-4xl">The Zenith Difference</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {WHY_CARDS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100 transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">FAQ</p>
            <h2 className="mt-3 text-3xl font-light text-stone-900 md:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={"overflow-hidden rounded-2xl border transition-all duration-200 " + (open ? "border-teal-200 bg-teal-50/40" : "border-stone-100 bg-white")}>
                  <button
                    onClick={() => toggleFaq(i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className={"text-sm font-semibold transition-colors " + (open ? "text-teal-700" : "text-stone-800")}>
                      {faq.q}
                    </span>
                    <FaChevronDown
                      size={12}
                      className={"flex-shrink-0 text-stone-400 transition-transform duration-200 " + (open ? "rotate-180 text-teal-600" : "")}
                    />
                  </button>
                  {open && (
                    <div className="px-6 pb-5">
                      <p className="text-sm leading-7 text-stone-500">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-stone-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Book Today</p>
          <h2 className="mt-4 text-3xl font-light text-white md:text-5xl">
            Ready to Experience
            <br />
            <span className="font-semibold text-teal-300">Luxury Wellness?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-8 text-stone-400">
            Book your personalized spa experience today.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/booking" className="rounded-2xl bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-lg">
              Book Appointment
            </Link>
            <Link to="/services" className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
              Browse Treatments
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
