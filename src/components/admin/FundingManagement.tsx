import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Upload } from 'lucide-react';
import ExcelUploadModal from './ExcelUploadModal';

interface FundingItem {
  _id: string;
  name: string;
  [key: string]: any;
}

interface FundingManagementProps {
  category: string;
}

const categoryLabels: Record<string, string> = {
  'angel-investors': 'Angel Investors',
  'venture-capital': 'Venture Capital',
  'micro-vcs': 'Micro VCs',
  'incubators': 'Incubators',
  'accelerators': 'Accelerators',
  'govt-grants': 'Government Grants'
};

const categoryFields: Record<string, { name: string; label: string; type?: string; required?: boolean; options?: string[]; multi?: boolean }[]> = {
  'angel-investors': [
    { name: 'name', label: 'Name', required: true },
    { name: 'linkedinProfileUrl', label: 'LinkedIn Profile URL' },
    { name: 'city', label: 'City', required: true },
    { name: 'country', label: 'Country', required: true },
    { name: 'investCategory', label: 'Investment Categories', required: true, options: ['Fintech', 'Consumer', 'SaaS', 'Healthtech', 'Edtech', 'E-commerce', 'AI/ML', 'Deep Tech', 'Clean Tech', 'Other'], multi: true },
    { name: 'ticketSize', label: 'Ticket Size (₹)', type: 'number', required: true },
    { name: 'stage', label: 'Stages', required: true, options: ['Idea', 'MVP', 'Pre-revenue', 'Revenue', 'Growth'], multi: true },
    { name: 'preferFounderProfile', label: 'Preferred Founder Profile' },
    { name: 'portfolioHighlights', label: 'Portfolio Highlights' },
    { name: 'contact', label: 'Contact', required: true }
  ],
  'venture-capital': [
    { name: 'name', label: 'Name', required: true },
    { name: 'websiteUrl', label: 'Website URL' },
    { name: 'headOffice', label: 'Head Office', required: true },
    { name: 'fundSize', label: 'Fund Size (₹)', type: 'number', required: true },
    { name: 'stageFocus', label: 'Stage Focus', required: true, options: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'], multi: true },
    { name: 'sectorFocus', label: 'Sector Focus', required: true, options: ['SaaS', 'Fintech', 'D2C', 'Healthtech', 'Edtech', 'E-commerce', 'AI/ML', 'Deep Tech', 'Clean Tech', 'Other'], multi: true },
    { name: 'avgTicketSize', label: 'Average Ticket Size (₹)', type: 'number', required: true },
    { name: 'applicationProcess', label: 'Application Process', options: ['Warm intro', 'Direct pitch', 'Online application', 'Referral only'] },
    { name: 'contact', label: 'Contact', required: true },
    { name: 'portfolioHighlights', label: 'Portfolio Highlights' },
    { name: 'investmentThesis', label: 'Investment Thesis' }
  ],
  'micro-vcs': [
    { name: 'name', label: 'Name', required: true },
    { name: 'websiteUrl', label: 'Website URL' },
    { name: 'location', label: 'Location', required: true },
    { name: 'fundSize', label: 'Fund Size (₹)', type: 'number', required: true },
    { name: 'checkSize', label: 'Check Size (₹)', type: 'number', required: true },
    { name: 'stage', label: 'Stages', required: true, options: ['Pre-seed', 'Seed', 'Series A'], multi: true },
    { name: 'sector', label: 'Sectors', required: true, options: ['Deeptech', 'B2B SaaS', 'Fintech', 'Healthtech', 'Edtech', 'AI/ML', 'Clean Tech', 'Other'], multi: true },
    { name: 'contact', label: 'Contact', required: true },
    { name: 'portfolioHighlights', label: 'Portfolio Highlights' }
  ],
  'incubators': [
    { name: 'name', label: 'Name', required: true },
    { name: 'websiteUrl', label: 'Website URL' },
    { name: 'location', label: 'Location', required: true },
    { name: 'fundingSupport', label: 'Funding Support', required: true },
    { name: 'otherBenefits', label: 'Other Benefits' },
    { name: 'eligibility', label: 'Eligibility', required: true },
    { name: 'applicationProcess', label: 'Application Process', options: ['Rolling', 'Batch-based', 'Quarterly', 'Bi-annual'] },
    { name: 'contact', label: 'Contact', required: true },
    { name: 'alumniStartups', label: 'Alumni Startups' }
  ],
  'accelerators': [
    { name: 'name', label: 'Name', required: true },
    { name: 'websiteUrl', label: 'Website URL' },
    { name: 'hq', label: 'Headquarters', required: true },
    { name: 'batchFrequency', label: 'Batch Frequency', required: true },
    { name: 'stage', label: 'Stages', required: true, options: ['Idea', 'MVP', 'Early Revenue', 'Growth'], multi: true },
    { name: 'fundingOffered', label: 'Funding Offered', required: true },
    { name: 'programDuration', label: 'Program Duration', required: true },
    { name: 'servicesProvided', label: 'Services Provided' },
    { name: 'sectors', label: 'Sectors', required: true, options: ['Agnostic', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'SaaS', 'AI/ML', 'Deep Tech', 'Clean Tech', 'Other'], multi: true },
    { name: 'applicationLink', label: 'Application Link' },
    { name: 'pastCohorts', label: 'Past Cohorts' }
  ],
  'govt-grants': [
    { name: 'name', label: 'Name', required: true },
    { name: 'authority', label: 'Authority', required: true, options: ['DPIIT', 'DST', 'MSME', 'BIRAC', 'SERB', 'CSIR', 'Other'] },
    { name: 'stage', label: 'Stages', required: true, options: ['Idea', 'MVP', 'Pre-revenue', 'Revenue', 'Growth'], multi: true },
    { name: 'sector', label: 'Sector', options: ['Open', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'SaaS', 'AI/ML', 'Deep Tech', 'Clean Tech', 'Manufacturing', 'Agriculture', 'Other'] },
    { name: 'grantSize', label: 'Grant Size (₹)', type: 'number', required: true },
    { name: 'equityDilution', label: 'Equity Dilution' },
    { name: 'eligibility', label: 'Eligibility', required: true },
    { name: 'howToApply', label: 'How to Apply', required: true },
    { name: 'timelines', label: 'Timelines', required: true },
    { name: 'contact', label: 'Contact', required: true },
    { name: 'documentsRequired', label: 'Documents Required (optional, comma separated)' },
    { name: 'specialNotes', label: 'Special Notes' }
  ]
};

const FundingManagement: React.FC<FundingManagementProps> = ({ category }) => {
  const [items, setItems] = useState<FundingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FundingItem | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Initialize with empty arrays for array fields based on category
    const initialData: Record<string, any> = {};
    const fields = categoryFields[category] || [];
    
    fields.forEach(field => {
      if (field.name.includes('stage') || field.name.includes('sector') || 
          field.name.includes('Category') || field.name.includes('Focus') ||
          field.name.includes('documentsRequired')) {
        initialData[field.name] = [];
      } else if (field.type === 'number') {
        initialData[field.name] = 0;
      } else {
        initialData[field.name] = '';
      }
    });
    
    return initialData;
  });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showExcelUpload, setShowExcelUpload] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadItems();
  }, [category]);
  
  // Reset form data when category changes
  useEffect(() => {
    const initialData: Record<string, any> = {};
    const fields = categoryFields[category] || [];
    
    fields.forEach(field => {
      if (field.name.includes('stage') || field.name.includes('sector') || 
          field.name.includes('Category') || field.name.includes('Focus') ||
          field.name.includes('documentsRequired')) {
        initialData[field.name] = [];
      } else if (field.type === 'number') {
        initialData[field.name] = 0;
      } else {
        initialData[field.name] = '';
      }
    });
    
    setFormData(initialData);
  }, [category]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/funding/admin/${category}?limit=50`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      } else {
        setError(data.message || 'Failed to load items');
      }
    } catch (error) {
      console.error('Error loading items:', error);
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    fields.forEach(field => {
      let value = formData[field.name];
      
      // Handle array fields
      if (field.multi && typeof value === 'string') {
        value = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        errors[field.name] = `${field.label} is required.`;
      }
      if (field.type === 'number' && value && isNaN(Number(value))) {
        errors[field.name] = `${field.label} must be a number.`;
      }
      if (field.options && value && !field.name.includes('stage') && !field.name.includes('sector') && !field.name.includes('Category') && !field.name.includes('Focus') && !field.name.includes('documentsRequired')) {
        if (!field.options.includes(value)) {
          errors[field.name] = `Invalid value for ${field.label}.`;
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) {
      setError('Please fix the errors in the form.');
      return;
    }
    
    console.log('Form data before submission:', JSON.stringify(formData));
    
    // Create a copy of the form data to process
    const processedData = { ...formData };
    
    // Process array fields before sending
    const fields = categoryFields[category] || [];
    
    fields.forEach(field => {
      // Convert comma-separated strings to arrays for multi-select fields
      if (field.multi && typeof processedData[field.name] === 'string' && processedData[field.name]) {
        processedData[field.name] = processedData[field.name]
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean);
      }
      
      if (field.type === 'number' && processedData[field.name]) {
        processedData[field.name] = Number(processedData[field.name]);
      }
    });
    
    console.log('Processed data for submission:', JSON.stringify(processedData));
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const url = editingItem 
        ? `${API_URL}/funding/admin/${category}/${editingItem._id}`
        : `${API_URL}/funding/admin/${category}`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      console.log('Final data being sent to API:', JSON.stringify(processedData));
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(processedData)
        });
        
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data));
        
        if (data.success) {
          setSuccess(editingItem ? 'Item updated successfully!' : 'Item created successfully!');
          await loadItems();
          setShowForm(false);
          setEditingItem(null);
          setFormData({});
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(data.message || 'Error saving item');
        }
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        setError('Error processing server response');
      }
      
    } catch (error) {
      console.error('Error saving item:', error);
      setError('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: FundingItem) => {
    setEditingItem(item);
    const formattedData: Record<string, any> = {};
    // Copy all properties from the item
    Object.keys(item).forEach(key => {
      formattedData[key] = item[key];
    });
    const fields = categoryFields[category] || [];
    fields.forEach(field => {
      if (field.multi || field.name === 'documentsRequired') {
        if (Array.isArray(item[field.name])) {
          formattedData[field.name] = [...item[field.name]];
        } else if (typeof item[field.name] === 'string') {
          formattedData[field.name] = item[field.name].split(',').map((s: string) => s.trim()).filter(Boolean);
        } else {
          formattedData[field.name] = [];
        }
      }
    });
    setFormData({ ...formattedData });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/funding/admin/${category}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Item deleted successfully!');
        await loadItems();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error deleting item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Error deleting item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For multi-select fields
    if (e.target.multiple) {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const fields = categoryFields[category] || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {categoryLabels[category] || 'Funding Items'}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExcelUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Upload className="w-4 h-4" />
            Excel Upload
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({});
              setShowForm(true);
              setError('');
              setSuccess('');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No items found. Click "Add New" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.location || item.city || item.headOffice || item.hq || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit' : 'Add'} {categoryLabels[category]}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.options ? (
                      field.multi ? (
                        <div className="flex flex-wrap gap-2">
                          {field.options.map(option => (
                            <label key={option} className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                name={field.name}
                                value={option}
                                checked={Array.isArray(formData[field.name]) && formData[field.name].includes(option)}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  setFormData(prev => {
                                    const prevArr = Array.isArray(prev[field.name]) ? prev[field.name] : [];
                                    return {
                                      ...prev,
                                      [field.name]: checked
                                        ? [...prevArr, option]
                                        : prevArr.filter((v: string) => v !== option)
                                    };
                                  });
                                }}
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              [field.name]: value
                            }));
                          }}
                          required={field.required}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )
                    ) : field.type === 'number' ? (
                      <input
                        type="number"
                        min="0"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    ) : field.name.includes('description') || field.name.includes('highlights') || 
                      field.name.includes('notes') || field.name.includes('eligibility') ||
                      field.name.includes('benefits') || field.name.includes('services') ||
                      field.name.includes('howToApply') || field.name.includes('timelines') ||
                      field.name.includes('documentsRequired') ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    ) : field.multi ? (
                      <div>
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          required={field.required}
                          rows={2}
                          placeholder="Enter comma-separated values"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter comma-separated values (e.g., "Value1, Value2, Value3")</p>
                      </div>
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                    {formErrors[field.name] && (
                      <p className="text-xs text-red-600 mt-1">{formErrors[field.name]}</p>
                    )}
                  </div>
                ))}
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setFormData({});
                      setError('');
                      setSuccess('');
                    }}
                    className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={showExcelUpload}
        onClose={() => setShowExcelUpload(false)}
        category={category}
        onUploadSuccess={() => {
          loadItems();
          setShowExcelUpload(false);
        }}
      />
    </div>
  );
};

export default FundingManagement;
