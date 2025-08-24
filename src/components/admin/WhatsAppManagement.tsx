import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2, Search, Phone, User, Calendar, CheckSquare, Square, RefreshCw, Settings, TestTube, CheckCircle, XCircle } from 'lucide-react';

interface WhatsAppSubscription {
  _id: string;
  phoneNumber: string;
  user?: {
    name: string;
    email: string;
  };
  subscribedAt: string;
  lastMessageSent?: string;
}

interface WhatsAppMessage {
  _id: string;
  message: string;
  sentBy: {
    name: string;
    email: string;
  };
  recipientCount: number;
  successCount: number;
  failureCount: number;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  sentAt: string;
}

interface WhatsAppConfig {
  configured: boolean;
  phoneNumberId?: string;
  phoneInfo?: any;
  apiVersion: string;
}

const WhatsAppManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<WhatsAppSubscription[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'messages' | 'config'>('subscriptions');
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadSubscriptions();
    loadMessages();
    loadConfig();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await fetch(`${API_URL}/whatsapp/admin/subscriptions?${params.toString()}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setSubscriptions(data.data);
      } else {
        setError(data.message || 'Failed to load subscriptions');
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/whatsapp/admin/messages`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/whatsapp/admin/config`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleTestConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testPhoneNumber.trim()) {
      setError('Test phone number is required');
      return;
    }

    try {
      setTestLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/whatsapp/admin/test-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ testPhoneNumber }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Test message sent successfully! Check your WhatsApp.');
        setTestPhoneNumber('');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.message || 'Failed to send test message');
      }
    } catch (error) {
      console.error('Error testing config:', error);
      setError('Error testing configuration');
    } finally {
      setTestLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSubscriptions();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) {
      setError('Message is required');
      return;
    }

    try {
      setMessageLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/whatsapp/admin/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: messageText,
          selectedNumbers: selectedNumbers.length > 0 ? selectedNumbers : undefined
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Message is being sent to ${data.data.recipientCount} subscribers`);
        setMessageText('');
        setShowMessageForm(false);
        setSelectedNumbers([]);
        setSelectAll(false);
        setTimeout(() => setSuccess(''), 3000);
        await loadMessages();
      } else {
        setError(data.message || 'Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
    } finally {
      setMessageLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/whatsapp/admin/subscriptions/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        await loadSubscriptions();
        setSuccess('Subscription deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error deleting subscription');
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      setError('Error deleting subscription');
    } finally {
      setLoading(false);
    }
  };

  const toggleNumberSelection = (phoneNumber: string) => {
    setSelectedNumbers(prev => 
      prev.includes(phoneNumber)
        ? prev.filter(num => num !== phoneNumber)
        : [...prev, phoneNumber]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedNumbers([]);
    } else {
      setSelectedNumbers(subscriptions.map(sub => sub.phoneNumber));
    }
    setSelectAll(!selectAll);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">WhatsApp Management</h2>
        <button
          onClick={() => setShowMessageForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subscriptions'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Subscriptions ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Message History ({messages.length})
          </button>
        </nav>
      </div>

      {activeTab === 'subscriptions' && (
        <>
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Search by phone number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  loadSubscriptions();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                title="Reset search"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </form>
          </div>

          {subscriptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
              
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                {selectedNumbers.length} numbers selected
              </span>
            </div>
          )}

          {/* Subscriptions List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No WhatsApp subscriptions found.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <div key={subscription._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedNumbers.includes(subscription.phoneNumber)}
                          onChange={() => toggleNumberSelection(subscription.phoneNumber)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">{subscription.phoneNumber}</p>
                            {subscription.user && (
                              <p className="text-sm text-gray-500">{subscription.user.name} ({subscription.user.email})</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                          <div>Subscribed: {new Date(subscription.subscribedAt).toLocaleDateString()}</div>
                          {subscription.lastMessageSent && (
                            <div>Last message: {new Date(subscription.lastMessageSent).toLocaleDateString()}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteSubscription(subscription._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete subscription"
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
        </>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No messages sent yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div key={message._id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{message.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By: {message.sentBy.name}</span>
                        <span>Sent: {new Date(message.sentAt).toLocaleString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      <div>Recipients: {message.recipientCount}</div>
                      <div className="text-green-600">Success: {message.successCount}</div>
                      {message.failureCount > 0 && (
                        <div className="text-red-600">Failed: {message.failureCount}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Send WhatsApp Message</h3>
                <button
                  onClick={() => {
                    setShowMessageForm(false);
                    setMessageText('');
                    setError('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    required
                    rows={6}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your WhatsApp message..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {messageText.length}/1000 characters
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> An opt-out instruction will be automatically added to each message.
                    {selectedNumbers.length > 0 
                      ? ` This message will be sent to ${selectedNumbers.length} selected subscribers.`
                      : ` This message will be sent to all ${subscriptions.length} subscribers.`
                    }
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={messageLoading}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {messageLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessageForm(false);
                      setMessageText('');
                      setError('');
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
    </div>
  );
};

export default WhatsAppManagement;
