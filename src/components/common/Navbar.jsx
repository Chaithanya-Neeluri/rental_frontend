import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROLE_OPTIONS } from '../../constants/roles.js';
import { getRoleLandingPath } from '../../utils/navigation.js';
import Container from './Container.jsx';
import Button from './Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const authBase = getRoleLandingPath(role);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isTenantDashboard =
    location.pathname.startsWith('/tenant/dashboard') ||
    location.pathname.startsWith('/tenant/property');
  const isTenantProfile = location.pathname.startsWith('/tenant/profile');
  const isOwnerDashboard = location.pathname.startsWith('/owner/dashboard');
  const isOwnerAddProperty = location.pathname.startsWith('/owner/add-property');
  const isAdminArea = location.pathname.startsWith('/admin');

  const inDashboard = isTenantDashboard || isOwnerDashboard || isAdminArea;

  const handleRoleChange = (event) => {
    const value = event.target.value;
    setRole(value);
    navigate(getRoleLandingPath(value), { replace: true });
  };

  const isTenant = isAuthenticated && user?.role === 'tenant';

  const showProfileIcon =
    isTenant &&
    (location.pathname.startsWith('/tenant/dashboard') ||
      location.pathname.startsWith('/tenant/profile') ||
      location.pathname.startsWith('/tenant/property'));

  const hideRoleControls =
    inDashboard ||
    location.pathname.startsWith('/tenant/profile') ||
    location.pathname.startsWith('/owner/add-property') ||
    location.pathname.startsWith('/admin');

  useEffect(() => {
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const handleProfileClick = () => {
    navigate('/tenant/profile');
  };

  const handleRoleChangeMobile = (event) => {
    // Keep user on landing; only navigate after they pick Login/Sign up.
    setRole(event.target.value);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isOwnerDashboard || isAdminArea ? (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-accent-500 to-brand-700 shadow-soft">
                <span className="text-lg font-black text-white">H</span>
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-sm font-semibold tracking-tight text-slate-50">
                  Home Rental &amp; PG Finder
                </span>
                <span className="text-[11px] text-slate-400">
                  Verified homes. Zero guesswork.
                </span>
              </div>
            </div>
          ) : isTenantDashboard || isTenantProfile ? (
            <button
              type="button"
              onClick={() => navigate('/tenant/dashboard')}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-accent-500 to-brand-700 shadow-soft">
                <span className="text-lg font-black text-white">H</span>
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-sm font-semibold tracking-tight text-slate-50">
                  Home Rental &amp; PG Finder
                </span>
                <span className="text-[11px] text-slate-400">
                  Verified homes. Zero guesswork.
                </span>
              </div>
            </button>
          ) : isOwnerAddProperty ? (
            <button
              type="button"
              onClick={() => navigate('/owner/dashboard')}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-accent-500 to-brand-700 shadow-soft">
                <span className="text-lg font-black text-white">H</span>
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-sm font-semibold tracking-tight text-slate-50">
                  Home Rental &amp; PG Finder
                </span>
                <span className="text-[11px] text-slate-400">
                  Verified homes. Zero guesswork.
                </span>
              </div>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-accent-500 to-brand-700 shadow-soft">
                <span className="text-lg font-black text-white">H</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight text-slate-50">
                  Home Rental &amp; PG Finder
                </span>
                <span className="text-[11px] text-slate-400">
                  Verified homes. Zero guesswork.
                </span>
              </div>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!hideRoleControls && (
            <>
              <select
                value={role}
                onChange={handleRoleChange}
                className="hidden rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-soft outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 sm:block"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  as={Link}
                  to={`${authBase}?mode=login`}
                  replace
                  variant="ghost"
                  size="md"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to={`${authBase}?mode=signup`}
                  replace
                  variant="primary"
                  size="md"
                >
                  Sign up
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="sm:hidden inline-flex h-9 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/70 px-3 text-sm font-semibold text-slate-100 shadow-soft"
                aria-label="Open navigation menu"
              >
                Menu
              </button>

              {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 sm:hidden">
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  />
                  <div className="absolute right-0 top-0 h-full w-[86vw] max-w-[360px] border-l border-slate-800 bg-slate-950/95 backdrop-blur-xl p-4 shadow-glass">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-50">Choose role</p>
                        <p className="text-[11px] text-slate-400">Login or create an account</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100"
                      >
                        Close
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      <select
                        value={role}
                        onChange={handleRoleChangeMobile}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-200 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          as={Link}
                          to={`${authBase}?mode=login`}
                          replace
                          variant="ghost"
                          size="md"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full"
                        >
                          Login
                        </Button>
                        <Button
                          as={Link}
                          to={`${authBase}?mode=signup`}
                          replace
                          variant="primary"
                          size="md"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full"
                        >
                          Sign up
                        </Button>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
                        <p className="text-[11px] text-slate-300">
                          Tip: You can switch roles anytime from here.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {showProfileIcon && (
            <button
              type="button"
              onClick={handleProfileClick}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-100 hover:border-slate-500"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </button>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Navbar;

