import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { adminAPI } from '../../lib/adminApi';
import toast from 'react-hot-toast';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'painting',
    artist: '',
    size: '',
    material: '',
    featured: false,
    inStock: true,
    image: null as File | null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching products...');
      
      const response = await adminAPI.getProducts();
      console.log('Products response:', response);
      
      if (response.success) {
        setProducts(response.data.products || []);
        console.log('Products loaded:', response.data.products?.length || 0);
      } else {
        console.error('Failed to fetch products:', response.message);
        toast.error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log('Submitting form...', formData);
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    
    if (!formData.artist.trim()) {
      toast.error('Artist name is required');
      return;
    }
    
    if (!editingProduct && !formData.image) {
      toast.error('Product image is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('artist', formData.artist.trim());
      formDataToSend.append('size', formData.size.trim());
      formDataToSend.append('material', formData.material.trim());
      formDataToSend.append('featured', formData.featured.toString());
      formDataToSend.append('inStock', formData.inStock.toString());
      
      // Add image if present
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Sending FormData...');

      let response;
      if (editingProduct) {
        response = await adminAPI.updateProduct(editingProduct._id, formDataToSend);
      } else {
        response = await adminAPI.createProduct(formDataToSend);
      }

      console.log('Submit response:', response);

      if (response.success) {
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setShowAddModal(false);
        setEditingProduct(null);
        resetForm();
        await fetchProducts(); // Refresh the products list
      } else {
        toast.error(response.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await adminAPI.deleteProduct(id);
      if (response.success) {
        toast.success('Product deleted successfully!');
        await fetchProducts();
      } else {
        toast.error(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleStock = async (product: any) => {
    try {
      const formData = new FormData();
      formData.append('inStock', (!product.inStock).toString());
      
      const response = await adminAPI.updateProduct(product._id, formData);
      if (response.success) {
        toast.success(`Product ${!product.inStock ? 'marked as in stock' : 'marked as out of stock'}`);
        await fetchProducts();
      } else {
        toast.error(response.message || 'Failed to update stock status');
      }
    } catch (error) {
      console.error('Toggle stock error:', error);
      toast.error('Failed to update stock status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'painting',
      artist: '',
      size: '',
      material: '',
      featured: false,
      inStock: true,
      image: null
    });
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || 'painting',
      artist: product.artist || '',
      size: product.size || '',
      material: product.material || '',
      featured: product.featured || false,
      inStock: product.inStock !== false,
      image: null
    });
    setShowAddModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artist?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 font-serif">Product Management</h1>
            <Button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-orange-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="painting">Paintings</option>
                <option value="apparel">Apparel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full text-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {product.artist}</p>
                  <p className="text-lg font-bold text-purple-600 mb-3">₹{product.price}</p>
                  
                  {/* Stock Toggle */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">In Stock:</span>
                    <button
                      onClick={() => toggleStock(product)}
                      className={`p-1 rounded-full transition-colors ${
                        product.inStock ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {product.inStock ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditModal(product)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No products found</div>
            <Button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-orange-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Product Name"
                    minLength={2}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      minLength={10}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Price (₹)"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value.replace(/\D/, '')})}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="painting">Painting</option>
                        <option value="apparel">Apparel</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Artist Name"
                    minLength={2}
                    value={formData.artist}
                    onChange={(e) => setFormData({...formData, artist: e.target.value})}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Size (optional)"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                    />

                    <Input
                      label="Material (optional)"
                      value={formData.material}
                      onChange={(e) => setFormData({...formData, material: e.target.value})}
                    />
                  </div>

                  {/* Featured and Stock toggles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                        Featured Product
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                        In Stock
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image {editingProduct && '(leave empty to keep current image)'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required={!editingProduct}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500"
                      disabled={isSubmitting}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Saving...' : (editingProduct ? 'Update' : 'Create')} Product
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
