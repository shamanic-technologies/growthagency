import { Navbar } from "@/components/navbar";
import { LetsTalkButton } from "@/components/lets-talk-button";
import { AssessmentForm } from "@/components/assessment-form";
import { CohortBanner } from "@/components/cohort-banner";
import { getCohortInfo, daysUntilMonthKey } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const FAQ_ITEMS = [
  {
    q: "What is a free growth assessment?",
    a: "We analyze your brand, your online presence, and your goals \u2014 then recommend specific tools and strategies to accelerate your growth. It\u2019s completely free, no strings attached.",
  },
  {
    q: "What areas do you cover?",
    a: "Thought leadership & press, sales outreach, hiring automation, AI search visibility, and SEO. We tailor recommendations to what matters most for your business.",
  },
  {
    q: "How long does the assessment take?",
    a: "We just need your website URL and email. Our team reviews your brand and gets back to you within 48 hours with personalized recommendations.",
  },
  {
    q: "Do I need to commit to anything?",
    a: "No. The assessment is free. If you want to work with us after, we\u2019ll discuss options tailored to your needs.",
  },
  {
    q: "What\u2019s the cohort system?",
    a: "Kevin works with a limited number of clients each month to ensure personalized attention. Once spots are filled, you join the next month\u2019s cohort.",
  },
  {
    q: "How do I get started?",
    a: "Enter your website URL on this page, share your email, and we\u2019ll take it from there. The whole process takes 30 seconds.",
  },
];

const SERVICES = [
  {
    title: "Thought Leadership & Press",
    desc: "Get published in top-tier publications. Build authority and credibility for your brand with real articles and backlinks.",
  },
  {
    title: "Sales Outreach",
    desc: "Qualified prospects in your inbox. We handle targeting, outreach, and follow-ups \u2014 you close the deals.",
  },
  {
    title: "Hiring Automation",
    desc: "Automate your recruiting pipeline. Source, screen, and engage candidates at scale without the manual grind.",
  },
  {
    title: "AI Search Visibility",
    desc: "Appear in ChatGPT, Perplexity, and AI-powered search results. Be where your customers are looking next.",
  },
];

export default async function Home() {
  const cohort = await getCohortInfo();
  const soldOut = cohort.spotsRemaining <= 0;
  const daysLeft = daysUntilMonthKey(cohort.monthKey);

  return (
    <main className="min-h-screen">
      <div className="min-h-svh flex flex-col">
        <div className="sticky top-0 z-50">
          <CohortBanner month={cohort.month} spotsRemaining={cohort.spotsRemaining} daysLeft={daysLeft} soldOut={soldOut} />
          <Navbar />
        </div>

        {/* Hero */}
        <section className="gradient-hero px-4 overflow-hidden flex-1 flex items-center pt-6 sm:pt-8 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center hero-glow w-full">
          <div className="relative z-10">
            <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-100">
              Growth Marketing Agency
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight tracking-tight">
              Grow Your Brand
              <br />
              <span className="gradient-text">While You Build.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-500 mb-4 max-w-3xl mx-auto leading-relaxed">
              We&apos;re a growth agency that identifies and runs the AI-marketing tools your brand needs to scale.
            </p>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm">
              Start with a free assessment — just enter your URL.
            </p>

            <AssessmentForm variant="hero" />

            <div className="flex flex-wrap gap-8 sm:gap-12 justify-center mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-400">Free</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">48h</div>
                <div className="text-sm text-slate-400">Turnaround</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">Personalized</div>
                <div className="text-sm text-slate-400">To Your Brand</div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* What We Help With */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-slate-900 tracking-tight">
            What We Can Help You With
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            Every brand is different. We&apos;ll recommend what makes sense for yours.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((item) => (
              <div
                key={item.title}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
              >
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-900 tracking-tight">
            Three Steps. That&apos;s It.
          </h2>
          <div className="space-y-8">
            {[
              {
                num: "1",
                title: "Enter your website URL",
                desc: "That\u2019s all we need to get started. We\u2019ll analyze your brand and online presence.",
              },
              {
                num: "2",
                title: "Get your free assessment",
                desc: "Within 48 hours, you\u2019ll receive personalized recommendations \u2014 tools, strategies, and opportunities tailored to your brand.",
              },
              {
                num: "3",
                title: "Let\u2019s talk if you want to go further",
                desc: "If you like what you see, we\u2019ll build a custom growth plan together. No pressure, no obligation.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-5">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond Press */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900 tracking-tight">
            Want to Talk to Someone?
          </h2>
          <p className="text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Prefer a conversation? Book a 15-minute call with Kevin.
            No pitch, no pressure &mdash; just an honest discussion about your growth.
          </p>
          <LetsTalkButton
            serviceName="Growth Consultation"
            className="px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 font-semibold text-lg transition shadow-md hover:shadow-lg cursor-pointer"
          >
            Book a Call
          </LetsTalkButton>
        </div>
      </section>

      {/* Meet Kevin */}
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
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900 tracking-tight">
                Meet Kevin Lourd
              </h2>
              <p className="text-slate-500 mb-4 leading-relaxed">
                I built GrowthAgency because I believe in giving first.
                Every conversation starts with understanding your brand and
                finding real ways to help you grow &mdash; before we talk
                about anything else.
              </p>
              <p className="text-slate-500 mb-6 leading-relaxed">
                As your dedicated strategist, I personally oversee every
                campaign. Ask me anything, anytime.
              </p>
              <a
                href="https://www.linkedin.com/in/kevin-lourd-3394b025/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-900 hover:text-emerald-600 font-medium transition"
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
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
            Ready to Grow?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get your free assessment. Just enter your URL &mdash; we&apos;ll handle the rest.
          </p>
          <AssessmentForm variant="footer" />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-slate-900 hover:bg-slate-100 transition list-none">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-slate-400 shrink-0 ml-4 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-slate-500 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

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
            Helping brands grow with the right tools and strategies.
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
            <a href="/brand" className="hover:text-emerald-400 transition">
              Brand
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs mb-6">
            <a
              href="https://pressbeat.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              PressBeat.io &mdash; Organic Press on Demand
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://growthagency.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              GrowthAgency.dev &mdash; Growth Agency for Humans
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://distribute.you"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              Distribute.you &mdash; Outreach Automation for Developers
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://growthservice.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              GrowthService.org &mdash; Increase AI Search Ranking
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
