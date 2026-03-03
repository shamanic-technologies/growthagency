import { Navbar } from "@/components/navbar";
import { ServicesSection } from "@/components/services-section";
import { LetsTalkButton } from "@/components/lets-talk-button";
import { ContactSection } from "@/components/contact-section";

const STEPS = [
  {
    number: "1",
    title: "Tell us about your company",
    description:
      "Share your URL, your goals, and your target audience. We'll analyze your market and competitors.",
  },
  {
    number: "2",
    title: "We build your strategy",
    description:
      "Your dedicated strategist designs a custom growth plan — outreach, PR, SEO, all tailored to your business.",
  },
  {
    number: "3",
    title: "You get results — guaranteed",
    description:
      "We execute, you grow. Regular reports, transparent metrics, and a money-back guarantee if we don't deliver.",
  },
];

const SERVICE_DETAILS = [
  {
    id: "sales-leads",
    title: "Get More Sales Leads",
    description:
      "We identify and reach out to your ideal prospects. Personalized cold emails, smart follow-ups, and continuous optimization — all handled for you.",
    stats: [
      { value: "5x", label: "cheaper than agencies" },
      { value: "24h", label: "to first campaign" },
      { value: "A/B", label: "tested automatically" },
    ],
    highlight:
      "You provide your URL. We find the leads, write the emails, and fill your inbox with qualified prospects.",
  },
  {
    id: "press-coverage",
    title: "Get Published in the Press",
    description:
      "We pitch your story to journalists at real publications. Announcements, thought leadership, and organic press coverage — no paid placements.",
    stats: [
      { value: "DR50+", label: "publication quality" },
      { value: "100%", label: "organic press" },
      { value: "90d", label: "money-back guarantee" },
    ],
    highlight:
      "Every press article is a permanent asset — boosting SEO, AI visibility, and brand credibility. It compounds.",
  },
  {
    id: "ai-search",
    title: "Be More Visible in AI Search",
    description:
      "ChatGPT, Perplexity, and other tools are becoming the new search engines. If you're not in their sources, you don't exist.",
    stats: [
      { value: "27%", label: "of ChatGPT sources are organic press" },
      { value: "49%", label: "for recent info queries" },
      { value: "∞", label: "backlinks compound forever" },
    ],
    highlight:
      "We get your brand mentioned in quality publications — so you get recommended. One press article = SEO boost + search visibility + credibility.",
  },
  {
    id: "google-seo",
    title: "Be More Visible on Google",
    description:
      "High-authority backlinks from real press coverage. Each article is a permanent SEO asset that compounds over time — unlike ads that stop the moment you stop paying.",
    stats: [
      { value: "DA70+", label: "average backlink authority" },
      { value: "3-6mo", label: "to see ranking impact" },
      { value: "∞", label: "permanent asset" },
    ],
    highlight:
      "Traditional link building costs $500–$1,000 per link. Our press coverage delivers high-authority backlinks as a side effect.",
  },
];


function ServiceDetailSection({
  detail,
  index,
}: {
  detail: (typeof SERVICE_DETAILS)[number];
  index: number;
}) {
  const isEven = index % 2 === 0;
  const bg = isEven ? "bg-white" : "bg-slate-50";

  return (
    <section id={detail.id} className={`py-12 sm:py-20 px-4 ${bg}`}>
      <div className="max-w-5xl mx-auto">
        <div
          className={`flex flex-col ${
            isEven ? "md:flex-row" : "md:flex-row-reverse"
          } gap-8 sm:gap-12 items-center`}
        >
          {/* Text */}
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4 tracking-tight">
              {detail.title}
            </h3>
            <p className="text-slate-500 mb-4 leading-relaxed">
              {detail.description}
            </p>
            <p className="text-emerald-600 font-medium text-sm">
              {detail.highlight}
            </p>
          </div>

          {/* Stats */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {detail.stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center border ${
                    isEven
                      ? "bg-slate-50 border-slate-100"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-500 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-slate-400 text-xs leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-16 sm:py-24 md:py-40 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center hero-glow">
          <div className="relative z-10">
            <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-emerald-100">
              Results Guaranteed — Or Your Money Back
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight tracking-tight">
              Your Growth Team.
              <br />
              <span className="gradient-text">Strategy + Execution.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-500 mb-4 max-w-2xl mx-auto leading-relaxed">
              Sales outreach, PR, AI search ranking, SEO — we get you growing.
              You get a dedicated strategist and guaranteed results.
            </p>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto">
              Powered by{" "}
              <a
                href="https://distribute.you"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:underline"
              >
                Machines
              </a>{" "}
              and{" "}
              <a
                href="#about"
                className="text-emerald-500 hover:underline"
              >
                Humans
              </a>
              . Money-back guarantee if we don&apos;t deliver.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <LetsTalkButton className="px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 font-semibold text-lg transition shadow-md hover:shadow-lg cursor-pointer" />
              <a
                href="#services"
                className="px-8 py-4 bg-white text-slate-600 rounded-full hover:bg-slate-50 font-medium text-lg border border-slate-200 transition"
              >
                See Services
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 sm:gap-12 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">1:1</div>
                <div className="text-sm text-slate-400">
                  Dedicated Strategist
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-400">
                  Money-Back Guarantee
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">24h</div>
                <div className="text-sm text-slate-400">
                  To First Campaign
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <ServicesSection />

      {/* Service Detail Sections */}
      {SERVICE_DETAILS.map((detail, i) => (
        <ServiceDetailSection key={detail.id} detail={detail} index={i} />
      ))}

      {/* Why Work With Us */}
      <section className="py-16 sm:py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-slate-900 tracking-tight">
            Why Work With Us?
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            Not a tool. Not a template. A real growth team — built for results.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                Highest Quality Execution
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We continuously test and optimize every campaign.
                Better results, less waste.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                Instant Start
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                No weeks of onboarding. We start executing within hours, not
                days. Your first campaigns go live fast.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                Zero Friction Onboarding
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We only need your brand URL and 1–2 lines about your objective.
                That&apos;s it. No lengthy briefs, no questionnaires, no back
                and forth.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                Strategic Channel Mix
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We don&apos;t just run one channel. We combine outreach, PR,
                SEO, and AI visibility into one coordinated strategy that
                maximizes results across all fronts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-900 tracking-tight">
            Three Steps. That&apos;s It.
          </h2>

          <div className="space-y-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-5">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="shrink-0">
              <img
                src="/kevin.jpg"
                alt="Kevin Lourd"
                className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover"
              />
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900 tracking-tight">
                Meet Kevin Lourd
              </h2>
              <p className="text-slate-500 mb-4 leading-relaxed">
                I built GrowthAgency to make growth simple, accessible, and
                transparent. Every campaign is measurable, every result is
                verifiable.
              </p>
              <p className="text-slate-500 mb-6 leading-relaxed">
                As your dedicated strategist, I personally design your growth
                plan and oversee every campaign. Ask me anything, anytime.
              </p>
              <a
                href="https://www.linkedin.com/in/kevin-lourd-3394b025/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-900 hover:text-emerald-600 font-medium transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-bold text-white text-lg tracking-tight">
              Growth<span className="text-emerald-400">Agency</span>
              <span className="text-slate-500">.dev</span>
            </span>
          </div>
          <p className="text-sm mb-6">
            Growth with guaranteed results. Strategy + execution.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-6">
            <a
              href="https://www.linkedin.com/company/growthagency-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              LinkedIn
            </a>
            <a
              href="mailto:kevin@growthagency.dev"
              className="hover:text-emerald-400 transition"
            >
              Email
            </a>
            <a
              href="/brand"
              className="hover:text-emerald-400 transition"
            >
              Brand
            </a>
          </div>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} GrowthAgency.dev. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
