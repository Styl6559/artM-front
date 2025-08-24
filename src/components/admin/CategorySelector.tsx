import React from 'react';

const categories = [
  { key: 'angels', label: 'Angels' },
  { key: 'vcs', label: 'VCs' },
  { key: 'microvcs', label: 'Micro VCs' },
  { key: 'incubators', label: 'Incubators' },
  { key: 'accelerators', label: 'Accelerators' },
  { key: 'grants', label: 'Govt Grants' },
];

interface CategorySelectorProps {
  selected: string;
  onSelect: (key: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.key}
          className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
            selected === cat.key
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
          }`}
          onClick={() => onSelect(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector; 