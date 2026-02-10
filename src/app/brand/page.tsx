import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Brand Assets",
  description: "Download GrowthAgency.dev logos and brand assets.",
};

const logos = [
  {
    name: "Logo — Horizontal",
    file: "/growthagency-logo-horizontal.jpg",
    width: 2752,
    height: 1536,
  },
  {
    name: "Logo — Square",
    file: "/growthagency-logo-square.jpg",
    width: 1200,
    height: 1200,
  },
];

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Brand Assets</h1>
        <p className="text-slate-500 mb-12">
          Download official GrowthAgency.dev logos. Right-click or use the download button.
        </p>

        <div className="grid gap-10">
          {logos.map((logo) => (
            <div key={logo.file} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 p-8 flex items-center justify-center">
                <Image
                  src={logo.file}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="max-h-64 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                <span className="text-sm font-medium text-slate-700">{logo.name}</span>
                <a
                  href={logo.file}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
