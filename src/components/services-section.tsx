"use client";

import { useState } from "react";
import { PhoneModal } from "./phone-modal";

const SERVICES = [
  {
    icon: "📧",
    title: "Get More Sales Leads",
    description:
      "Qualified prospects in your inbox. We handle targeting, outreach, and follow-ups — you close the deals.",
  },
  {
    icon: "📰",
    title: "Get Published in the Press",
    description:
      "Real articles in real publications. Announcements, thought leadership, and organic press coverage for your brand.",
  },
  {
    icon: "🤖",
    title: "Be More Visible in AI Search",
    description:
      "Appear in ChatGPT, Perplexity, and AI-powered search results. 27% of ChatGPT sources come from organic press.",
  },
  {
    icon: "🔍",
    title: "Be More Visible on Google",
    description:
      "High-authority backlinks from real press coverage. Each article is a permanent SEO asset that compounds over time.",
  },
];

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section id="services" className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-slate-900 tracking-tight">
          What Do You Need?
        </h2>
        <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
          Pick your outcomes. We handle the strategy and execution.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <button
              key={service.title}
              onClick={() => setSelectedService(service.title)}
              className="rounded-2xl border bg-white border-slate-100 shadow-sm p-6 transition-all duration-200 hover:shadow-md hover:border-emerald-200 text-left group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{service.icon}</div>
                <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
                  Available
                </span>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {service.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedService && (
        <PhoneModal
          serviceName={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  );
}
