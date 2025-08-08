import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube, Upload, X, ArrowLeft, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { contactAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get maximum allowed images based on subject
  const getMaxImages = (subject: string) => {
    switch (subject) {
      case 'custom':
        return 3; // Custom design
      case 'order':
        return 1; // Order support
      case 'return':
        return 3; // Exchange/return
      case 'other':
        return 3; // Others
      case 'artist':
        return 1; // Art application
      default:
        return 0; // No images allowed for other subjects
    }
  };

  // Check if current subject supports images
  const supportsImages = (subject: string) => {
    return ['custom', 'order', 'return', 'other', 'artist'].includes(subject);
  };

  const maxImages = getMaxImages(formData.subject);
  const canUploadImages = supportsImages(formData.subject);

  // Autofill user data when logged in
  useEffect(() => {
    if (isAuthenticated && user && user.name && user.email) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [isAuthenticated, user]);

  // Handle URL parameters
  useEffect(() => {
    const subject = searchParams.get('subject');
    const category = searchParams.get('category');
    
    if (subject === 'custom') {
      setFormData(prev => ({
        ...prev,
        subject: 'custom',
        message: category ? `I would like to customize a design for the ${category} category. ` : 'I would like to customize a design. '
      }));
    } else if (subject) {
      setFormData(prev => ({
        ...prev,
        subject: subject
      }));
    }
  }, [searchParams]);

  // Local validation with min/max limits
  const nameError = formData.name && (formData.name.length < 2 || formData.name.length > 50) ? 'Name must be 2-50 characters' : '';
  const emailError = formData.email && (formData.email.length > 50 || !formData.email.includes('@')) ? 'Valid email required (max 50 characters)' : '';
  const messageError = formData.message && (formData.message.length < 10 || formData.message.length > 1000) ? 'Message must be 10-1000 characters' : '';
  
  // Form validation
  const isFormValid = formData.name.length >= 2 && formData.name.length <= 50 &&
                     formData.email.includes('@') && formData.email.length <= 50 &&
                     formData.subject.length > 0 &&
                     formData.message.length >= 10 && formData.message.length <= 1000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If subject is changing, clear images if new subject doesn't support them
    if (name === 'subject') {
      const newSubjectSupportsImages = supportsImages(value);
      if (!newSubjectSupportsImages) {
        setImages([]);
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check if current subject supports images
    if (!canUploadImages) {
      toast.error('Image upload is not supported for this subject');
      return;
    }
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (15MB per file)
    const oversizedFiles = files.filter(file => file.size > 15 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 15MB');
      return;
    }

    // Check total number of images with dynamic limit
    if (images.length + files.length > maxImages) {
      toast.error(`You can upload maximum ${maxImages} image${maxImages > 1 ? 's' : ''} for ${formData.subject} inquiries`);
      return;
    }

    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check login before submit
    if (!isAuthenticated) {
      toast.error('Please log in to send a message.');
      return;
    }

    // Validate form data
    if (!isFormValid) {
      toast.error('Please fill all fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      
      if (images.length > 0) {
        // Use FormData for file uploads
        const uploadData = new FormData();
        uploadData.append('name', formData.name);
        uploadData.append('email', formData.email);
        uploadData.append('subject', formData.subject);
        uploadData.append('message', formData.message);
        
        images.forEach((image) => {
          uploadData.append('images', image);
        });

        response = await contactAPI.submitContactWithImages(uploadData);
      } else {
        // Use regular contact API
        response = await contactAPI.submitContact(formData);
      }

      if (response.success) {
        toast.success(response.message || 'Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setImages([]);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gallery</span>
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Contact Form
            </h1>
            <p className="text-lg text-gray-600 font-light">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800 font-serif">Email</div>
                    <div className="text-gray-600 font-serif">rangleela0506@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <Phone className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800 font-serif">Phone</div>
                    <div className="text-gray-600 font-serif">+91 70177 34431</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800 font-serif">Address</div>
                    <div className="text-gray-600 font-serif">Connaught Place, New Delhi, India</div>
                  </div>
                </div>
                {/* Social Media Icons */}
                <div className="flex items-center gap-4 mt-8">
                  <a href="https://www.facebook.com/profile.php?id=61578559577048" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100 shadow transition-all duration-300">
                    <Facebook className="w-6 h-6 text-blue-600" />
                  </a>
                  <a href="https://x.com/rangleela_X" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 shadow transition-all duration-300">
                    <Twitter className="w-6 h-6 text-slate-700" />
                  </a>
                  <a href="https://www.instagram.com/rangleela.official/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 hover:bg-pink-100 shadow transition-all duration-300">
                    <Instagram className="w-6 h-6 text-pink-500" />
                  </a>
                  <a href="https://www.youtube.com/channel/UCmFNqJDPT8YO8BDYPy5DNHA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 hover:bg-red-100 shadow transition-all duration-300">
                    <Youtube className="w-6 h-6 text-red-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Send us a Message</h2>
              {!isAuthenticated ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 font-serif text-center">
                    Please <Link to="/login" className="text-emerald-600 hover:text-emerald-700 underline font-medium">log in</Link> to send a message.
                  </p>
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
                      maxLength={50}
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
                    {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
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
                    <option value="custom">Custom Design</option>
                    <option value="artist">Artist Application</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="press">Press/Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Image Upload Section - Show for supported subjects */}
                {canUploadImages && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload {formData.subject === 'custom' ? 'Reference' : 
                               formData.subject === 'order' ? 'Order' :
                               formData.subject === 'return' ? 'Return/Exchange' :
                               formData.subject === 'artist' ? 'Portfolio' : ''} Images 
                        (Max {maxImages} image{maxImages > 1 ? 's' : ''}, 15MB each)
                      </label>
                      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-400 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="images"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                            >
                              <span>Upload images</span>
                              <input
                                id="images"
                                name="images"
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 15MB each</p>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              {image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    minLength={10}
                    maxLength={1000}
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                  {messageError && <p className="text-red-600 text-xs mt-1">{messageError}</p>}
                  <div className="text-sm text-gray-500 mt-1">{formData.message.length}/500 characters</div>
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 py-3 shadow-xl hover:shadow-2xl transition-all duration-300"
                  disabled={
                    isSubmitting ||
                    !isAuthenticated ||
                    !isFormValid
                  }
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Visit Our Gallery</h2>
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.674994343309!2d77.21802931508236!3d28.631006982421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0683329da9%3A0x1b2b1b1b1b1b1b1b!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location - Connaught Place, New Delhi"
              />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-xl border border-emerald-200">
                <h3 className="font-semibold text-gray-800 mb-3 font-serif">Gallery Hours</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  Tuesday - Saturday: 11 AM - 8 PM<br />
                  Sunday: 12 PM - 6 PM<br />
                  Monday: Closed
                </p>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3 font-serif">Parking</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  Paid parking available<br />
                  Metro parking nearby<br />
                  Auto/taxi stand at entrance
                </p>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-3 font-serif">Public Transit</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
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