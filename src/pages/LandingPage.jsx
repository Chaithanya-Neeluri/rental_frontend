import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import RoleSection from '../components/landing/RoleSection.jsx';
import TrustSection from '../components/landing/TrustSection.jsx';
import CTASection from '../components/landing/CTASection.jsx';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <RoleSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

