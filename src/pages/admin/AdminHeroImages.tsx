import React, { useEffect, useState } from 'react';
import { Image, Upload, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { adminAPI } from '../../lib/adminApi';

interface HeroImage {
  _id: string;
  title: string;
  subtitle?: string;
  category?: string;
  image: string;
  link?: string;
  order?: number;
}

const AdminHeroImages: React.FC = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('gallery');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getHeroImages();
      if (res.success) setImages(res.images);
      else setError(res.message || 'Failed to fetch images');
    } catch (e) {
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError('Image file required');
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
  formData.append('title', title);
  formData.append('subtitle', subtitle);
  formData.append('category', category);
  formData.append('link', link);
  formData.append('order', order.toString());
  formData.append('image', file);
      const res = await adminAPI.addHeroImage(formData);
      if (res.success) {
        setTitle(''); setSubtitle(''); setCategory('gallery'); setLink(''); setOrder(0); setFile(null);
        fetchImages();
      } else setError(res.message || 'Failed to add image');
    } catch (e) {
      setError('Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.deleteHeroImage(id);
      if (res.success) fetchImages();
      else setError(res.message || 'Failed to delete');
    } catch (e) {
      setError('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4 border border-white/30">
                  <Image className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-serif">Gallery Management</h1>
                <p className="text-white/90 font-light">Manage gallery and collection images</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                <Button
                  onClick={() => window.history.back()}
                  className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 transition-all duration-300 shadow-lg"
                >
                  ← Back
                </Button>
              </div>
              <div className="relative bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30 shadow-lg">
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
                <span className="relative text-white font-medium">
                  {images.length} total images
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add New Image Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-sm opacity-30"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-2 mr-3">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">Add New Image</h2>
          </div>
          
          <form onSubmit={handleAdd} className="bg-white/70 backdrop-blur-sm rounded-xl shadow p-4 flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              >
                <option value="gallery">Gallery</option>
                <option value="painting">Painting</option>
                <option value="apparel">Apparel</option>
                <option value="accessories">Accessories</option>
              </select>
              <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm" 
                required={category !== 'gallery'} 
                style={{ display: category === 'gallery' ? 'none' : 'block' }} 
              />
              <input 
                type="text" 
                placeholder="Subtitle/Description" 
                value={subtitle} 
                onChange={e => setSubtitle(e.target.value)} 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm" 
                style={{ display: category === 'gallery' ? 'none' : 'block' }} 
              />
              <input 
                type="text" 
                placeholder="Link (optional)" 
                value={link} 
                onChange={e => setLink(e.target.value)} 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm" 
                style={{ display: category === 'gallery' ? 'none' : 'block' }} 
              />
              <input 
                type="number" 
                placeholder="Order (optional)" 
                value={order} 
                onChange={e => setOrder(Number(e.target.value))} 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm" 
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setFile(e.target.files?.[0] || null)} 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm" 
                required 
              />
            </div>
            <div className="flex-shrink-0">
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
              >
                {loading ? 'Adding...' : 'Add Image'}
              </Button>
            </div>
          </form>
          {error && <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
        </div>
        
        {/* Gallery Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-sm opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2 mr-3">
                <Image className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-serif">Gallery Images</h3>
            <span className="ml-3 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">Auto-scrolling Banner</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.filter(img => img.category === 'gallery').map(img => (
              <div key={img._id} className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Gallery Banner</span>
                    <span className="text-xs text-gray-500">Order: {img.order}</span>
                  </div>
                  {img.title && <div className="font-semibold text-gray-900 truncate">{img.title}</div>}
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(img._id)} 
                    disabled={loading} 
                    className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {images.filter(img => img.category === 'gallery').length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="bg-blue-50 rounded-xl p-8">
                  <Image className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Gallery Images</h4>
                  <p className="text-gray-600">Add images to appear in the auto-scrolling banner</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collections Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-sm opacity-30"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-2 mr-3">
                <Image className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-serif">Collection Images</h3>
            <span className="ml-3 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm">Manual Scroll Gallery</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.filter(img => img.category !== 'gallery').map(img => (
              <div key={img._id} className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      img.category === 'painting' ? 'bg-rose-100 text-rose-600' :
                      img.category === 'apparel' ? 'bg-purple-100 text-purple-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {img.category ? img.category.charAt(0).toUpperCase() + img.category.slice(1) : 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-500">Order: {img.order}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900 truncate">{img.title}</div>
                    {img.subtitle && <div className="text-sm text-gray-600 line-clamp-2">{img.subtitle}</div>}
                    {img.link && (
                      <a 
                        href={img.link} 
                        className="text-sm text-blue-600 hover:text-blue-700 truncate block" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Link →
                      </a>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(img._id)} 
                    disabled={loading} 
                    className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {images.filter(img => img.category !== 'gallery').length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="bg-emerald-50 rounded-xl p-8">
                  <Image className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Collection Images</h4>
                  <p className="text-gray-600">Add images to appear in the collections gallery</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeroImages;
