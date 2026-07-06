import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Therapists", href: "/therapists" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);
  const handleBook = () => { close(); navigate("/booking"); };

  // Text is always dark — navbar overlays a light hero background
  const getDesktopLinkClass = (isActive) => {
    const base = "relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-teal-600 after:transition-transform after:duration-300 hover:after:scale-x-100";
    if (isActive) return base + " text-teal-700 after:scale-x-100";
    return base + " text-gray-700 hover:text-teal-700";
  };

  const getMobileLinkClass = (isActive) => {
    const base = "block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors duration-150";
    if (isActive) return base + " bg-teal-50 text-teal-700";
    return base + " text-gray-700 hover:bg-gray-50 hover:text-teal-700";
  };

  const anchorClass = "text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-teal-700";
  const anchorMobile = "block rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-teal-700";

  return (
    <>
      <header
        className={
          "fixed left-0 top-0 z-50 w-full transition-all duration-300 " +
          (scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100/60 h-16"
            : "bg-transparent h-20")
        }
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">

          <Link to="/" onClick={close} className="flex-shrink-0 text-2xl font-black tracking-tight transition-opacity hover:opacity-80">
            <span className="text-teal-700">Zenith</span>
            <span className="text-amber-500">Spa</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("/#") ? (
                <a key={link.href} href={link.href} className={anchorClass}>
                  {link.name}
                </a>
              ) : (
                <NavLink key={link.href} to={link.href} end={link.href === "/"} className={({ isActive }) => getDesktopLinkClass(isActive)}>
                  {link.name}
                </NavLink>
              )
            )}
          </nav>

          <div className="hidden md:block">
            <button
              onClick={handleBook}
              className="rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-800 hover:scale-105 hover:shadow-md active:scale-100"
            >
              Book Appointment
            </button>
          </div>

          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition-colors duration-200 hover:bg-gray-100 md:hidden"
          >
            <span className={"absolute transition-all duration-200 " + (isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90")}>
              <HiOutlineX size={22} />
            </span>
            <span className={"absolute transition-all duration-200 " + (isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0")}>
              <HiOutlineMenuAlt3 size={22} />
            </span>
          </button>

        </div>
      </header>

      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden " +
          (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={
          "fixed left-0 right-0 top-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden " +
          (isOpen ? "translate-y-0" : "-translate-y-full")
        }
      >
        <div className="mx-4 mt-20 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
          <nav className="flex flex-col gap-1 p-3">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("/#") ? (
                <a key={link.href} href={link.href} onClick={close} className={anchorMobile}>
                  {link.name}
                </a>
              ) : (
                <NavLink key={link.href} to={link.href} end={link.href === "/"} onClick={close} className={({ isActive }) => getMobileLinkClass(isActive)}>
                  {link.name}
                </NavLink>
              )
            )}
          </nav>
          <div className="border-t border-gray-100 p-3">
            <button onClick={handleBook} className="w-full rounded-xl bg-teal-700 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800 active:scale-95">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
