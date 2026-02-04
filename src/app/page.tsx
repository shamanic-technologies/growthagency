import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { ServiceCard } from "@/components/service-card";

const SERVICES = [
  {
    icon: "📧",
    title: "Sales Outreach",
    description:
      "Automated cold email campaigns. We find leads, generate personalized emails, send them, and optimize — you just provide your URL.",
    isAvailable: true,
  },
  {
    icon: "📰",
    title: "PR & Press Coverage",
    description:
      "Get featured in real publications. Announcements and thought leadership articles — all organic press, no paid placements.",
    isAvailable: true,
  },
  {
    icon: "🤖",
    title: "AI Search Ranking",
    description:
      "27% of sources used by ChatGPT come from organic press. We get you cited in AI search results through strategic PR.",
    isAvailable: true,
  },
  {
    icon: "🔍",
    title: "SEO Ranking",
    description:
      "High-authority backlinks from real press coverage. Each article is a permanent SEO asset that compounds over time.",
    isAvailable: true,
  },
  {
    icon: "📢",
    title: "Ads Management",
    description:
      "Automated campaign management for Google, Reddit, and X. Set your budget, we handle the rest.",
    isAvailable: false,
  },
  {
    icon: "🎬",
    title: "Content Creation",
    description:
      "AI-generated content for Instagram, TikTok, and LinkedIn. Consistent posting without the effort.",
    isAvailable: false,
  },
  {
    icon: "💰",
    title: "Investor Newsletter",
    description:
      "Weekly or monthly investor updates generated automatically from your metrics and milestones.",
    isAvailable: false,
  },
  {
    icon: "📋",
    title: "Product Update Newsletter",
    description:
      "Monthly product changelog and updates sent to your users, auto-generated from your releases.",
    isAvailable: false,
  },
];

const STEPS = [
  {
    number: "1",
    title: "Tell us about your company",
    description:
      "Share your URL and what you're looking for — sales leads, press coverage, SEO, or all of the above.",
  },
  {
    number: "2",
    title: "We set up your campaigns",
    description:
      "Using AI tools, we configure and launch your growth campaigns. Cold email, PR outreach, everything automated.",
  },
  {
    number: "3",
    title: "You get results",
    description:
      "Leads in your inbox, press articles live, backlinks accumulating. Regular reports so you see exactly what's happening.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-20 md:py-32 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-500/20">
            100% Free — Powered by Open Source AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
            Your Growth Team,
            <br />
            <span className="gradient-text">Fully Automated</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-4 max-w-3xl mx-auto">
            Sales outreach, PR, AI search ranking, SEO — all done for you,
            all free.
          </p>
          <p className="text-slate-500 mb-10 max-w-2xl mx-auto">
            We use only free and open-source AI tools. No hidden fees. No
            retainers. No catch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#contact"
              className="px-8 py-4 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 font-semibold text-lg shadow-lg hover:shadow-xl transition"
            >
              Get Started Free
            </a>
            <a
              href="#services"
              className="px-8 py-4 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 font-medium text-lg border border-slate-700 transition"
            >
              See Services
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$0</div>
              <div className="text-sm text-slate-500">Platform Cost</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">BYOK</div>
              <div className="text-sm text-slate-500">
                Bring Your Own Keys
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-slate-500">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">
            Everything You Need to Grow
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            From cold outreach to press coverage to AI visibility — we handle
            it all.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Free */}
      <section
        id="why-free"
        className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">
            Why Is This Free?
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            No catch. Here&apos;s how it works.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="gradient-card rounded-2xl p-8 border border-emerald-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-3xl">🏭</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">
                Powered by MCP Factory
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We built{" "}
                <a
                  href="https://github.com/shamanic-technologies/mcpfactory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  MCP Factory
                </a>
                , an open-source automation platform. Growth Agency runs
                entirely on it. Since we own the infrastructure, the platform
                cost for us is zero.
              </p>
            </div>

            <div className="gradient-card rounded-2xl p-8 border border-emerald-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-3xl">🔑</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">
                BYOK — You Pay Only API Costs
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We use free and open-source AI tools. For services that need
                API keys (like email sending), you bring your own. You pay
                the provider directly — typically pennies per action.
              </p>
            </div>

            <div className="gradient-card rounded-2xl p-8 border border-emerald-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">
                100% Open Source Tools
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Every tool we use is open source. No proprietary lock-in. You
                can inspect, fork, and run everything yourself if you want.
              </p>
            </div>

            <div className="gradient-card rounded-2xl p-8 border border-emerald-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">
                We Grow by Proving It Works
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Your success is our best marketing. When your campaigns
                deliver results, it validates the platform and brings more
                users to MCP Factory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search Ranking */}
      <section id="ai-ranking" className="py-20 px-4 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-500/20">
              The Future of Discoverability
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Get Found by AI Search Engines
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              ChatGPT, Perplexity, and other AI tools are becoming the new
              search engines. If you&apos;re not in their sources, you
              don&apos;t exist.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                27%
              </div>
              <p className="text-slate-400 text-sm">
                of ChatGPT sources come from organic press
              </p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                49%
              </div>
              <p className="text-slate-400 text-sm">
                for recent information queries
              </p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                ∞
              </div>
              <p className="text-slate-400 text-sm">
                Backlinks compound forever — unlike ads
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
            <h3 className="font-bold text-xl mb-4 text-white">
              How It Works
            </h3>
            <div className="space-y-4 text-slate-400">
              <p>
                AI search engines like ChatGPT pull answers from published
                articles, press mentions, and authoritative content. The more
                your brand appears in quality publications, the more likely
                AI recommends you.
              </p>
              <p>
                We use strategic PR to get your brand mentioned in real
                publications. Each article creates a permanent backlink that
                boosts both your SEO ranking and your AI search visibility.
              </p>
              <p className="text-emerald-400 font-medium">
                One press article = SEO boost + AI visibility + brand
                credibility. It compounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">
            Three Steps. That&apos;s It.
          </h2>

          <div className="space-y-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-5">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shrink-0 shadow-lg text-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
            Built by Kevin Lourd
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed max-w-2xl mx-auto">
            I believe marketing should be automated and cheap in the age of
            AI. Traditional agencies charge $5K–$20K/month with no
            guarantees. I built the tools to make that obsolete.
          </p>
          <p className="text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Growth Agency runs on{" "}
            <a
              href="https://github.com/shamanic-technologies/mcpfactory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline font-medium"
            >
              MCP Factory
            </a>{" "}
            (open-source) and{" "}
            <a
              href="https://pressbeat.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline font-medium"
            >
              PressBeat
            </a>{" "}
            (guaranteed press) — both products I built.
          </p>
          <a
            href="https://www.linkedin.com/in/kevin-lourd-3394b025/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="py-20 px-4 gradient-hero">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Grow?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get started for free. No credit card, no contract, no BS. Just
            share your URL and we&apos;ll get you set up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:kevin@growthagency.dev"
              className="px-8 py-4 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 font-semibold text-lg shadow-lg hover:shadow-xl transition"
            >
              Email Us to Start
            </a>
            <a
              href="https://www.linkedin.com/in/kevin-lourd-3394b025/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 font-medium text-lg border border-slate-700 transition"
            >
              Message on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/logo_2.png" alt="Growth Agency" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-white text-lg">
              Growth<span className="text-emerald-400">Agency</span>
            </span>
          </div>
          <p className="text-sm mb-6">
            Free AI-powered growth. Built on open-source.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-6">
            <a
              href="https://github.com/shamanic-technologies/mcpfactory"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              MCP Factory
            </a>
            <a
              href="https://pressbeat.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              PressBeat
            </a>
            <a
              href="https://www.linkedin.com/in/kevin-lourd-3394b025/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              LinkedIn
            </a>
          </div>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Growth Agency. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
