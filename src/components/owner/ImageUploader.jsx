import React from 'react';

const ImageUploader = ({ label, multiple = true, files, onChange, accept }) => {
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (multiple) {
      onChange([...files, ...selected]);
    } else {
      onChange(selected.slice(0, 1));
    }
  };

  const handleRemove = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
  };

  const isImage = (file) => file.type.startsWith('image/');

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-200">{label}</label>
      <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-4 text-xs text-slate-300">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-center hover:border-slate-500">
          <span className="text-[11px] font-medium text-slate-100">
            Drag &amp; drop files here, or click to browse
          </span>
          <span className="text-[10px] text-slate-400">{accept}</span>
          <input
            type="file"
            className="hidden"
            multiple={multiple}
            accept={accept}
            onChange={handleFileChange}
          />
        </label>

        {files.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900/80 p-2"
              >
                {isImage(file) ? (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-24 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-24 items-center justify-center text-[11px] text-slate-300">
                    {file.name}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-1 top-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-200 opacity-80 hover:bg-rose-600 hover:text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

