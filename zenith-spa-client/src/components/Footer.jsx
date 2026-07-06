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
  FaHeart,
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
  <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
    {children}
  </h3>
);

const FooterLink = ({ href, children, external }) => {
  const cls = "text-sm text-stone-500 transition-colors duration-200 hover:text-teal-600";
  if (external || href.startsWith("/#")) {
    return <a href={href} className={cls}>{children}</a>;
  }
  return <Link to={href} className={cls}>{children}</Link>;
};

const Footer = () => {
  return (
    <footer className="bg-[#F5F3EF] border-t border-stone-200">

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand — spans 2 cols on large */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block text-2xl font-black tracking-tight">
              <span className="text-teal-700">Zenith</span>
              <span className="text-amber-500">Spa</span>
            </Link>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
              Luxury Mobile Spa Experience
            </p>
            <p className="mt-5 max-w-xs text-sm leading-7 text-stone-500">
  Luxury wellness experiences delivered wherever you are. From in-home spa treatments to hotel visits, corporate wellness, and private events, Zenith Spa brings relaxation directly to you.
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-stone-500 shadow-sm ring-1 ring-stone-200 transition-all duration-200 hover:scale-110 hover:bg-teal-700 hover:text-white hover:ring-teal-700"
                >
                  <Icon size={14} />
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
                <Link to="/track-booking" className="text-sm text-stone-500 transition-colors duration-200 hover:text-teal-600">
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
                  <Link to="/services" className="text-sm text-stone-500 transition-colors duration-200 hover:text-teal-600">
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
                  <a href="tel:+13105550000" aria-label="Call us" className="flex items-center gap-2.5 text-sm text-stone-500 transition-colors duration-200 hover:text-teal-600">
                    <FaPhoneAlt size={12} className="flex-shrink-0 text-teal-500" />
                    (310) 555-0000
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/13105550000" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex items-center gap-2.5 text-sm text-stone-500 transition-colors duration-200 hover:text-teal-600">
                    <FaWhatsapp size={13} className="flex-shrink-0 text-teal-500" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@zenithspa.com" aria-label="Email us" className="flex items-center gap-2.5 text-sm text-stone-500 transition-colors duration-200 hover:text-teal-600">
                    <FaEnvelope size={12} className="flex-shrink-0 text-teal-500" />
                    hello@zenithspa.com
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-2.5 text-sm text-stone-500">
                    <FaMapMarkerAlt size={13} className="mt-0.5 flex-shrink-0 text-teal-500" />
<span>
  Available by Appointment
  <br />
  Flexible Scheduling
</span>               </div>
                </li>
              </ul>
            </div>

            <div>
  <FooterHeading>Why Choose Zenith Spa</FooterHeading>

  <ul className="space-y-3">

    <li className="flex items-center gap-2 text-sm text-stone-500">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
      Luxury Mobile Spa
    </li>

    <li className="flex items-center gap-2 text-sm text-stone-500">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
      Professional Therapists
    </li>

    <li className="flex items-center gap-2 text-sm text-stone-500">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
      Personalized Treatments
    </li>

    <li className="flex items-center gap-2 text-sm text-stone-500">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
      Seamless Booking Experience
    </li>

  </ul>
</div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-stone-400 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Zenith Spa. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition-colors hover:text-teal-600">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-teal-600">Terms of Service</Link>
          </div>
          <p className="flex items-center gap-1">
Made with ❤️ for Wellness          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
