import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { UserApi } from '../api/index.js';

const AMENITY_OPTIONS = ['WiFi', 'Food', 'Parking', 'Housekeeping', 'Laundry', 'AC', 'Non-AC'];
const ACCOMMODATION_TYPES = ['Flat', 'PG', 'Hostel', 'Co-living'];
const GENDER_OPTIONS = ['Male', 'Female', 'Any'];

const TenantProfile = () => {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    phone_number: '',
    email: '',
    aadhaar_id: '',
    accommodation_type: '',
    budget_min: '',
    budget_max: '',
    preferred_city: '',
    preferred_area: '',
    gender_preference: '',
    amenities: [],
    move_in_date: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await UserApi.getMe();
        const u = data.user;
        const prefs = u.preferences || {};

        setForm({
          name: u.name || '',
          phone_number: u.mobile || '',
          email: u.email || '',
          aadhaar_id: u.aadhaarId || '',
          accommodation_type: prefs.accommodation_type || '',
          budget_min: prefs.budget_min ?? '',
          budget_max: prefs.budget_max ?? '',
          preferred_city: prefs.preferred_city || '',
          preferred_area: prefs.preferred_area || '',
          gender_preference: prefs.gender_preference || '',
          amenities: prefs.amenities || [],
          move_in_date: prefs.move_in_date ? prefs.move_in_date.substring(0, 10) : '',
        });

        // Keep context user in sync with backend
        login({ ...user, ...u });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Load profile error', err);
        setErrorMessage('Unable to load profile. Please login again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/tenant');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving your preferences...');
    setErrorMessage('');

    try {
      const payload = {
        name: form.name,
        phone_number: form.phone_number,
        aadhaar_id: form.aadhaar_id,
        preferences: {
          accommodation_type: form.accommodation_type,
          budget_min: form.budget_min ? Number(form.budget_min) : undefined,
          budget_max: form.budget_max ? Number(form.budget_max) : undefined,
          preferred_city: form.preferred_city,
          preferred_area: form.preferred_area,
          gender_preference: form.gender_preference,
          amenities: form.amenities,
          move_in_date: form.move_in_date || undefined,
        },
      };

      const { data } = await UserApi.updateProfile(payload);
      setStatusMessage(data.message || 'Profile updated successfully');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Save profile error', err);
      const apiMessage = err?.response?.data?.message;
      setErrorMessage(apiMessage || 'Failed to save profile. Please try again.');
      setStatusMessage('');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-400">Loading your profile...</p>
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
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                  Tenant Profile
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                  Personalize your rental preferences so we can match better homes for you.
                </p>
              </div>
              <Button variant="ghost" size="md" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-200">Email</label>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-200">Aadhaar ID</label>
                <input
                  type="text"
                  name="aadhaar_id"
                  value={form.aadhaar_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">
                    Accommodation Type
                  </label>
                  <select
                    name="accommodation_type"
                    value={form.accommodation_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <option value="">Select type</option>
                    {ACCOMMODATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Move-in Date</label>
                  <input
                    type="date"
                    name="move_in_date"
                    value={form.move_in_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Budget Min (₹)</label>
                  <input
                    type="number"
                    name="budget_min"
                    value={form.budget_min}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Budget Max (₹)</label>
                  <input
                    type="number"
                    name="budget_max"
                    value={form.budget_max}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Preferred City</label>
                  <input
                    type="text"
                    name="preferred_city"
                    value={form.preferred_city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">Preferred Area</label>
                  <input
                    type="text"
                    name="preferred_area"
                    value={form.preferred_area}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-200">Gender Preference (PG)</label>
                <select
                  name="gender_preference"
                  value={form.gender_preference}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <option value="">No preference</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-200">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const active = form.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          active
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                            : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
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

export default TenantProfile;

