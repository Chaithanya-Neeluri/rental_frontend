import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import { AdminApi } from '../api/index.js';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const adminKey = typeof window !== 'undefined' ? localStorage.getItem('adminKey') : null;

  useEffect(() => {
    if (!adminKey) {
      navigate('/admin', { replace: true });
      return;
    }

    const fetchPending = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await AdminApi.getPendingProperties();
        setProperties(data.properties || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load pending properties', err);
        const apiMessage = err?.response?.data?.message;
        setError(apiMessage || 'Failed to load pending properties. Check admin key and try again.');
        if (err?.response?.status === 401) {
          // Invalid key, force re-login
          localStorage.removeItem('adminKey');
          navigate('/admin', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPending();
  }, [adminKey, navigate]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    setActionMessage('');
    setError('');
    try {
      const { data } = await AdminApi.approveProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setActionMessage(`Approved "${data.property.title}"`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to approve property', err);
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || 'Failed to approve property.');
      if (err?.response?.status === 401) {
        localStorage.removeItem('adminKey');
        navigate('/admin', { replace: true });
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id, title) => {
    // eslint-disable-next-line no-alert
    const confirmReject = window.confirm(
      `Are you sure you want to reject and remove "${title}"? This action cannot be undone.`,
    );
    if (!confirmReject) return;

    setProcessingId(id);
    setActionMessage('');
    setError('');
    try {
      await AdminApi.rejectProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setActionMessage(`Rejected "${title}"`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to reject property', err);
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || 'Failed to reject property.');
      if (err?.response?.status === 401) {
        localStorage.removeItem('adminKey');
        navigate('/admin', { replace: true });
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex flex-1">
        <Container className="py-10">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                  Admin Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Review and verify newly submitted properties before they go live to tenants.
                </p>
              </div>
              <Button variant="ghost" size="md" onClick={handleLogout}>
                Exit Admin
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-[11px] text-slate-400">
              <span className="rounded-full bg-amber-900/40 px-2 py-0.5 text-amber-200">
                Pending: {properties.length}
              </span>
              {isLoading && <span>Loading unverified properties...</span>}
              {actionMessage && !error && (
                <span className="text-emerald-400">{actionMessage}</span>
              )}
              {error && <span className="text-rose-400">{error}</span>}
            </div>

            <div className="mt-6">
              {!isLoading && properties.length === 0 && !error && (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-center text-sm text-slate-400 sm:p-6">
                  No unverified properties right now. New submissions will appear here for review.
                </div>
              )}

              {!isLoading && properties.length > 0 && (
                <div className="grid gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3">
                  {properties.map((property) => {
                    const firstImage = property.images?.[0];
                    const owner = property.owner_id;

                    return (
                      <div
                        key={property._id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-md"
                      >
                        {firstImage ? (
                          <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-slate-900">
                            <img
                              src={firstImage}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-32 sm:h-40 w-full items-center justify-center bg-slate-900/80 text-xs text-slate-500">
                            No image
                          </div>
                        )}

                        <div className="flex flex-1 flex-col p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h2 className="line-clamp-1 text-sm font-semibold text-slate-50">
                                {property.title}
                              </h2>
                              <p className="mt-0.5 text-xs sm:text-[11px] text-slate-400">
                                {property.location?.area}, {property.location?.city}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                              {property.propertyType}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-3 text-xs sm:text-[11px] text-slate-300">
                            {property.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[11px]">
                            <p className="font-semibold text-emerald-300">
                              ₹ {property.price?.toLocaleString('en-IN')}/month
                            </p>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                              Created {new Date(property.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {owner && (
                            <div className="mt-3 rounded-xl bg-slate-900/70 p-2 text-xs sm:text-[11px] text-slate-300">
                              <p className="font-medium text-slate-200">Owner</p>
                              <p className="mt-0.5">
                                {owner.name}{' '}
                                <span className="text-slate-400">&lt;{owner.email}&gt;</span>
                              </p>
                              {owner.mobile && (
                                <p className="text-slate-400">+91 {owner.mobile}</p>
                              )}
                            </div>
                          )}

                          {property.documents && property.documents.length > 0 && (
                            <div className="mt-3 space-y-1 text-xs sm:text-[11px]">
                              <p className="font-medium text-slate-200">Legal documents</p>
                              <div className="flex flex-wrap gap-1.5">
                                {property.documents.map((docUrl, index) => (
                                  <a
                                    key={docUrl}
                                    href={docUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-sky-300 hover:bg-slate-700"
                                  >
                                    Document {index + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                              <Button
                                size="xs"
                                className="text-xs sm:text-[11px]"
                                variant="secondary"
                                disabled={processingId === property._id}
                                onClick={() => handleApprove(property._id)}
                              >
                                {processingId === property._id ? 'Processing...' : 'Approve'}
                              </Button>
                              <Button
                                size="xs"
                                className="text-xs sm:text-[11px]"
                                variant="ghost"
                                disabled={processingId === property._id}
                                onClick={() => handleReject(property._id, property.title)}
                              >
                                Reject
                              </Button>
                            </div>
                            <span className="text-[10px] text-amber-300">Needs review</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

