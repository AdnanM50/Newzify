import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';

interface MultiSelectProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const safeValue = Array.isArray(value) ? value : [];
    const newValue = safeValue.includes(optionValue)
      ? safeValue.filter((v) => v !== optionValue)
      : [...safeValue, optionValue];
    onChange(newValue);
  };

  const removeTag = (optionValue: string) => {
    const safeValue = Array.isArray(value) ? value : [];
    onChange(safeValue.filter((v) => v !== optionValue));
  };

  const safeValue = Array.isArray(value) ? value : [];

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[45px] w-full px-3 py-1.5 rounded-lg border bg-white flex flex-wrap items-center gap-2 cursor-pointer transition-all ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-300'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 flex-grow">
          {safeValue.length > 0 ? (
            safeValue.map((v) => {
              const option = options.find((o) => o.value === v);
              return (
                <div
                  key={v}
                  className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <span>{option?.label || v}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(v);
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          ) : (
            <span className="text-gray-400 text-sm ml-1">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center gap-3 ml-2">
            <div className="w-[1.5px] h-6 bg-gray-200"></div>
            <Search className="text-gray-300" size={18} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto py-2">
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected = safeValue.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.value);
                    }}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="text-[14px] font-medium">{option.label}</span>
                    {isSelected && (
                      <Check size={18} className="text-blue-600" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
