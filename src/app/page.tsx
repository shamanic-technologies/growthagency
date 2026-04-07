import { Navbar } from "@/components/navbar";
import { LetsTalkButton } from "@/components/lets-talk-button";
import { JoinCohortButton } from "@/components/join-cohort-button";
import { getCohortInfo, daysUntilMonthKey } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const FAQ_ITEMS = [
  {
    q: "What is a DR50+ article?",
    a: "DR (Domain Rating) is a metric from Ahrefs that measures a website\u2019s authority on a scale of 0\u2013100. A DR50+ publication is a well-established, reputable outlet \u2014 industry magazines, major news sites, respected online publications. Each article includes a permanent do-follow backlink to your site.",
  },
  {
    q: 'What does "delivered" mean exactly?',
    a: "Within 30 days, we guarantee a positive journalist engagement for your brand: an interview request, a Q&A submission, or an op-ed opportunity. The publication date of the final article depends on the journalist\u2019s editorial calendar and may take a few additional weeks. But you\u2019ll have a confirmed, committed journalist within the first month.",
  },
  {
    q: "What if the article isn\u2019t published?",
    a: "If we don\u2019t deliver a published article in a DR50+ publication, you get a full refund. 100%. No questions asked, no fine print.",
  },
  {
    q: "Do I need to write anything?",
    a: "No. We handle everything \u2014 from strategy to journalist outreach to content coordination. All we need is a 15-minute call to understand your brand and goals.",
  },
  {
    q: "How many articles can I order?",
    a: "As many as you want \u2014 one at a time or several in parallel. Each article is a separate $5,000 engagement with its own guarantee.",
  },
  {
    q: "Why no retainer?",
    a: "Because you should pay for results, not promises. We believe in accountability: if we don\u2019t deliver, we don\u2019t deserve your money.",
  },
  {
    q: "What\u2019s the cohort system?",
    a: "Kevin works with a limited number of clients each month to ensure personalized attention. Once spots are filled, you join the next month\u2019s cohort.",
  },
];

const COMPARISON = [
  ["Commitment", "6-month retainer minimum", "None. Article by article."],
  ["Price", "$10\u201320K/month", "$5,000 per article"],
  ["Guarantee", "None", "100% refund if not delivered"],
  ["Your Time", "4+ hours/month of meetings", "15 minutes. Total."],
  ["Timeline", "6+ months, maybe", "First pitches in 24h"],
  ["Tracking", "Monthly PDF report", "Self-served dashboard"],
];

const VALUE_STACK = [
  { item: "1 guaranteed article in a DR50+ publication", value: "$3,000\u2013$5,000" },
  { item: "Permanent do-follow backlink", value: "$500\u2013$2,000" },
  { item: "AI Search visibility boost (ChatGPT, Perplexity)", value: "Priceless" },
  { item: "Kevin\u2019s personal PR strategy session", value: "$500+" },
  { item: "200+ personalized journalist pitches", value: "$4,000+" },
  { item: "Real-time campaign tracking", value: "$200/mo" },
];

export default async function Home() {
  const cohort = await getCohortInfo();
  const soldOut = cohort.spotsRemaining <= 0;
  const daysLeft = daysUntilMonthKey(cohort.monthKey);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-16 sm:py-24 md:py-40 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center hero-glow">
          <div className="relative z-10">
            <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-emerald-100">
              No Retainer. Guaranteed Results.
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight tracking-tight">
              Your PR Agency.
              <br />
              <span className="gradient-text">Guaranteed Results.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-500 mb-4 max-w-2xl mx-auto leading-relaxed">
              One article in a DR50+ publication. $5,000.
              <br className="hidden sm:block" />
              Delivered or 100% refunded.
            </p>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm">
              No retainer. No commitment. You pay per article, we deliver or you
              get every cent back.
            </p>

            <CohortCard month={cohort.month} spotsRemaining={cohort.spotsRemaining} daysLeft={daysLeft} soldOut={soldOut} />

            <div className="flex flex-wrap gap-8 sm:gap-12 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">$5,000</div>
                <div className="text-sm text-slate-400">Per Article</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-400">Money-Back Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">DR50+</div>
                <div className="text-sm text-slate-400">Publication Quality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-slate-900 tracking-tight">
            The PR Agency Problem
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            Traditional PR agencies were built for Fortune 500 companies.
            They haven&apos;t adapted.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "6-Month Retainers",
                desc: "Locked into a $10\u201320K/month contract before seeing a single result. Cancel early? Good luck.",
              },
              {
                title: "Endless Meetings",
                desc: "4 hours of meetings per month. Briefs, decks, reviews, status calls. You\u2019re paying them AND doing their homework.",
              },
              {
                title: "Zero Guarantees",
                desc: "\u201CWe\u2019ll do our best\u201D isn\u2019t a guarantee. You pay $60\u2013120K per year with no promise of a single published article.",
              },
              {
                title: "Opaque Reporting",
                desc: "A monthly PDF showing \u201C200 journalists pitched.\u201D No visibility into what\u2019s actually happening.",
              },
            ].map((item) => (
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

      {/* Comparison */}
      <section className="py-16 sm:py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-900 tracking-tight">
            A Different Kind of Agency
          </h2>
          {/* Mobile: stacked cards */}
          <div className="space-y-4 sm:hidden">
            {COMPARISON.map(([label, traditional, growth]) => (
              <div key={label} className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">Traditional</p>
                    <p className="text-sm text-slate-500">{traditional}</p>
                  </div>
                  <div className="flex-1 bg-emerald-50/50 rounded-lg p-2">
                    <p className="text-xs text-emerald-600 mb-0.5">GrowthAgency</p>
                    <p className="text-sm font-medium text-slate-900">{growth}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-4 px-4 text-sm text-slate-400 font-medium" />
                  <th className="py-4 px-4 text-sm text-slate-400 font-medium">
                    Traditional Agency
                  </th>
                  <th className="py-4 px-4 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-t-xl">
                    GrowthAgency
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {COMPARISON.map(([label, traditional, growth], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-white" : ""}>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {label}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{traditional}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 bg-emerald-50/50">
                      {growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-900 tracking-tight">
            Three Steps. That&apos;s It.
          </h2>
          <div className="space-y-8">
            {[
              {
                num: "1",
                title: "15-min call with Kevin",
                desc: "Share your brand, your goals, and your target audience. Kevin designs your PR strategy on the spot.",
              },
              {
                num: "2",
                title: "We pitch journalists",
                desc: "200+ personalized pitches sent to relevant journalists at top-tier publications. You don\u2019t write a single word.",
              },
              {
                num: "3",
                title: "Article delivered",
                desc: "You receive your published article in a DR50+ publication with a permanent do-follow backlink.",
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

      {/* Value Stack */}
      <section className="py-16 sm:py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 tracking-tight">
            What $5,000 Gets You
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Every component included. No hidden fees, no add-ons.
          </p>
          <div className="space-y-4 max-w-2xl mx-auto">
            {VALUE_STACK.map((row) => (
              <div
                key={row.item}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-700/50 gap-1 sm:gap-4"
              >
                <span className="text-slate-200">{row.item}</span>
                <span className="text-slate-400 text-sm shrink-0">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-slate-400 mb-2">
              Total market value:{" "}
              <span className="line-through">$8,000-$12,000+</span>
            </p>
            <p className="text-3xl font-bold mb-2">Your investment: $5,000</p>
            <p className="text-emerald-400 font-medium">
              And if we don&apos;t deliver: $0. 100% refunded.
            </p>
          </div>
        </div>
      </section>

      {/* Beyond Press */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900 tracking-tight">
            Need More Than Press?
          </h2>
          <p className="text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            GrowthAgency isn&apos;t just PR. Kevin also runs sales outreach
            campaigns, AI search strategy, and full growth retainers for
            companies that want the complete package.
          </p>
          <LetsTalkButton
            serviceName="Full Growth Package"
            className="px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 font-semibold text-lg transition shadow-md hover:shadow-lg cursor-pointer"
          >
            Book a Call &mdash; Let&apos;s Talk Growth
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
                I built GrowthAgency because PR shouldn&apos;t cost $20K/month
                with zero guarantees. Every campaign I run is personal &mdash; I
                design the strategy, oversee the pitches, and make sure you get
                results.
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
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900 tracking-tight">
            Ready to Get Published?
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            You pay per article. We deliver or you get 100% back. No retainer.
            No risk.
          </p>
          <CohortCard month={cohort.month} spotsRemaining={cohort.spotsRemaining} daysLeft={daysLeft} soldOut={soldOut} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-slate-900 hover:bg-slate-50 transition list-none">
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
            Your PR agency. No retainer. Guaranteed results.
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
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} GrowthAgency.dev. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function CohortCard({
  month,
  spotsRemaining,
  daysLeft,
  soldOut,
}: {
  month: string;
  spotsRemaining: number;
  daysLeft: number;
  soldOut: boolean;
}) {
  return (
    <div className="inline-block bg-white rounded-2xl border-2 border-emerald-200 px-8 py-6 mb-8 shadow-sm max-w-sm w-full">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${soldOut ? "bg-slate-400" : "bg-emerald-500"}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${soldOut ? "text-slate-400" : "text-emerald-600"}`}>
          {soldOut ? "Sold Out" : "Open"}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">{month} Cohort</h3>
      {!soldOut && daysLeft > 0 && (
        <p className="text-sm text-slate-400 mb-4">
          Closes in {daysLeft} {daysLeft === 1 ? "day" : "days"}
        </p>
      )}
      {soldOut && (
        <p className="text-sm text-slate-400 mb-4">
          Next cohort opens soon
        </p>
      )}
      <JoinCohortButton
        disabled={soldOut}
        className="w-full px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold transition shadow-sm hover:shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mb-3"
      >
        {soldOut ? "Sold Out" : "Join Cohort"}
      </JoinCohortButton>
      {!soldOut && (
        <p className="text-sm text-slate-400">
          {spotsRemaining} {spotsRemaining === 1 ? "spot" : "spots"} available
        </p>
      )}
    </div>
  );
}
