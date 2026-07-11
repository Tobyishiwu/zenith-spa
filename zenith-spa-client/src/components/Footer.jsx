import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaLinkedinIn,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "Therapists", href: "/therapists" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/#contact" },
];

const SERVICES = [
  "Swedish Massage ",
  "Deep Tissue Massage",
  "Hot Stone Therapy",
  "Luxury Facial",
  "Couples Spa Retreat",
];

const SOCIALS = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTiktok, href: "#", label: "TikTok" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const FooterHeading = ({ children }) => (
  <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
    {children}
  </h3>
);

const FooterLink = ({ href, children, external }) => {
  const cls = "text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-teal-600";
  if (external || href.startsWith("/#")) {
    return <a href={href} className={cls}>{children}</a>;
  }
  return <Link to={href} className={cls}>{children}</Link>;
};

const Footer = () => {
  return (
    <footer className="bg-[#FAF9F6] border-t border-stone-200/40">

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand — spans 2 cols on large */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block text-xl font-light tracking-[0.2em] text-stone-900 uppercase">
              Zenith <span className="font-semibold text-teal-600">Spa</span>
            </Link>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-600/90">
              AI-Powered Worldwide Wellness Platform
            </p>
            <p className="mt-5 max-w-xs text-xs leading-6 text-stone-500 font-normal">
              A premium global network designed to recommend verified local specialists providing luxury therapeutic experiences right to your chosen venue. Experience seamless mobile spa care at home, your hotel suite, workspace, or private location.
            </p>
            
            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-400 shadow-sm ring-1 ring-stone-200/60 transition-all duration-200 hover:scale-105 hover:bg-stone-50 hover:text-teal-600"
                >
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <FooterLink href={link.href}>{link.name}</FooterLink>
                </li>
              ))}
              <li>
                <Link to="/track-booking" className="text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-teal-600">
                  Track Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <FooterHeading>Signature Services</FooterHeading>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-teal-600">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Areas */}
          <div className="space-y-10">
            <div>
              <FooterHeading>Contact</FooterHeading>
              <ul className="space-y-3">
                <li>
                  <a href="tel:+13105550000" aria-label="Call us" className="flex items-center gap-2.5 text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-teal-600">
                    <FaPhoneAlt size={10} className="flex-shrink-0 text-stone-400" />
                    (310) 555-0000
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/13105550000" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex items-center gap-2.5 text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-teal-600">
                    <FaWhatsapp size={11} className="flex-shrink-0 text-stone-400" />
                    WhatsApp Concierge
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@zenithspa.com" aria-label="Email us" className="flex items-center gap-2.5 text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-teal-600">
                    <FaEnvelope size={10} className="flex-shrink-0 text-stone-400" />
                    hello@zenithspa.com
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-2.5 text-xs text-stone-500 font-normal">
                    <FaMapMarkerAlt size={11} className="mt-0.5 flex-shrink-0 text-stone-400" />
                    <span>
                      Worldwide Deliveries
                      <br />
                      Flexible Venues
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <FooterHeading>Why Zenith Spa</FooterHeading>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-xs text-stone-500 font-normal">
                  <span className="h-1 w-1 rounded-full bg-teal-500/70" />
                  Intelligent Therapist Matching
                </li>
                <li className="flex items-center gap-2 text-xs text-stone-500 font-normal">
                  <span className="h-1 w-1 rounded-full bg-teal-500/70" />
                  Worldwide Network Coverage
                </li>
                <li className="flex items-center gap-2 text-xs text-stone-500 font-normal">
                  <span className="h-1 w-1 rounded-full bg-teal-500/70" />
                  Verified Elite Practitioners
                </li>
                <li className="flex items-center gap-2 text-xs text-stone-500 font-normal">
                  <span className="h-1 w-1 rounded-full bg-teal-500/70" />
                  Smart Booking Experience
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-200/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-[11px] text-stone-400 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Zenith Spa. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy" className="transition-colors hover:text-teal-600">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-teal-600">Terms of Service</Link>
          </div>
          <p className="text-stone-400/80 tracking-wide uppercase text-[9px] font-semibold">
            Global Mobile Wellness
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;