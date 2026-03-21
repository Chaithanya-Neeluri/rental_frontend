import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import AmenitiesSelector from '../components/owner/AmenitiesSelector.jsx';
import LocationForm from '../components/owner/LocationForm.jsx';
import ImageUploader from '../components/owner/ImageUploader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { PropertyApi } from '../api/index.js';

const PROPERTY_TYPES = ['PG', 'Apartment', 'Independent House', 'Shared Room'];

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    propertyType: '',
    price: '',
    amenities: [],
  });

  const [location, setLocation] = useState({
    city: '',
    area: '',
    address: '',
    pincode: '',
    latitude: '',
    longitude: '',
  });

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.title || !form.description || !form.price) {
      setErrorMessage('Title, description and price are required.');
      return false;
    }
    if (!location.city || !location.area || !location.address || !location.pincode) {
      setErrorMessage('Complete location details are required.');
      return false;
    }
    if (!images.length) {
      setErrorMessage('Please upload at least one property image.');
      return false;
    }
    if (!documents.length) {
      setErrorMessage('Please upload at least one legal document.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    setStatusMessage('Uploading property details. This may take a moment...');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('propertyType', form.propertyType);
      formData.append('price', form.price);
      formData.append('location_city', location.city);
      formData.append('location_area', location.area);
      formData.append('location_address', location.address);
      formData.append('location_pincode', location.pincode);
      if (location.latitude) {
        formData.append('location_latitude', location.latitude);
      }
      if (location.longitude) {
        formData.append('location_longitude', location.longitude);
      }
      form.amenities.forEach((a) => formData.append('amenities', a));

      images.forEach((file) => {
        formData.append('images', file);
      });
      documents.forEach((file) => {
        formData.append('documents', file);
      });

      await PropertyApi.create(formData);
      setStatusMessage('Property listed successfully.');
      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Add property error', err);
      const apiMessage = err?.response?.data?.message;
      setErrorMessage(apiMessage || 'Failed to add property. Please try again.');
      setStatusMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'owner') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-400">You must be logged in as an owner to list a home.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="py-10">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft sm:p-8">
            <div className="mb-4 space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                List a PG / Home / Property
              </h1>
              <p className="text-xs text-slate-400">
                Create a clean listing with photos, amenities, and documents. Tenants will only see
                verified, complete listings.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-100">Basic Information</h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-200">Property Type</label>
                    <select
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      <option value="">Select type</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-200">Price per month (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                    />
                  </div>
                </div>
              </section>

              <section>
                <LocationForm location={location} onChange={setLocation} />
              </section>

              <section>
                <AmenitiesSelector value={form.amenities} onChange={(next) => setForm((p) => ({ ...p, amenities: next }))} />
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-100">Photos &amp; Documents</h3>
                <ImageUploader
                  label="Property Images"
                  multiple
                  files={images}
                  onChange={setImages}
                  accept="image/jpeg,image/png,image/jpg"
                />
                <ImageUploader
                  label="Legal Verification Documents"
                  multiple
                  files={documents}
                  onChange={setDocuments}
                  accept="application/pdf,image/jpeg,image/png"
                />
              </section>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Listing...' : 'List Property'}
                </Button>
              </div>

              {statusMessage && !errorMessage && (
                <p className="text-[11px] text-emerald-400">{statusMessage}</p>
              )}
              {errorMessage && <p className="text-[11px] text-rose-400">{errorMessage}</p>}
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AddProperty;

