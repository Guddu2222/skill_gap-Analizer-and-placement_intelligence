import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  {
    name: "Platform",
    items: [
      { label: "For Students",   to: "/signup/student" },
      { label: "For Colleges",   to: "/signup/college" },
      { label: "For Recruiters", to: "/signup/recruiter" },
    ],
  },
  {
    name: "Solutions",
    items: [
      { label: "Skill Gap Analysis",    to: "/signup/student" },
      { label: "Campus Hiring",         to: "/signup/recruiter" },
      { label: "Placement Tracking",    to: "/signup/college" },
    ],
  },
  {
    name: "Resources",
    items: [
      { label: "Help Center", to: "/" },
      { label: "Blog",        to: "/" },
    ],
  },
  {
    name: "Company",
    items: [
      { label: "About Us", to: "/" },
      { label: "Contact",  to: "/" },
    ],
  },
];

const DropdownItem = ({ label, to, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      display: "block",
      padding: "10px 16px",
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#e2e8f0",
      borderRadius: 10,
      transition: "all 0.15s",
      textDecoration: "none",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(99,102,241,0.18)";
      e.currentTarget.style.color = "#ffffff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "#e2e8f0";
    }}
  >
    {label}
  </Link>
);

const NavDropdown = ({ item }) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const show = () => {
    clearTimeout(timerRef.current);
    setOpen(true);
  };
  const hide = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        className={`
          px-4 py-2 rounded-full font-medium transition-all duration-200
          flex items-center space-x-1 text-sm
          text-gray-300 hover:text-white hover:bg-white/10
          ${open ? "bg-white/10 text-white" : ""}
        `}
      >
        <span>{item.name}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Invisible bridge — fills the mt gap so mouse doesn't leave the zone */}
      {open && (
        <div className="absolute top-full left-0 w-full h-3" />
      )}

      {/* Dropdown panel */}
      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            minWidth: 200,
            background: "#13132b",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 16,
            boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            padding: "8px",
            zIndex: 9999,
          }}
          className="animate-fadeIn"
        >
          {item.items.map((sub) => (
            <DropdownItem
              key={sub.label}
              label={sub.label}
              to={sub.to}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? "bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-indigo-900/20"
          : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl
                            flex items-center justify-center transform group-hover:scale-105
                            transition-all duration-300 shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white fill-white/20" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white
                             group-hover:text-transparent group-hover:bg-clip-text
                             group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400
                             transition-all duration-300">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 border border-white/10
                          rounded-full px-2 py-1 bg-white/5 backdrop-blur-md">
            {NAV_ITEMS.map((item) => (
              <NavDropdown key={item.name} item={item} />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Log In
            </Link>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500
                              rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300" />
              <Link
                to="/signup"
                className="relative flex items-center px-6 py-2.5 bg-surface text-white
                           rounded-full font-semibold text-sm transition-all duration-200
                           hover:bg-surface-low border border-white/10"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10
                       border border-white/10 text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-abyssal border-t border-white/10">
          <div className="px-4 py-6 space-y-2 max-h-screen overflow-y-auto pb-20">
            {NAV_ITEMS.map((item) => (
              <div key={item.name} className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                  className="w-full flex items-center justify-between px-2 py-3
                             text-white rounded-lg hover:bg-white/5 font-medium"
                >
                  <span>{item.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === item.name ? "rotate-180 text-cyan-400" : "text-gray-400"
                    }`}
                  />
                </button>
                {mobileExpanded === item.name && (
                  <div className="mt-1 ml-4 space-y-1 mb-2">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-400
                                   hover:text-white rounded-lg hover:bg-white/5"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 space-y-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-4 py-3 text-center text-white
                           border border-white/10 rounded-xl font-medium hover:bg-white/5"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-4 py-3 text-center
                           bg-gradient-to-r from-indigo-600 to-cyan-500
                           text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
