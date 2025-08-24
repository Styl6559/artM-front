import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Send, Check, X, CheckSquare, Square, RefreshCw } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  lastLogin?: string;
  subscribed: boolean;
}

interface Newsletter {
  _id: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: {
    name: string;
    email: string;
  };
  recipientCount: number;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  createdAt: string;
}

const NewsletterManagement: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [formData, setFormData] = useState<{subject: string; body: string}>({
    subject: '',
    body: ''
  });
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [search, setSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadNewsletters();
  }, []);

  const loadNewsletters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/newsletter`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setNewsletters(data.data);
      } else {
        setError(data.message || 'Failed to load newsletters');
      }
    } catch (error) {
      console.error('Error loading newsletters:', error);
      setError('Failed to load newsletters');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUserLoading(true);
      const params = new URLSearchParams();
      if (userSearch) {
        params.append('search', userSearch);
      }
      
      const response = await fetch(`${API_URL}/newsletter/users/preferences?${params.toString()}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
        // Reset selected users when loading new users
        setSelectedUserIds([]);
        setSelectAll(false);
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setUserLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.body.trim()) {
      setError('Subject and body are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadNewsletters();
        setShowForm(false);
        setFormData({ subject: '', body: '' });
        setSuccess('Newsletter created successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error creating newsletter');
      }
    } catch (error) {
      console.error('Error creating newsletter:', error);
      setError('Error creating newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async (id: string) => {
    if (!confirm('Are you sure you want to send this newsletter?')) return;
    
    try {
      setSendingNewsletter(true);
      setError('');
      
      const response = await fetch(`${API_URL}/newsletter/${id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          userIds: selectedUserIds.length > 0 ? selectedUserIds : undefined 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Newsletter is being sent to ${data.data.recipientCount} recipients`);
        setTimeout(() => setSuccess(''), 3000);
        setShowUserList(false);
        setSelectedUserIds([]);
        await loadNewsletters();
      } else {
        setError(data.message || 'Error sending newsletter');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      setError('Error sending newsletter');
    } finally {
      setSendingNewsletter(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/newsletter/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        await loadNewsletters();
        setSuccess('Newsletter deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error deleting newsletter');
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      setError('Error deleting newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearch(e.target.value);
  };

  const handleUserSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(user => user._id));
    }
    setSelectAll(!selectAll);
  };

  const updateUserSubscription = async (userId: string, subscribed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/newsletter/users/${userId}/preference`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ subscribed }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setUsers(prev => 
          prev.map(user => 
            user._id === userId 
              ? { ...user, subscribed } 
              : user
          )
        );
      } else {
        setError(data.message || 'Error updating subscription status');
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
      setError('Error updating subscription status');
    }
  };

  const batchUpdateSubscriptions = async (subscribed: boolean) => {
    if (selectedUserIds.length === 0) return;
    
    try {
      const response = await fetch(`${API_URL}/newsletter/users/preferences/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          userIds: selectedUserIds,
          subscribed 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setUsers(prev => 
          prev.map(user => 
            selectedUserIds.includes(user._id) 
              ? { ...user, subscribed } 
              : user
          )
        );
        setSuccess(`Updated ${selectedUserIds.length} user preferences`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error updating subscription status');
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
      setError('Error updating subscription status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Newsletter Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData({ subject: '', body: '' });
              setShowForm(true);
              setShowUserList(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Newsletter
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
          placeholder="Search newsletters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Newsletter List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No newsletters found. Click "Create Newsletter" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNewsletters.map((newsletter) => (
              <div key={newsletter._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{newsletter.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(newsletter.status)}`}>
                        {newsletter.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{newsletter.body}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By: {newsletter.sentBy?.name || 'Unknown'}</span>
                      <span>
                        {newsletter.status !== 'draft' 
                          ? `Sent to: ${newsletter.recipientCount} recipients` 
                          : 'Not sent yet'}
                      </span>
                      <span>Created: {new Date(newsletter.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {newsletter.status === 'draft' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedNewsletter(newsletter);
                            setShowUserList(true);
                            setShowForm(false);
                            loadUsers();
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Send Newsletter"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setFormData({
                              subject: newsletter.subject,
                              body: newsletter.body
                            });
                            setSelectedNewsletter(newsletter);
                            setShowForm(true);
                            setShowUserList(false);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Edit Newsletter"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(newsletter._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Newsletter"
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

      {/* Newsletter Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedNewsletter ? 'Edit' : 'Create'} Newsletter
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Body <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    required
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="You can use HTML tags for formatting"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : selectedNewsletter ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedNewsletter(null);
                      setFormData({ subject: '', body: '' });
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

      {/* User Selection Modal */}
      {showUserList && selectedNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  Send Newsletter: {selectedNewsletter.subject}
                </h3>
                <button
                  onClick={() => {
                    setShowUserList(false);
                    setSelectedNewsletter(null);
                    setSelectedUserIds([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
              </div>

              <div className="mb-4">
                <form onSubmit={handleUserSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={handleUserSearch}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserSearch('');
                      loadUsers();
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    title="Reset search"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                >
                  {selectAll ? (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4" />
                      Select All
                    </>
                  )}
                </button>
                
                {selectedUserIds.length > 0 && (
                  <>
                    <button
                      onClick={() => batchUpdateSubscriptions(true)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                    >
                      <Check className="w-4 h-4" />
                      Subscribe Selected
                    </button>
                    <button
                      onClick={() => batchUpdateSubscriptions(false)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                      Unsubscribe Selected
                    </button>
                  </>
                )}
                
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                  {selectedUserIds.length} users selected
                </span>
              </div>

              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(user._id)}
                              onChange={() => toggleUserSelection(user._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => updateUserSubscription(user._id, !user.subscribed)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                user.subscribed 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {user.subscribed ? (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Subscribed
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3 mr-1" />
                                  Unsubscribed
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowUserList(false);
                    setSelectedNewsletter(null);
                    setSelectedUserIds([]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendNewsletter(selectedNewsletter._id)}
                  disabled={sendingNewsletter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingNewsletter ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {selectedUserIds.length > 0 
                        ? `Send to ${selectedUserIds.length} Selected Users` 
                        : 'Send to All Subscribed Users'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;