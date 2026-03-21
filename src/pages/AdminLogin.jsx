import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';

// NOTE: Backend uses ADMIN_SECRET from environment for real verification.
// Here we just pre-check against the known key so we can give fast feedback.
const EXPECTED_ADMIN_KEY =
  '8ee4c1a27185e91b684bd763e11a585aad34f8b1da831fafa41c57a0b72a99ed';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const normalizedKey = (key || '').trim();

    if (!normalizedKey) {
      setError('Please enter the admin secret key.');
      return;
    }

    setIsSubmitting(true);

    // Simple client-side check for better UX; backend still validates on every API call
    if (normalizedKey !== EXPECTED_ADMIN_KEY) {
      setError('Invalid admin key.');
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem('adminKey', normalizedKey);
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="py-10">
          <div className="mx-auto max-w-md glass-panel rounded-3xl p-4 sm:p-7">
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              Admin Access
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter the admin secret key to access moderation tools. This area is restricted to
              platform administrators.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="admin-key" className="text-xs font-medium text-slate-200">
                  Admin Secret Key
                </label>
                <input
                  id="admin-key"
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  placeholder="Paste secret key"
                  autoComplete="off"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                variant="secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Validating...' : 'Enter Admin Panel'}
              </Button>

              {error && <p className="text-[11px] text-rose-400">{error}</p>}

              <p className="mt-2 text-[11px] text-slate-500">
                Your key is never shown on screen. Requests from the admin panel are additionally
                validated on the server using the same secret.
              </p>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;

