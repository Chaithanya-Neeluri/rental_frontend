import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../constants/roles.js';
import { AuthApi } from '../api/index.js';

const TenantAuth = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { login } = useAuth();

  const initialAuthMode = useMemo(() => {
    const params = new URLSearchParams(routeLocation.search);
    const mode = params.get('mode');
    if (mode === 'signup') return 'signup';
    return 'login';
  }, [routeLocation.search]);

  const [authMode, setAuthMode] = useState(initialAuthMode); // 'login' | 'signup'

  useEffect(() => {
    setAuthMode(initialAuthMode);
  }, [initialAuthMode]);

  const [signupForm, setSignupForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [locationStatus, setLocationStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('Location captured.');
      },
      () => {
        setLocationStatus('Unable to retrieve your location. You can still continue.');
      },
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (authMode === 'signup') {
      setSignupForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatusMessage(authMode === 'login' ? 'Logging you in...' : 'Creating your account...');
    setErrorMessage('');

    try {
      if (authMode === 'login') {
        const { data } = await AuthApi.loginTenant(loginForm);
        localStorage.setItem('hrpf_token', data.token);
        login({
          ...data.user,
          role: ROLES.TENANT,
          isNew: false,
        });
      } else {
        const payload = {
          ...signupForm,
          location,
        };
        const { data } = await AuthApi.registerTenant(payload);
        localStorage.setItem('hrpf_token', data.token);
        login({
          ...data.user,
          role: ROLES.TENANT,
          isNew: true,
        });
      }

      setStatusMessage(authMode === 'login' ? 'Login successful!' : 'Registration successful!');
      navigate('/tenant/dashboard', { replace: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Tenant auth error', error);
      const apiMessage = error?.response?.data?.message;
      setErrorMessage(apiMessage || 'Something went wrong. Please try again.');
      setStatusMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="py-10">
          <div className="mx-auto max-w-md glass-panel rounded-3xl p-6 sm:p-7">
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              {authMode === 'login' ? 'Tenant Login' : 'Tenant Sign Up'}
            </h1>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <label htmlFor="tenant-name" className="text-xs font-medium text-slate-200">
                      Full Name
                    </label>
                    <input
                      id="tenant-name"
                      name="name"
                      type="text"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                      placeholder="Your name"
                      value={signupForm.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="tenant-mobile" className="text-xs font-medium text-slate-200">
                      Mobile Number
                    </label>
                    <input
                      id="tenant-mobile"
                      name="mobile"
                      type="tel"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                      placeholder="10-digit mobile number"
                      value={signupForm.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label htmlFor="tenant-email" className="text-xs font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="tenant-email"
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  placeholder="you@example.com"
                  value={authMode === 'signup' ? signupForm.email : loginForm.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tenant-password" className="text-xs font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="tenant-password"
                  name="password"
                  type="password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  placeholder={authMode === 'signup' ? 'Create a strong password' : 'Your password'}
                  value={authMode === 'signup' ? signupForm.password : loginForm.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {authMode === 'signup' && (
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-slate-300">Your location</p>
                  <p className="text-[11px] text-slate-400">
                    {locationStatus || 'Capturing your location...'}
                  </p>
                  {location.latitude && location.longitude && (
                    <p className="text-[11px] text-slate-400">
                      Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? authMode === 'login'
                    ? 'Logging in...'
                    : 'Registering...'
                  : authMode === 'login'
                    ? 'Login as Tenant'
                    : 'Register as Tenant'}
              </Button>

              {statusMessage && !errorMessage && (
                <p className="text-[11px] text-emerald-400">{statusMessage}</p>
              )}
              {errorMessage && <p className="text-[11px] text-rose-400">{errorMessage}</p>}

              <p className="text-[11px] text-slate-400">
                {authMode === 'login' ? (
                  <>
                    New tenant?{' '}
                    <button
                      type="button"
                      className="font-medium text-sky-300 hover:text-sky-200"
                      onClick={() => setAuthMode('signup')}
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="font-medium text-sky-300 hover:text-sky-200"
                      onClick={() => setAuthMode('login')}
                    >
                      Login instead
                    </button>
                  </>
                )}
              </p>
            </form>

        

            <div className="mt-4 text-center text-[11px] text-slate-500">
              Looking to list a home instead?{' '}
              <Link to="/owner" className="font-medium text-fuchsia-300 hover:text-fuchsia-200">
                Continue as owner
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default TenantAuth;

