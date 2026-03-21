import React from 'react';
import Container from '../common/Container.jsx';

const features = [
  {
    title: 'Trust & Verification',
    description:
      'Every listing passes document checks, owner KYC, and admin review before it goes live.',
    tag: 'Verified listings',
  },
  {
    title: 'Smart Search',
    description:
      'Filter by rent, amenities, flatmates, and commute time instead of just pin codes and photos.',
    tag: 'Commute-aware filters',
  },
  {
    title: 'AI Matchmaking',
    description:
      'Our engine scores each property against your preferences so the best 10 appear on top.',
    tag: 'Preference scoring',
  },
  {
    title: 'Communication Hub',
    description:
      'Chat, schedule visits, send documents, and lock in a booking from a single secure thread.',
    tag: 'End-to-end conversations',
  },
];

const FeaturesSection = () => {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950/70">
      <Container className="space-y-8 py-10 sm:py-14">
        <div className="max-w-xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
            Designed for real-world renting
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            From discovery to booking, every step is built for speed and safety.
          </h2>
          <p className="text-sm text-slate-300 sm:text-base">
            No more scattered screenshots or confusing WhatsApp threads. Everything about your
            next home lives in one clean, secure workspace.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group soft-panel flex flex-col rounded-2xl border border-slate-800/80 p-4 transition hover:-translate-y-1 hover:border-brand-400/70 hover:bg-slate-900"
            >
              <div className="mb-3 inline-flex w-fit items-center rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] font-medium text-sky-300 ring-1 ring-slate-700 group-hover:ring-brand-400/70">
                {feature.tag}
              </div>
              <h3 className="text-sm font-semibold text-slate-50 sm:text-base">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;

