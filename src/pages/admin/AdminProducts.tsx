import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload, ToggleLeft, ToggleRight, Package } from 'lucide-react';
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
    discountPrice: '',
    category: 'painting',
    size: '',
    material: '',
    featured: false,
    inStock: true,
    images: [] as File[],
    video: null as File | null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      const response = await adminAPI.getProducts();
      
      if (response.success) {
        setProducts(response.data.products || []);
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

    // Frontend validation with character limits
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (formData.name.trim().length > 100) {
      toast.error('Product name must be less than 100 characters');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    if (formData.description.trim().length > 2000) {
      toast.error('Product description must be less than 2000 characters');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    
    // Validate discount price if provided
    if (formData.discountPrice && parseFloat(formData.discountPrice) <= 0) {
      toast.error('Valid discount price is required');
      return;
    }
    
    // Ensure discount price is less than original price
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      toast.error('Discount price must be less than original price');
      return;
    }
    
    if (formData.size.trim().length > 50) {
      toast.error('Size must be less than 50 characters');
      return;
    }
    
    if (formData.material.trim().length > 100) {
      toast.error('Material must be less than 100 characters');
      return;
    }
    

    
    if (!editingProduct && formData.images.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      if (formData.discountPrice) {
        formDataToSend.append('discountPrice', formData.discountPrice);
      }
      formDataToSend.append('category', formData.category);

      formDataToSend.append('size', formData.size.trim());
      formDataToSend.append('material', formData.material.trim());
      formDataToSend.append('featured', formData.featured.toString());
      formDataToSend.append('inStock', formData.inStock.toString());
      
      // Add images
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });
      
      // Add video if present
      if (formData.video) {
        formDataToSend.append('video', formData.video);
      }


      let response;
      if (editingProduct) {
        response = await adminAPI.updateProduct(editingProduct._id, formDataToSend);
      } else {
        response = await adminAPI.createProduct(formDataToSend);
      }


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
      discountPrice: '',
      category: 'painting',
      size: '',
      material: '',
      featured: false,
      inStock: true,
      images: [],
      video: null
    });
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      discountPrice: product.discountPrice?.toString() || '',
      category: product.category || 'painting',
      size: product.size || '',
      material: product.material || '',
      featured: product.featured || false,
      inStock: product.inStock !== false,
      images: [],
      video: null
    });
    setShowAddModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
                  <Plus className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-serif">Product Management</h1>
                <p className="text-white/90 font-light text-sm sm:text-base">Add, edit, or remove products</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                <Button
                  onClick={() => {
                    resetForm();
                    setEditingProduct(null);
                    setShowAddModal(true);
                  }}
                  className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 transition-all duration-300 shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              >
                <option value="">All Categories</option>
                <option value="painting">Paintings</option>
                <option value="apparel">Apparel</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-sm opacity-30"></div>
              <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            </div>
            <p className="mt-4 text-gray-700 font-serif">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-semibold bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/20">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Featured
                      </span>
                    </div>
                  )}
                  {product.discountPrice && product.discountPrice < product.price && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 font-serif">{product.name}</h3>
                  
                  {/* Price Display with Discount */}
                  <div className="mb-3">
                    {product.discountPrice && product.discountPrice < product.price ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          ₹{product.discountPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                      </div>
                    ) : (
                      <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">₹{product.price}</p>
                    )}
                  </div>
                  
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

                  <div className="flex gap-3">
                    <Button
                      onClick={() => openEditModal(product)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product._id)}
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
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
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-white/20">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600 mb-4 font-serif">No products found</div>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingProduct(null);
                  setShowAddModal(true);
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Product
              </Button>
            </div>
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
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-sm text-gray-500">({formData.description.length}/2000)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      minLength={10}
                      maxLength={2000}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Original Price (₹)"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value.replace(/\D/, '')})}
                      required
                    />

                    <Input
                      label="Discount Price (₹) - Optional"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({...formData, discountPrice: e.target.value.replace(/\D/, '')})}
                      placeholder="Leave empty for no discount"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
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
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>

                  {/* Display discount calculation */}
                  {formData.price && formData.discountPrice && parseFloat(formData.discountPrice) < parseFloat(formData.price) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm text-green-800">
                        <span className="font-semibold">Discount: </span>
                        {Math.round(((parseFloat(formData.price) - parseFloat(formData.discountPrice)) / parseFloat(formData.price)) * 100)}% off
                      </div>
                      <div className="text-sm text-green-600">
                        Customers save: ₹{parseFloat(formData.price) - parseFloat(formData.discountPrice)}
                      </div>
                    </div>
                  )}



                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Size (optional)"
                      maxLength={50}
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                    />

                    <Input
                      label="Material (optional)"
                      maxLength={100}
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

                  {/* Product Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images (up to 3) {editingProduct && '(leave empty to keep current images)'}
                    </label>
                    
                    {/* Image Previews */}
                    {formData.images.length > 0 && (
                      <div className="mb-4 grid grid-cols-3 gap-4">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = formData.images.filter((_, i) => i !== index);
                                setFormData({...formData, images: newImages});
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Image Button */}
                    {formData.images.length < 3 && (
                      <div className="mb-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const newFile = e.target.files?.[0];
                            if (newFile) {
                              setFormData({...formData, images: [...formData.images, newFile]});
                            }
                            // Reset the input
                            e.target.value = '';
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required={!editingProduct && formData.images.length === 0}
                        />
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.images.length === 0 ? 'Select images one by one' : 
                       formData.images.length === 3 ? 'Maximum 3 images selected' : 
                       `${formData.images.length}/3 images selected. First image will be the main product image`}
                    </p>
                  </div>

                  {/* Product Video */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Video (optional) {editingProduct && '(leave empty to keep current video)'}
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/mov,video/avi"
                      onChange={(e) => setFormData({...formData, video: e.target.files?.[0] || null})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supports MP4, MOV, AVI formats (max 50MB)</p>
                    {formData.video && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">Video selected: {formData.video.name}</p>
                      </div>
                    )}
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
                      className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
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
