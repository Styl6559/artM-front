import React, { useState, useEffect } from 'react';

const fieldConfigs: Record<string, { name: string; label: string; type?: string }[]> = {
  angels: [
    { name: 'name', label: 'Name' },
    { name: 'linkedin', label: 'LinkedIn' },
    { name: 'city', label: 'City' },
    { name: 'invests_in', label: 'Invests In' },
  ],
  vcs: [
    { name: 'name', label: 'Name' },
    { name: 'website', label: 'Website' },
    { name: 'hq', label: 'HQ' },
    { name: 'fund_size', label: 'Fund Size' },
  ],
  microvcs: [
    { name: 'name', label: 'Name' },
    { name: 'website', label: 'Website' },
    { name: 'hq', label: 'HQ' },
    { name: 'fund_size', label: 'Fund Size' },
  ],
  incubators: [
    { name: 'name', label: 'Name' },
    { name: 'website', label: 'Website' },
    { name: 'city', label: 'City' },
    { name: 'focus', label: 'Focus' },
  ],
  accelerators: [
    { name: 'name', label: 'Name' },
    { name: 'website', label: 'Website' },
    { name: 'city', label: 'City' },
    { name: 'focus', label: 'Focus' },
  ],
  grants: [
    { name: 'name', label: 'Name' },
    { name: 'website', label: 'Website' },
    { name: 'country', label: 'Country' },
    { name: 'type', label: 'Type' },
  ],
};

interface AdminFundingCardFormProps {
  category: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AdminFundingCardForm: React.FC<AdminFundingCardFormProps> = ({ category, initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, category]);

  const fields = fieldConfigs[category] || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          <input
            type={field.type || 'text'}
            name={field.name}
            value={form[field.name] || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      ))}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
};

export default AdminFundingCardForm; 