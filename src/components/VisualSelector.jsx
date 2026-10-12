import React from 'react';

export default function VisualSelector({ title, options, value, onChange, isMulti = false, imageSrc, helpText }) {
  const handleSelect = (optionValue) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  const isSelected = (optionValue) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <span>{title}</span>
        </h4>
        {helpText && <span className="text-xs text-slate-500 font-normal">{helpText}</span>}
      </div>

      {/* Reference Diagram Image */}
      {imageSrc && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-center items-center overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="max-h-48 object-contain rounded-lg shadow-xs transition-transform hover:scale-105"
          />
        </div>
      )}

      {/* Options Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {options.map((opt) => {
          const selected = isSelected(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 text-sm font-medium ${
                selected
                  ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-slate-900">{opt.label}</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  selected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {selected && '✓'}
                </span>
              </div>
              {opt.desc && <span className="text-xs text-slate-500 leading-snug">{opt.desc}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
