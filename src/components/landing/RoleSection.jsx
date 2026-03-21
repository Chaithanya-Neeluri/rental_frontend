import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

const RoleSection = () => {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950">
      <Container className="space-y-8 py-10 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-400">
              Built for both sides of the rental journey
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Tenants find better homes. Owners find better tenants.
            </h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="relative space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">For Tenants</h3>
              <p className="text-sm text-slate-300">
                Share your budget, move-in date, and non‑negotiables. Our AI highlights only the
                homes that match your commute, safety preferences, and flatmate comfort.
              </p>
              <ul className="space-y-2 text-xs text-slate-200 sm:text-sm">
                <li>• Verified photos, documents, and owner identity</li>
                <li>• Commute time estimates with Google Maps integration</li>
                <li>• In-app chat &amp; visit scheduling so you never lose context</li>
              </ul>
              <Button as={Link} to="/tenant" replace size="lg" className="mt-2">
                Continue as Tenant
              </Button>
            </div>
          </article>

          <article className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-16 top-4 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
            <div className="relative space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">For Owners</h3>
              <p className="text-sm text-slate-300">
                Showcase your property to verified tenants who match your expectations on stay
                duration, profession, and house rules—without chasing leads.
              </p>
              <ul className="space-y-2 text-xs text-slate-200 sm:text-sm">
                <li>• One dashboard for enquiries, visits, and bookings</li>
                <li>• Document upload &amp; verification before tenants move in</li>
                <li>• Secure communication so your phone number stays protected</li>
              </ul>
              <Button as={Link} to="/owner" replace variant="secondary" size="lg" className="mt-2">
                List a Property
              </Button>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
};

export default RoleSection;

