import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { contactAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const ContactPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth(); // <-- Get user and auth status
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local validation
  const nameError = formData.name && formData.name.length < 2 ? 'Name must be at least 2 characters' : '';
  const messageError = formData.message && formData.message.length < 10 ? 'Message must be at least 10 characters' : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check login before submit
    if (!isAuthenticated) {
      toast.error('Please log in to send a message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await contactAPI.submitContact(formData);
      if (response.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@artisanaura.in</p>
                    <p className="text-gray-600">hello@artisanaura.in</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-gray-600">+91 87654 32109</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      Block A, Connaught Place<br />
                      New Delhi, Delhi 110001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 10:00 AM - 7:00 PM IST<br />
                      Saturday: 11:00 AM - 5:00 PM IST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Send us a Message</h2>
              {!isAuthenticated ? (
                <div className="text-center text-red-600 font-serif mb-4">
                  Please <a href="/login" className="text-blue-600 underline">log in</a> to send a message.
                </div>
              ) : null}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Name"
                      type="text"
                      name="name"
                      minLength={2}
                      maxLength={24}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {nameError && <p className="text-red-600 text-xs mt-1">{nameError}</p>}
                  </div>
                  <div>
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      maxLength={50}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="return">Return/Exchange</option>
                    <option value="artist">Artist Application</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="press">Press/Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    maxLength={1000}
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                  {messageError && <p className="text-red-600 text-xs mt-1">{messageError}</p>}
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                  disabled={
                    isSubmitting ||
                    !isAuthenticated || // <-- Disable if not logged in
                    !formData.name ||
                    !formData.email ||
                    !formData.subject ||
                    !formData.message ||
                    !!nameError ||
                    !!messageError
                  }
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Visit Our Gallery</h2>
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.674994343309!2d77.21802931508236!3d28.631006982421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0683329da9%3A0x1b2b1b1b1b1b1b1b!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Artistic Manifestation Location - Connaught Place, New Delhi"
              />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Gallery Hours</h3>
                <p className="text-gray-600 text-sm">
                  Tuesday - Saturday: 11 AM - 8 PM<br />
                  Sunday: 12 PM - 6 PM<br />
                  Monday: Closed
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Parking</h3>
                <p className="text-gray-600 text-sm">
                  Paid parking available<br />
                  Metro parking nearby<br />
                  Auto/taxi stand at entrance
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Public Transit</h3>
                <p className="text-gray-600 text-sm">
                  Metro: Rajiv Chowk Station<br />
                  Bus: Multiple routes available<br />
                  2 min walk from metro exit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
