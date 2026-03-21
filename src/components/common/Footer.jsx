import React from 'react';
import Container from './Container.jsx';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80">
      <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row">
        <p className="order-2 sm:order-1">
          © {new Date().getFullYear()} Home Rental &amp; PG Finder. All rights reserved.
        </p>
        <div className="order-1 flex items-center gap-4 sm:order-2">
          <button type="button" className="hover:text-slate-200">
            Privacy
          </button>
          <button type="button" className="hover:text-slate-200">
            Terms
          </button>
          <button type="button" className="hover:text-slate-200">
            Support
          </button>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

