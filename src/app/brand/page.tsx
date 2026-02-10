import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brand Assets",
  description:
    "Download GrowthAgency.dev logos, favicons, banners, and brand guidelines.",
};

const ASSETS = [
  {
    name: "Logo Horizontal (HQ)",
    file: "/growthagency-logo-horizontal.jpg",
    download: "growthagency-logo-horizontal.jpg",
    bg: "bg-slate-900",
  },
  {
    name: "Logo Square (HQ)",
    file: "/growthagency-logo-square.jpg",
    download: "growthagency-logo-square.jpg",
    bg: "bg-white",
  },
  {
    name: "Logo (on dark)",
    file: "/api/brand/logo-on-dark",
    download: "growthagency-logo-on-dark.png",
    bg: "bg-slate-900",
  },
  {
    name: "Logo (on light)",
    file: "/api/brand/logo-on-light",
    download: "growthagency-logo-on-light.png",
    bg: "bg-white",
  },
  {
    name: "Favicon",
    file: "/api/brand/favicon",
    download: "growthagency-favicon.png",
    bg: "bg-white",
  },
  {
    name: "Banner (1200x630)",
    file: "/api/brand/banner",
    download: "growthagency-banner.png",
    bg: "bg-white",
  },
];

const COLORS = [
  { name: "Emerald", hex: "#10b981", tw: "bg-emerald-500" },
  { name: "Slate 900", hex: "#0f172a", tw: "bg-slate-900" },
  { name: "Slate 500", hex: "#64748b", tw: "bg-slate-500" },
  { name: "White", hex: "#ffffff", tw: "bg-white border border-slate-200" },
];

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-slate-600 transition mb-8 inline-block"
        >
          &larr; Back to site
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
          Brand Assets
        </h1>
        <p className="text-slate-500 mb-12">
          Logos, favicons, banners, and colors. Click any asset to download.
        </p>

        {/* Assets grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {ASSETS.map((asset) => (
            <a
              key={asset.name}
              href={asset.file}
              download={asset.download}
              className="group block rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition bg-white"
            >
              <div
                className={`${asset.bg} flex items-center justify-center p-8 h-40`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.file}
                  alt={asset.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {asset.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {asset.download}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Colors */}
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Brand Colors
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {COLORS.map((color) => (
            <div key={color.name} className="text-center">
              <div
                className={`${color.tw} w-full h-20 rounded-xl mb-3`}
              />
              <p className="text-sm font-medium text-slate-900">
                {color.name}
              </p>
              <p className="text-xs text-slate-400 font-mono">{color.hex}</p>
            </div>
          ))}
        </div>

        {/* Typography */}
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Typography
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <p className="text-slate-500 text-sm mb-4">
            Primary font: <strong className="text-slate-900">Inter</strong> (or
            system-ui fallback)
          </p>
          <div className="space-y-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              Growth<span className="text-emerald-500">Agency</span>
              <span className="text-slate-400">.dev</span>
            </p>
            <p className="text-lg text-slate-500">
              Your Growth Team — Guaranteed Results
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
