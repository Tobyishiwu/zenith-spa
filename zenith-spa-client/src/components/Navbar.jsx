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
  const handleBook = () => { close(); navigate("/therapists"); };

  const getDesktopLinkClass = (isActive) => {
    const base = "relative text-xs font-semibold uppercase tracking-widest transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-teal-600 after:transition-transform after:duration-300 hover:after:scale-x-100";
    if (isActive) return base + " text-stone-900 after:scale-x-100";
    return base + " text-stone-500 hover:text-stone-900";
  };

  const getMobileLinkClass = (isActive) => {
    const base = "block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors duration-150";
    if (isActive) return base + " bg-stone-50 text-stone-900 font-semibold";
    return base + " text-stone-600 hover:bg-stone-50/50 hover:text-stone-900";
  };

  const anchorClass = "text-xs font-semibold uppercase tracking-widest text-stone-500 transition-colors duration-200 hover:text-stone-900";
  const anchorMobile = "block rounded-xl px-4 py-3.5 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-50 hover:text-stone-900";

  return (
    <>
      <header
        className={
          "fixed left-0 top-0 z-50 w-full transition-all duration-300 " +
          (scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/40 h-16"
            : "bg-transparent h-20")
        }
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">

          <Link to="/" onClick={close} className="flex-shrink-0 flex items-center gap-2 transition-opacity hover:opacity-90">
            <span className="text-xl font-light tracking-[0.2em] text-stone-900 uppercase">
              Zenith <span className="font-semibold text-teal-600">Spa</span>
            </span>
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
              className="rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-black hover:shadow-md active:scale-98"
            >
              Smart Booking
            </button>
          </div>

          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-stone-900 transition-colors duration-200 hover:bg-stone-100 md:hidden"
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
          "fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden " +
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
        <div className="mx-4 mt-20 overflow-hidden rounded-2xl border border-stone-200/60 bg-white shadow-xl">
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
          <div className="border-t border-stone-100 p-3">
            <button 
              onClick={handleBook} 
              className="w-full rounded-xl bg-stone-900 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-black active:scale-98"
            >
              Smart Booking Experience
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;