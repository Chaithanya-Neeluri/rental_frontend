import React from 'react';

const LocationForm = ({ location, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...location, [name]: value });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-100">Location</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200">City</label>
          <input
            type="text"
            name="city"
            value={location.city}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200">Area</label>
          <input
            type="text"
            name="area"
            value={location.area}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-200">Address</label>
        <input
          type="text"
          name="address"
          value={location.address}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={location.pincode}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200">Latitude (optional)</label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={location.latitude}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200">Longitude (optional)</label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={location.longitude}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationForm;

