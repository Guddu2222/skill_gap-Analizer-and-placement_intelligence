import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Platform",
      hasDropdown: true,
      items: ["For Students", "For Colleges", "For Recruiters", "Analytics"],
    },
    {
      name: "Solutions",
      hasDropdown: true,
      items: [
        "Campus Hiring",
        "Skill Assessment",
        "Placement Tracking",
        "Alumni Network",
      ],
    },
    {
      name: "Resources",
      hasDropdown: true,
      items: ["Blog", "Case Studies", "Help Center", "API Docs"],
    },
    {
      name: "Company",
      hasDropdown: true,
      items: ["About Us", "Careers", "Contact", "Press"],
    },
  ];

  return (
    <nav
      className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        isScrolled
          ? "bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-indigo-900/20"
          : "bg-transparent border-b border-transparent"
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/20">
                <Zap className="w-6 h-6 text-white fill-white/20" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300">
                SkillBridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 border border-white/10 rounded-full px-2 py-1 bg-white/5 backdrop-blur-md">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`
                  px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-1 text-sm
                  text-gray-300 hover:text-white hover:bg-white/10
                  ${activeDropdown === item.name ? "bg-white/10 text-white" : ""}
                `}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-3 w-56 glass-abyssal rounded-2xl shadow-2xl py-2 animate-fadeIn z-50">
                    {item.items.map((subItem, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-150"
                      >
                        {subItem}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/signin"
              className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Log In
            </Link>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <Link
                to="/signup"
                className="relative flex items-center px-6 py-2.5 bg-surface text-white rounded-full font-semibold text-sm transition-all duration-200 hover:bg-surface-low border border-white/10"
              >
                <span>Get Started Free</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-abyssal border-t border-white/10">
          <div className="px-4 py-6 space-y-4 h-screen overflow-y-auto pb-32">
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-white/5 pb-2">
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === item.name ? null : item.name,
                    )
                  }
                  className="w-full flex items-center justify-between px-2 py-3 text-white rounded-lg hover:bg-white/5 font-medium"
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? "rotate-180 text-cyan-400" : "text-gray-400"}`}
                    />
                  )}
                </button>
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="mt-1 ml-4 space-y-1 mb-2">
                    {item.items.map((subItem, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                      >
                        {subItem}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-6 space-y-4">
              <Link
                to="/signin"
                className="block w-full px-4 py-3 text-center text-white border border-white/10 rounded-xl font-medium hover:bg-white/5"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="block w-full px-4 py-3 text-center bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25"
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
