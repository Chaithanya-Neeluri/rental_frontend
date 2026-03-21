import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { EnquiryApi, PropertyApi } from '../api/index.js';

const ENQUIRY_SUGGESTIONS = ['Is it furnished?', 'What is the deposit amount?', 'Is food included?'];

const TenantPropertyDetails = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [enquiryMessage, setEnquiryMessage] = useState('Is it furnished?');
  const [enquiryStatus, setEnquiryStatus] = useState('');
  const [enquiryError, setEnquiryError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      setError('');
      setEnquiryStatus('');
      setEnquiryError('');

      try {
        const { data } = await PropertyApi.getTenantDetails(propertyId);
        setProperty(data.property);
        setActiveImageIndex(0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Load property details error', err);
        const apiMessage = err?.response?.data?.message;
        setError(apiMessage || 'Failed to load property details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      loadDetails();
    }
  }, [propertyId]);

  const owner = useMemo(() => property?.owner_id || null, [property]);
  const images = useMemo(() => property?.images || [], [property]);

  const handleEnquire = async () => {
    if (!user?.id) return;
    if (!enquiryMessage.trim()) {
      setEnquiryError('Please enter a message.');
      return;
    }

    setIsSending(true);
    setEnquiryError('');
    setEnquiryStatus('Sending enquiry...');

    try {
      await EnquiryApi.create({
        propertyId,
        message: enquiryMessage.trim(),
      });

      setEnquiryStatus('Enquiry sent. The owner will review it and contact you.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Create enquiry error', err);
      const apiMessage = err?.response?.data?.message;
      setEnquiryError(apiMessage || 'Failed to send enquiry. Please try again.');
      setEnquiryStatus('');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-400">Loading property details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
              <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-center sm:p-6">
            <p className="text-sm text-rose-400">{error}</p>
            <div className="mt-4">
              <Button size="sm" onClick={() => navigate('/tenant/dashboard')}>
                Back to results
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const firstImage = images[activeImageIndex] || images[0] || null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex flex-1">
        <Container className="py-10">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="w-full lg:flex-1">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={property.title}
                        className="h-56 w-full object-cover sm:h-72"
                      />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-slate-900/50 text-xs text-slate-500 sm:h-72">
                        No image available
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {images.map((img, idx) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`h-16 w-24 overflow-hidden rounded-xl border transition ${
                            idx === activeImageIndex ? 'border-brand-500' : 'border-slate-700 hover:border-slate-500'
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img src={img} alt={`${property.title} ${idx + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <h1 className="line-clamp-1 text-lg font-semibold text-slate-50 md:text-xl">
                          {property.title}
                        </h1>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                          {property.propertyType}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-[11px] text-slate-400">
                        {property.location?.area}, {property.location?.city}
                      </p>
                    </div>

                    <p className="text-sm text-slate-200 whitespace-pre-wrap">{property.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-base font-semibold text-emerald-300">
                        ₹ {property.price?.toLocaleString('en-IN')}/month
                      </p>
                      <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[10px] text-emerald-300">
                        {property.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-96 lg:flex-none">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">Owner contact</h3>
                    <p className="mt-2 text-xs sm:text-[11px] text-slate-400">
                      Reach out directly. Your enquiry will be shown on the owner dashboard.
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-slate-400">Phone</p>
                        {owner?.mobile ? (
                          <a className="text-sm text-sky-300 hover:text-sky-200" href={`tel:${owner.mobile}`}>
                            {owner.mobile}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-500">Not available</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-slate-400">Email</p>
                        {owner?.email ? (
                          <a className="text-sm text-sky-300 hover:text-sky-200" href={`mailto:${owner.email}`}>
                            {owner.email}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-500">Not available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {property.amenities && property.amenities.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                      <h3 className="text-sm font-semibold text-slate-100">Amenities</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {property.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-300"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-soft sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">Send an enquiry</h2>
                  <p className="mt-1 text-xs sm:text-[11px] text-slate-400">
                    This will create a new enquiry entry and show up as a notification on the owner dashboard.
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] text-slate-300">
                  Tenant: {user?.name || user?.email}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <label className="text-xs font-medium text-slate-200">Message</label>

                <textarea
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                />

                <div className="flex flex-wrap gap-2">
                  {ENQUIRY_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs sm:text-[11px] text-slate-300 hover:border-slate-500 hover:text-slate-200"
                      onClick={() => setEnquiryMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {enquiryError && (
                  <p className="text-xs sm:text-[11px] text-rose-400">{enquiryError}</p>
                )}
                {enquiryStatus && (
                  <p className="text-xs sm:text-[11px] text-emerald-400">{enquiryStatus}</p>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button onClick={handleEnquire} disabled={isSending} variant="primary">
                    {isSending ? 'Sending...' : 'Enquire'}
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/tenant/dashboard')}>
                    Back to search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default TenantPropertyDetails;

