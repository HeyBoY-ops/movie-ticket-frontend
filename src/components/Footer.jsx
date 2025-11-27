import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]/95 text-gray-400">
      <div className="pointer-events-none absolute -top-20 right-[-60px] h-72 w-72 rounded-full bg-red-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 left-[-40px] h-64 w-64 rounded-full bg-red-500/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* BRAND + QR */}
          <div className="space-y-6">
            <div>
              <h2
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Movie<span className="text-red-600">Day</span>
              </h2>
              <p className="text-sm text-gray-400 mt-3 max-w-sm">
                Curated cinemas, premium seats, and seamless booking—wrapped in
                a bold black & red experience.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-2xl border border-red-500/40 bg-black/70 p-3 shadow-[0_10px_30px_rgba(229,9,20,0.25)]">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://movie-ticket-app.com"
                  alt="Download MovieDay App"
                  className="w-full h-full object-contain grayscale contrast-125"
                />
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-white font-semibold tracking-wide">
                  Get the MovieDay app
                </p>
                <p>Scan & book tickets in three taps.</p>
                <p className="text-[11px] text-gray-500">
                  Available on iOS & Android
                </p>
              </div>
            </div>
          </div>

          {/* DISCOVER */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
              Discover
            </h3>
            <ul className="space-y-2 text-sm">
              {["/movies", "/events", "/sports", "/activities"].map((href) => {
                const label = href.replace("/", "");
                return (
                  <li key={href}>
                    <a
                      href={href}
                      className="transition hover:text-white hover:tracking-wide"
                    >
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {["Contact Us", "FAQs", "Terms of Service", "Privacy Policy"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-white">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
            <div className="mt-6 space-y-2 text-sm">
              <p className="text-white font-semibold">Customer Care</p>
              <p>support@movieday.app</p>
              <p>+91 80080 40040</p>
            </div>
          </div>

          {/* CONNECT */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
                Connect
              </h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon) => (
                  <a
                    key={Icon.displayName ?? Icon.name}
                    href="#"
                    className="w-11 h-11 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-600/20 transition"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-300">
                Stay in sync with new releases, exclusive drops, and flash deals.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 input-field bg-white/5 border border-white/10 placeholder:text-gray-500"
                />
                <button className="btn-primary whitespace-nowrap flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-[0.2em] text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} MovieDay. All rights reserved.</p>
          <p>Crafted with passion for cinema lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
