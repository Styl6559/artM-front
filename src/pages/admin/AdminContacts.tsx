import React, { useState, useEffect } from 'react';
import { Filter, Eye, MessageSquare, CheckCircle, Send, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import { adminAPI } from '../../lib/adminApi';
import toast from 'react-hot-toast';

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [reply, setReply] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      // For Cloudinary images, we need to fetch and create blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if download fails
      window.open(imageUrl, '_blank');
      toast.error('Download failed, opened in new tab instead');
    }
  };

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
    // Add confirmation for resolve action
    if (status === 'resolved') {
      if (!confirm('Are you sure you want to resolve and delete this contact? This action cannot be undone.')) {
        return;
      }
    }

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0 sm:h-20 gap-4 sm:gap-0">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4 border border-white/30">
                  <MessageSquare className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-serif">Contact Management</h1>
                <p className="text-white/90 font-light text-sm sm:text-base">Manage customer inquiries</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                <Button
                  onClick={() => window.history.back()}
                  className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 transition-all duration-300 shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2"
                >
                  <span className="hidden sm:inline">← Back</span>
                  <span className="sm:hidden">←</span>
                </Button>
              </div>
              <div className="relative bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-2 border border-white/30 shadow-lg">
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
                <span className="relative text-white font-medium text-xs sm:text-sm">
                  <span className="hidden sm:inline">{contacts.filter(c => c.status === 'new').length} new messages</span>
                  <span className="sm:hidden">{contacts.filter(c => c.status === 'new').length} new</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contacts List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
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
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  >
                    <option value="">All Subjects</option>
                    <option value="general">General</option>
                    <option value="order">Order</option>
                    <option value="shipping">Shipping</option>
                    <option value="return">Return</option>
                    <option value="custom">Custom Design</option>
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
                        {contact.images && contact.images.length > 0 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {contact.images.length} images
                          </span>
                        )}
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

                  {/* Images Section */}
                  {selectedContact.images && selectedContact.images.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Attached Images ({selectedContact.images.length})
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedContact.images.map((image: any, index: number) => (
                          <div key={index} className="group relative">
                            <div
                              className="relative w-full h-32 cursor-pointer rounded-lg border-2 border-gray-300 hover:border-purple-500 transition-all duration-200 overflow-hidden bg-gray-50"
                              onClick={() => {
                                downloadImage(image.url, image.filename);
                              }}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                downloadImage(image.url, image.filename);
                              }}
                              title="Click to download image"
                            >
                              <img
                                src={image.url}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                <div className="bg-white bg-opacity-90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Download className="w-5 h-5 text-gray-700" />
                                </div>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 truncate" title={image.filename}>
                              {image.filename}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                    </select>
                  </div>

                  {/* Reply Section */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Reply Message <span className="text-sm text-gray-500">({reply.length}/5000)</span>
                    </label>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      maxLength={5000}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
                      placeholder="Type your reply here..."
                    />
                    <div className="mt-2 space-y-2">
                      <Button
                        onClick={async () => {
                          if (!reply.trim()) {
                            toast.error('Please type a reply first');
                            return;
                          }
                          if (reply.length > 5000) {
                            toast.error('Reply must be less than 5000 characters');
                            return;
                          }
                          setIsSendingReply(true);
                          try {
                            const response = await adminAPI.replyToContact(selectedContact._id, reply);
                            if (response.success) {
                              toast.success('Reply sent successfully');
                              setReply('');
                              // Update the contact status to replied
                              await updateContactStatus(selectedContact._id, 'replied');
                            } else {
                              toast.error(response.message || 'Failed to send reply');
                            }
                          } catch (error) {
                            toast.error('Failed to send reply');
                          } finally {
                            setIsSendingReply(false);
                          }
                        }}
                        disabled={isSendingReply || !reply.trim() || reply.length > 5000}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        size="sm"
                      >
                        {isSendingReply ? (
                          <span className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <Send className="w-4 h-4 mr-2" />
                            Send Reply
                          </span>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => updateContactStatus(selectedContact._id, 'resolved')}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve & Delete
                      </Button>
                    </div>
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