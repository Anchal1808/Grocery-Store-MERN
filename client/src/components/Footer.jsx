import React from "react";
import { assets, footerLinks } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-24 bg-gray-50 border-t border-gray-200">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand and Description */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <img src={assets.logo} alt="Grocery Store" className="h-9" />
            </Link>
            <p className="text-gray-500 text-sm mt-4 max-w-sm leading-relaxed">
              We deliver fresh groceries, organic vegetables, seasonal fruits, and pantry essentials
              straight to your doorstep in 30 minutes.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              Fast & contact-free local deliveries
            </div>
          </div>

          {/* Links Columns from assets.js */}
          {footerLinks.map((group, index) => (
            <div key={index} className="flex flex-col">
              <h5 className="font-semibold text-gray-900 text-sm tracking-wide uppercase mb-4">
                {group.title}
              </h5>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {group.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      className="hover:text-primary transition-colors duration-150 inline-block"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Grocery Store MERN. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
