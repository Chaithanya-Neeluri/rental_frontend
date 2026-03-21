import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950/60">
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
        <div className="absolute -left-40 top-10 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-32 top-32 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <Container className="relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:py-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-200 shadow-soft backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            92% matches confirmed within 7 days
          </div>

          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Find Verified Homes &amp; PGs{' '}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Skip endless scrolling and suspicious listings. We verify documents, owners, and
              payments so you can move into a home that actually matches your lifestyle, budget, and
              commute.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button as={Link} to="/tenant" replace size="lg">
              Find a Home
            </Button>
            <Button as={Link} to="/owner" replace variant="secondary" size="lg">
              List Your Property
            </Button>
            <p className="text-xs text-slate-400">
              No broker spam. No fake photos. Just verified homes.
            </p>
          </div>

          <dl className="grid max-w-xl grid-cols-3 gap-3 text-xs text-slate-300 sm:text-sm">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-3 shadow-soft">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Verified</dt>
              <dd className="mt-1 font-semibold text-slate-50">ID &amp; document checks</dd>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-3 shadow-soft">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Smart</dt>
              <dd className="mt-1 font-semibold text-slate-50">AI-based shortlisting</dd>
            </div>

          </dl>
        </div>

        <div className="relative">
          <div className="glass-panel gradient-border relative mx-auto max-w-md rounded-3xl p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-slate-400">Smart Search</p>
                <p className="text-sm font-semibold text-slate-50">
                  Bengaluru • Semi-furnished • 2BHK
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                AI Match: 94%
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Sunny 2BHK near Outer Ring Road',
                  badge: 'Company-verified',
                  price: '₹23,500 / month',
                  meta: '950 sq.ft • 5 mins from metro',
                },
                {
                  title: 'Premium PG for women in Indiranagar',
                  badge: 'Owner-verified',
                  price: '₹11,000 / bed',
                  meta: 'All meals • Wi‑Fi • CCTV',
                },
                {
                  title: 'Co-living studio in HSR Layout',
                  badge: 'Newly listed',
                  price: '₹18,200 / month',
                  meta: 'Furnished • Flexible notice',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-3 py-2.5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-400/80 hover:bg-slate-900"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-50">{card.title}</p>
                    <p className="text-[11px] text-slate-400">{card.meta}</p>
                    <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-sky-300">
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-300">{card.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>Showing homes that match your commute and budget.</span>
              <span className="text-emerald-300">+ Google Maps ready</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;

