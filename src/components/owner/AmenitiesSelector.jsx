import React from 'react';

const AMENITY_OPTIONS = [
  'WiFi',
  'Parking',
  'AC',
  'Food',
  'Laundry',
  'CCTV',
  'Power Backup',
  'Water Supply',
];

const AmenitiesSelector = ({ value, onChange }) => {
  const handleToggle = (amenity) => {
    const exists = value.includes(amenity);
    if (exists) {
      onChange(value.filter((a) => a !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-200">Amenities</label>
      <div className="flex flex-wrap gap-2">
        {AMENITY_OPTIONS.map((amenity) => {
          const active = value.includes(amenity);
          return (
            <button
              key={amenity}
              type="button"
              onClick={() => handleToggle(amenity)}
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
  );
};

export default AmenitiesSelector;

