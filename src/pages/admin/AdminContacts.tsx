import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, MessageSquare, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { adminAPI } from '../../lib/adminApi';
import toast from 'react-hot-toast';

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await adminAPI.getContacts();
      if (response.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const response = await adminAPI.updateContact(id, { status });
      if (response.success) {
        if (status === 'resolved') {
          toast.success('Contact resolved and removed!');
          // Remove from local state since it's deleted from database
          setContacts(prev => prev.filter(contact => contact._id !== id));
          if (selectedContact?._id === id) {
            setSelectedContact(null);
          }
        } else {
          toast.success('Contact updated!');
          fetchContacts();
          if (selectedContact?._id === id) {
            setSelectedContact(response.data.contact);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = !statusFilter || contact.status === statusFilter;
    const matchesSubject = !subjectFilter || contact.subject === subjectFilter;
    return matchesStatus && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 font-serif">Contact Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {contacts.filter(c => c.status === 'new').length} new messages
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contacts List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Subjects</option>
                    <option value="general">General</option>
                    <option value="order">Order</option>
                    <option value="shipping">Shipping</option>
                    <option value="return">Return</option>
                    <option value="artist">Artist</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="press">Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contacts List */}
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedContact?._id === contact._id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                      <p className="text-sm text-gray-500 mb-2">Subject: {contact.subject}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                      <Eye className="w-4 h-4 text-gray-400 mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <p className="text-gray-900 capitalize">{selectedContact.subject}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Message</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedContact.message}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <p className="text-gray-900">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <select
                      value={selectedContact.status}
                      onChange={(e) => updateContactStatus(selectedContact._id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="resolved">Resolved (Delete)</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateContactStatus(selectedContact._id, 'replied')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Mark Replied
                    </Button>
                    <Button
                      onClick={() => updateContactStatus(selectedContact._id, 'resolved')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve & Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a contact to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;
