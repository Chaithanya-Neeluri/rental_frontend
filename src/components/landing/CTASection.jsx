import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

const CTASection = () => {
  return (
    <section className="bg-slate-950">
      <Container className="py-10 sm:py-14">
        <div className="glass-panel relative overflow-hidden rounded-3xl px-4 py-8 sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-fuchsia-500/25 via-sky-500/20 to-transparent blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Ready to make your next move feel effortless?
              </h2>
              <p className="max-w-xl text-sm text-slate-200 sm:text-base">
                Start by exploring verified homes as a tenant or listing your property as an owner.
                Your entire rental journey stays organized in one secure workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:min-w-[220px]">
              <Button as={Link} to="/tenant" replace size="lg">
                Find a Home
              </Button>
              <Button as={Link} to="/owner" replace variant="secondary" size="lg">
                List Your Property
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;

