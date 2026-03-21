import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { EnquiryApi, PropertyApi } from '../api/index.js';

const STATUS_OPTIONS = ['Available', 'Booked'];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [enquiries, setEnquiries] = useState([]);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState('');

  const ownerId = user?.id;

  const sortedProperties = useMemo(
    () => [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [properties],
  );

  useEffect(() => {
    if (!ownerId) return;

    const fetchProperties = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await PropertyApi.listForOwner(ownerId);
        setProperties(data.properties || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load owner properties', err);
        const apiMessage = err?.response?.data?.message;
        setError(apiMessage || 'Failed to load your properties.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [ownerId]);

  const fetchEnquiries = async () => {
    if (!ownerId) return;
    setIsLoadingEnquiries(true);
    setEnquiriesError('');

    try {
      const { data } = await EnquiryApi.listForOwner();
      setEnquiries(data.enquiries || []);
      setUnreadEnquiriesCount(data.unreadCount || 0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load owner enquiries', err);
      const apiMessage = err?.response?.data?.message;
      setEnquiriesError(apiMessage || 'Failed to load enquiries.');
      setEnquiries([]);
      setUnreadEnquiriesCount(0);
    } finally {
      setIsLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  const handleMarkEnquiryRead = async (enquiryId) => {
    try {
      await EnquiryApi.markRead(enquiryId);
      await fetchEnquiries();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to mark enquiry read', err);
      const apiMessage = err?.response?.data?.message;
      setEnquiriesError(apiMessage || 'Failed to update enquiry.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleListProperty = () => {
    navigate('/owner/add-property');
  };

  const startEdit = (property) => {
    setEditingId(property._id);
    setSaveMessage('');
    setError('');
    setEditForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price?.toString() || '',
      status: property.status || 'Available',
      propertyType: property.propertyType || '',
      location_city: property.location?.city || '',
      location_area: property.location?.area || '',
      location_address: property.location?.address || '',
      location_pincode: property.location?.pincode || '',
      amenities: (property.amenities || []).join(', '),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setIsSaving(false);
    setSaveMessage('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (propertyId) => {
    if (!editForm) return;

    setIsSaving(true);
    setSaveMessage('Saving changes...');
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('status', editForm.status);
      formData.append('propertyType', editForm.propertyType);
      formData.append('location_city', editForm.location_city);
      formData.append('location_area', editForm.location_area);
      formData.append('location_address', editForm.location_address);
      formData.append('location_pincode', editForm.location_pincode);

      if (editForm.amenities) {
        // Send as comma-separated string; backend will normalise
        formData.append('amenities', editForm.amenities);
      }

      const { data } = await PropertyApi.update(propertyId, formData);

      setProperties((prev) =>
        prev.map((p) => (p._id === propertyId ? { ...p, ...data.property } : p)),
      );
      setSaveMessage('Changes saved.');
      setTimeout(() => {
        cancelEdit();
      }, 600);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to update property', err);
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || 'Failed to update property. Please try again.');
      setSaveMessage('');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || user.role !== 'owner') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-400">
            You must be logged in as an owner to view this dashboard.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex flex-1">
        <Container className="py-10">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                  Welcome, {user?.name || user?.email || 'Owner'}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Manage your listed properties, update details, and keep your listings fresh.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleListProperty}>
                  List a Property
                </Button>
                <Button variant="ghost" size="md" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            {user?.location && user.location.latitude && user.location.longitude && (
              <div className="mt-4 rounded-2xl bg-slate-900/80 p-4 text-xs text-slate-300">
                <p className="font-medium text-slate-200">Your saved location</p>
                <p className="mt-1">
                  Lat: {user.location.latitude.toFixed(5)}, Lng:{' '}
                  {user.location.longitude.toFixed(5)}
                </p>
              </div>
            )}

            <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-soft sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Enquiries</h2>
                  <p className="mt-0.5 text-xs sm:text-[11px] text-slate-400">
                    Tenants who enquire will show up here.
                  </p>
                </div>
                {unreadEnquiriesCount > 0 ? (
                  <span className="rounded-full bg-emerald-900/30 px-3 py-1 text-[10px] font-medium text-emerald-300">
                    {unreadEnquiriesCount} new
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-medium text-slate-300">
                    No new
                  </span>
                )}
              </div>

              {isLoadingEnquiries && (
                <p className="mt-4 text-xs sm:text-[11px] text-slate-400">Loading enquiries...</p>
              )}
              {enquiriesError && (
                <p className="mt-4 text-xs sm:text-[11px] text-rose-400">{enquiriesError}</p>
              )}

              {!isLoadingEnquiries && !enquiriesError && enquiries.length === 0 && (
                <p className="mt-4 text-xs sm:text-[11px] text-slate-400">
                  No enquiries yet. When tenants inquire, they’ll appear here.
                </p>
              )}

              {!isLoadingEnquiries && !enquiriesError && enquiries.length > 0 && (
                <div className="mt-4 space-y-3">
                  {enquiries.slice(0, 6).map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className={`rounded-2xl border p-4 ${
                        enquiry.read_status
                          ? 'border-slate-800 bg-slate-950/30'
                          : 'border-emerald-500/40 bg-emerald-900/15'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-50">
                            {enquiry.tenant?.name || 'Tenant'}
                          </p>
                          <p className="mt-0.5 text-xs sm:text-[11px] text-slate-400">
                            {enquiry.property?.title || 'Property'}
                          </p>
                        </div>
                        {!enquiry.read_status && (
                          <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-xs sm:text-[11px] text-slate-200 line-clamp-3">
                        {enquiry.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {enquiry.tenant?.mobile ? (
                          <Button
                            as="a"
                            href={`tel:${enquiry.tenant.mobile}`}
                            size="xs"
                            variant="secondary"
                            className="text-xs sm:text-[11px]"
                          >
                            Call
                          </Button>
                        ) : (
                          <span className="text-xs sm:text-[11px] text-slate-500">No phone</span>
                        )}

                        {enquiry.tenant?.email ? (
                          <Button
                            as="a"
                            href={`mailto:${enquiry.tenant.email}`}
                            size="xs"
                            variant="secondary"
                            className="text-xs sm:text-[11px]"
                          >
                            Email
                          </Button>
                        ) : (
                          <span className="text-xs sm:text-[11px] text-slate-500">No email</span>
                        )}

                        <Button
                          size="xs"
                          variant="ghost"
                            className="text-xs sm:text-[11px]"
                          disabled={enquiry.read_status}
                          onClick={() => handleMarkEnquiryRead(enquiry.id)}
                        >
                          {enquiry.read_status ? 'Read' : 'Mark read'}
                        </Button>

                        {enquiry.created_at && (
                          <span className="text-[10px] text-slate-500">
                            {new Date(enquiry.created_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="mt-6">
              {isLoading && (
                <p className="text-xs text-slate-400">Loading your properties...</p>
              )}
              {error && <p className="text-xs text-rose-400">{error}</p>}

              {!isLoading && !error && sortedProperties.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
                  <p>You haven&apos;t listed any properties yet.</p>
                  <Button size="sm" className="mt-3" onClick={handleListProperty}>
                    List your first property
                  </Button>
                </div>
              )}

              {!isLoading && sortedProperties.length > 0 && (
                <div className="grid gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedProperties.map((property) => {
                    const isEditing = editingId === property._id;
                    const firstImage = property.images?.[0];

                    return (
                      <div
                        key={property._id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-md transition hover:border-slate-600 hover:shadow-lg"
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
                          {!isEditing ? (
                            <>
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
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                    property.status === 'Available'
                                      ? 'bg-emerald-900/40 text-emerald-300'
                                      : 'bg-amber-900/40 text-amber-300'
                                  }`}
                                >
                                  {property.status}
                                </span>
                              </div>

                              {property.amenities && property.amenities.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {property.amenities.slice(0, 4).map((amenity) => (
                                    <span
                                      key={amenity}
                                      className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {property.amenities.length > 4 && (
                                    <span className="text-[10px] text-slate-500">
                                      +{property.amenities.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="mt-4 flex items-center justify-between gap-2">
                                <Button
                                  size="xs"
                                  className="text-xs sm:text-[11px]"
                                  variant="secondary"
                                  onClick={() => startEdit(property)}
                                >
                                  Edit Details
                                </Button>
                                <p className="text-[10px] text-slate-500">
                                  Updated on{' '}
                                  {property.updatedAt
                                    ? new Date(property.updatedAt).toLocaleDateString()
                                    : new Date(property.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-medium text-slate-200">
                                    Title
                                  </label>
                                  <input
                                    name="title"
                                    value={editForm?.title || ''}
                                    onChange={handleEditChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-medium text-slate-200">
                                    Description
                                  </label>
                                  <textarea
                                    name="description"
                                    value={editForm?.description || ''}
                                    onChange={handleEditChange}
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-200">
                                      Price (₹/month)
                                    </label>
                                    <input
                                      type="number"
                                      name="price"
                                      value={editForm?.price || ''}
                                      onChange={handleEditChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-200">
                                      Status
                                    </label>
                                    <select
                                      name="status"
                                      value={editForm?.status || 'Available'}
                                      onChange={handleEditChange}
                                      disabled={!property.is_verified}
                                      className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                      {STATUS_OPTIONS.map((statusOption) => (
                                        <option key={statusOption} value={statusOption}>
                                          {statusOption}
                                        </option>
                                      ))}
                                    </select>
                                    {!property.is_verified && (
                                      <p className="text-[10px] text-amber-300">
                                        Admin approval required to change status.
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-200">
                                      Area
                                    </label>
                                    <input
                                      name="location_area"
                                      value={editForm?.location_area || ''}
                                      onChange={handleEditChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-200">
                                      City
                                    </label>
                                    <input
                                      name="location_city"
                                      value={editForm?.location_city || ''}
                                      onChange={handleEditChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-medium text-slate-200">
                                    Address
                                  </label>
                                  <input
                                    name="location_address"
                                    value={editForm?.location_address || ''}
                                    onChange={handleEditChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-medium text-slate-200">
                                    Pincode
                                  </label>
                                  <input
                                    name="location_pincode"
                                    value={editForm?.location_pincode || ''}
                                    onChange={handleEditChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-medium text-slate-200">
                                    Amenities (comma separated)
                                  </label>
                                  <input
                                    name="amenities"
                                    value={editForm?.amenities || ''}
                                    onChange={handleEditChange}
                                    placeholder="WiFi, Parking, AC"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs sm:text-[11px] text-slate-50 outline-none focus:ring-1 focus:ring-brand-500/70"
                                  />
                                </div>
                              </div>

                              <div className="mt-3 flex items-center justify-between gap-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="xs"
                                    className="text-xs sm:text-[11px]"
                                    disabled={isSaving}
                                    onClick={() => handleSave(property._id)}
                                  >
                                    {isSaving ? 'Saving...' : 'Save'}
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    className="text-xs sm:text-[11px]"
                                    disabled={isSaving}
                                    onClick={cancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                                {saveMessage && !error && (
                                  <p className="text-[10px] text-emerald-400">{saveMessage}</p>
                                )}
                              </div>
                              {error && (
                                <p className="mt-1 text-[10px] text-rose-400">
                                  {error}
                                </p>
                              )}
                            </>
                          )}
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

export default OwnerDashboard;

