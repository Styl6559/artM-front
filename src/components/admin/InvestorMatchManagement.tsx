import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Target, Upload } from 'lucide-react';
import ExcelUploadModal from './ExcelUploadModal';

interface InvestorMatch {
  _id: string;
  name: string;
  stage: string;
  industry: string;
  traction: string;
  description: string;
  checkSize: string;
  location: string;
  website?: string;
  email?: string;
  linkedin?: string;
}

const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
const tractions = ['Idea', 'MVP', 'Users', 'Revenue', 'Profitable'];

const InvestorMatchManagement: React.FC = () => {
  const [matches, setMatches] = useState<InvestorMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<InvestorMatch | null>(null);
  const [formData, setFormData] = useState<Partial<InvestorMatch>>({});
  const [search, setSearch] = useState('');
  const [showExcelUpload, setShowExcelUpload] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/investor-matches`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setMatches(data.data);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const url = editingMatch 
        ? `${API_URL}/admin/investor-matches/${editingMatch._id}`
        : `${API_URL}/admin/investor-matches`;
      
      const method = editingMatch ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadMatches();
        setShowForm(false);
        setEditingMatch(null);
        setFormData({});
      } else {
        alert(data.message || 'Error saving investor match');
      }
    } catch (error) {
      console.error('Error saving investor match:', error);
      alert('Error saving investor match');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (match: InvestorMatch) => {
    setEditingMatch(match);
    setFormData(match);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investor match?')) return;
    
    console.log(`Deleting investor match with ID: ${id}`);
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/investor-matches/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      console.log(`Delete response status: ${response.status}`);
      
      try {
        if (response.ok) {
          const data = await response.json();
          
          console.log('Delete response data:', JSON.stringify(data));
          
          if (data.success) {
            await loadMatches();
            alert('Investor match deleted successfully');
          } else {
            alert(data.message || 'Error deleting investor match');
          }
        } else {
          alert(`Error deleting investor match: ${response.statusText}`);
        }
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        alert('Error processing server response');
      }
    } catch (error) {
      console.error('Error deleting investor match:', error);
      alert('Error deleting investor match');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredMatches = matches.filter(match =>
    match.name?.toLowerCase().includes(search.toLowerCase()) ||
    match.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Investor Matches</h2>
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
              setEditingMatch(null);
              setFormData({});
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add New Match
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search matches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Matches List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No investor matches found. Click "Add New Match" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMatches.map((match) => (
              <div key={match._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{match.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {match.stage}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {match.industry}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {match.traction}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{match.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Check Size: {match.checkSize}</span>
                      <span>Location: {match.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(match)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(match._id)}
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
                {editingMatch ? 'Edit' : 'Add'} Investor Match
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stage <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="stage"
                      value={formData.stage || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Stage</option>
                      {stages.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Traction <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="traction"
                      value={formData.traction || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Traction</option>
                      {tractions.map(traction => (
                        <option key={traction} value={traction}>{traction}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="checkSize"
                      value={formData.checkSize || ''}
                      onChange={handleChange}
                      required
                      placeholder="e.g., $1M-$5M"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingMatch ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingMatch(null);
                      setFormData({});
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
        category="investor-matches"
        onUploadSuccess={() => {
          loadMatches();
          setShowExcelUpload(false);
        }}
      />
    </div>
  );
};

export default InvestorMatchManagement;