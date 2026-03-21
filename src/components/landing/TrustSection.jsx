import React from 'react';
import Container from '../common/Container.jsx';

const items = [
  {
    title: 'Document Verification',
    points: [
      'Rental agreements, ID proofs, and ownership documents validated by admins.',
      'Flagged listings are paused until all documents are reverified.',
    ],
  },
  {
    title: 'Admin Approval',
    points: [
      'Every listing passes a manual review before going live.',
      'High‑risk patterns are auto‑escalated to admin workflows.',
    ],
  },
];

const TrustSection = () => {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950/90">
      <Container className="space-y-8 py-10 sm:py-14">
        <div className="max-w-xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Trust first, then transactions
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Verification, security, and performance are baked into the core.
          </h2>
          <p className="text-sm text-slate-300 sm:text-base">
            Built for a Node, Express, and MongoDB stack with JWT authentication, Cloudinary
            uploads, and Google Maps integrations ready to plug in.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.title}
              className="soft-panel rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/40 via-slate-950 to-slate-950 p-4 sm:p-5"
            >
              <h3 className="text-sm font-semibold text-emerald-200 sm:text-base">
                {item.title}
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-200 sm:text-sm">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TrustSection;

