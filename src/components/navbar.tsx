"use client";

import { useState } from "react";
import { LetsTalkButton } from "./lets-talk-button";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Growth<span className="text-emerald-500">Agency</span>
            <span className="text-slate-300 font-normal">.dev</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-slate-500 hover:text-slate-900 text-sm font-medium transition"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="text-slate-500 hover:text-slate-900 text-sm font-medium transition"
          >
            About
          </a>
          <a
            href="#faq"
            className="text-slate-500 hover:text-slate-900 text-sm font-medium transition"
          >
            FAQ
          </a>
          <LetsTalkButton
            serviceName="PR Article"
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition cursor-pointer"
          >
            Book a Call
          </LetsTalkButton>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            <a href="#how-it-works" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              How It Works
            </a>
            <a href="#about" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              About
            </a>
            <a href="#faq" className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              FAQ
            </a>
            <div className="pt-2 border-t border-slate-100">
              <LetsTalkButton
                serviceName="PR Article"
                className="block w-full bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 text-center cursor-pointer"
              >
                Book a Call
              </LetsTalkButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
