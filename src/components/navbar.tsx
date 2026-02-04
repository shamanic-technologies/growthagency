"use client";

import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Image src="/logo_2.png" alt="Growth Agency" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-xl text-white">
            Growth<span className="text-emerald-400">Agency</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a
            href="#services"
            className="text-slate-400 hover:text-emerald-400 text-sm transition"
          >
            Services
          </a>
          <a
            href="#why-free"
            className="text-slate-400 hover:text-emerald-400 text-sm transition"
          >
            Why Free
          </a>
          <a
            href="#ai-ranking"
            className="text-slate-400 hover:text-emerald-400 text-sm transition"
          >
            AI Ranking
          </a>
          <a
            href="#about"
            className="text-slate-400 hover:text-emerald-400 text-sm transition"
          >
            About
          </a>
          <a
            href="#contact"
            className="bg-emerald-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-emerald-600 transition shadow-lg"
          >
            Get Started Free
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            <a
              href="#services"
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              Services
            </a>
            <a
              href="#why-free"
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              Why Free
            </a>
            <a
              href="#ai-ranking"
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              AI Ranking
            </a>
            <a
              href="#about"
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              About
            </a>
            <div className="pt-2 border-t border-slate-800">
              <a
                href="#contact"
                className="block w-full bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 text-center"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
