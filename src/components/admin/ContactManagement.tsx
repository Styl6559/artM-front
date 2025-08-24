import React, { useState, useEffect } from 'react';
import { Mail, Reply, Trash2, Search, Clock, User } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  replies: Array<{
    message: string;
    sentAt: string;
    sentBy: {
      name: string;
      email: string;
    };
  }>;
  createdAt: string;
}

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/contacts`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (contactId: string) => {
    if (!replyMessage.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/contacts/reply/${contactId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: replyMessage }),
      });

      const data = await response.json();
      
      if (data.success) {
        setReplyMessage('');
        await loadContacts();
        // Update selected contact if it's the one we replied to
        if (selectedContact?._id === contactId) {
          setSelectedContact(data.data);
        }
      } else {
        alert(data.message || 'Error sending reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    
    console.log(`Deleting contact with ID: ${contactId}`);
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/contacts/${contactId}`, { 
        method: 'DELETE',
        credentials: 'include'
      });

      console.log(`Delete response status: ${response.status}`);
      
      try {
        if (response.ok) {
          const data = await response.json();
          console.log('Delete response data:', JSON.stringify(data));
          
          if (data.success) {
            await loadContacts();
            if (selectedContact?._id === contactId) {
              setSelectedContact(null);
            } 
            alert('Contact deleted successfully');
          } else {
            alert(data.message || 'Error deleting contact. Check console for details.');
          }
        } else {
          alert(`Error deleting contact: ${response.statusText}`);
        }
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        alert('Error processing server response');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(search.toLowerCase()) ||
                         contact.email.toLowerCase().includes(search.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <div className="text-sm text-gray-500">
          {contacts.length} total messages
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Messages</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No contact messages found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedContact?._id === contact._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{contact.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{contact.subject}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-lg shadow">
          {selectedContact ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedContact.subject}</h3>
                  <p className="text-sm text-gray-600">From: {selectedContact.name} ({selectedContact.email})</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Original Message:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Replies */}
              {selectedContact.replies && selectedContact.replies.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Replies:</h4>
                  <div className="space-y-3">
                    {selectedContact.replies.map((reply, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          By {reply.sentBy.name} on {new Date(reply.sentAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Send Reply:</h4>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleReply(selectedContact._id)}
                  disabled={!replyMessage.trim() || loading}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Reply className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>Select a contact message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;