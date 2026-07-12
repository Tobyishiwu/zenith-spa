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
  FaArrowRight,
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
    iconBg: "bg-stone-50 text-stone-600 border border-stone-200/40",
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    lines: ["Chat instantly", "Send photos and questions"],
    action: { label: "Message Us", href: "https://wa.me/10000000000", external: true },
    iconBg: "bg-stone-50 text-stone-600 border border-stone-200/40",
  },
  {
    icon: FaEnvelope,
    title: "Email",
    lines: ["hello@zenithspa.com", "We reply within 24 hours"],
    action: { label: "Send Email", href: "mailto:hello@zenithspa.com" },
    iconBg: "bg-stone-50 text-stone-600 border border-stone-200/40",
  },
  {
    icon: FaCalendarCheck,
    title: "Availability",
    lines: ["Available Daily", "Flexible Scheduling", "Appointment Based"],
    action: { label: "Book Now", href: "/therapists", internal: true },
    iconBg: "bg-stone-50 text-stone-600 border border-stone-200/40",
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

const inputCls = "w-full rounded-xl border border-stone-200/60 bg-stone-50/50 px-5 py-3.5 text-xs text-stone-800 placeholder-stone-400 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500/10";

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => e.preventDefault();
  const toggleFaq = (i) => setOpenFaq((prev) => (prev === i ? null : i));

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased selection:bg-teal-50 selection:text-teal-800">

      {/* ── CLEAN LITE HERO SECTION ──────────────────────────────── */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden border-b border-stone-200/40 bg-white pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full z-10">
          <div className="max-w-4xl text-left">
            <h1 className="text-4xl font-light tracking-tight text-stone-900 sm:text-5xl lg:text-6xl leading-[1.2]">
              {"Let\u2019s Create Your Perfect"}
              <br />
              <span className="font-normal text-teal-600 font-serif italic tracking-normal">Wellness Experience</span>
            </h1>
            <p className="mt-6 text-sm leading-7 text-stone-500 max-w-xl font-light tracking-wide">
              Whether you are booking your next spa experience, planning a private wellness event, or simply have a question, our team is ready to help.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                to="/therapists" 
                className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all duration-200 hover:bg-black active:scale-98"
              >
                Book Appointment
              </Link>
              <Link 
                to="/therapists" 
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200/80 bg-stone-50 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-600 transition-all duration-200 hover:bg-stone-100"
              >
                Meet Our Therapists
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS SECTION ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">
            {"We\u2019re Here When You Need Us"}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map(({ icon: Icon, title, lines, action, iconBg }) => (
            <div key={title} className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/40 bg-white p-7 shadow-xs transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/10">
              <div>
                <div className={"mb-6 flex h-11 w-11 items-center justify-center rounded-xl " + iconBg}>
                  <Icon size={14} />
                </div>
                <h3 className="text-sm font-medium tracking-tight text-stone-900">{title}</h3>
                <div className="mt-3 space-y-1">
                  {lines.map((l) => (
                    <p key={l} className="text-xs font-light tracking-wide text-stone-500">{l}</p>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                {action.internal ? (
                  <Link to={action.href} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-teal-600 transition-all hover:gap-2 hover:text-teal-700">
                    {action.label} <FaArrowRight className="text-[9px]" />
                  </Link>
                ) : (
                  <a href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-teal-600 transition-all hover:gap-2 hover:text-teal-700"
                  >
                    {action.label} <FaArrowRight className="text-[9px]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT FORM SECTION ──────────────────────────────────── */}
      <section className="bg-white border-y border-stone-200/40 py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">{"We\u2019d Love to Hear From You"}</h2>
            <p className="mx-auto mt-3 max-w-md text-xs font-light leading-5 text-stone-500">
              Fill in the details below and our client relationships manager will connect with you shortly.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" className={inputCls} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Subject Of Enquiry</label>
              <select name="subject" value={form.subject} onChange={handleChange} className={inputCls}>
                <option value="">Select a subject...</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Detailed Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us how we can assist you..." className={inputCls + " resize-none"} />
            </div>
            <button 
              type="submit" 
              className="w-full rounded-xl bg-stone-900 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all duration-200 hover:bg-black active:scale-[0.99]"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ── THE ZENITH DIFFERENCE SECTION ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">The Zenith Difference</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {WHY_CARDS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group rounded-2xl border border-stone-200/40 bg-white p-7 shadow-xs transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/10">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-stone-50 text-teal-600 ring-1 ring-stone-200/30 transition duration-300 group-hover:bg-teal-600 group-hover:text-white">
                <Icon size={14} />
              </div>
              <h3 className="text-base font-medium tracking-tight text-stone-900 group-hover:text-teal-600 transition-colors duration-300">{title}</h3>
              <p className="mt-2.5 text-xs leading-5 tracking-wide text-stone-500 font-light">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ─────────────────────────────────── */}
      <section className="bg-white border-t border-stone-200/40 py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={"overflow-hidden rounded-xl border transition-all duration-300 " + (open ? "border-teal-200 bg-teal-50/20" : "border-stone-200/60 bg-white")}>
                  <button
                    onClick={() => toggleFaq(i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left outline-none"
                  >
                    <span className={"text-xs font-semibold tracking-wide transition-colors " + (open ? "text-teal-700" : "text-stone-800")}>
                      {faq.q}
                    </span>
                    <FaChevronDown
                      size={10}
                      className={"flex-shrink-0 text-stone-400 transition-transform duration-300 " + (open ? "rotate-180 text-teal-600" : "")}
                    />
                  </button>
                  {open && (
                    <div className="px-6 pb-4.5">
                      <p className="text-xs leading-5.5 text-stone-500 font-light tracking-wide">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLEAN DESIGN CTA SECTION ──────────────────────────────── */}
      <section className="bg-stone-50 border-t border-stone-200/40 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-light tracking-tight text-stone-900 sm:text-4xl">
            Ready to Experience <br />
            <span className="font-normal text-teal-600 font-serif italic tracking-normal">Luxury Wellness?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm leading-6 text-stone-500 font-light tracking-wide">
            Book your personalized spa experience today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/therapists" 
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all duration-200 hover:bg-black active:scale-98"
            >
              Book Appointment
            </Link>
            <Link 
              to="/services" 
              className="inline-flex items-center gap-1 border border-stone-200/80 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500 rounded-xl transition-all duration-200 hover:bg-stone-50"
            >
              Browse Treatments
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;