import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, ArrowRight, Home, Loader } from 'lucide-react';
import axios from 'axios';
import { Backendurl } from '../App';
import { toast } from 'react-toastify';

const ListProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    description: '',
    amenities: '',
    contact_phone: '',
    contact_email: ''
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadImageToImageKit = async (file) => {
    try {
      // Get auth token from backend
      const authResponse = await axios.get(`${Backendurl}/api/imagekit-auth`);
      const { token, expire, signature } = authResponse.data;

      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);
      formDataForUpload.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      formDataForUpload.append('signature', signature);
      formDataForUpload.append('expire', expire);
      formDataForUpload.append('token', token);

      const response = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formDataForUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Thumbnail image must be less than 10MB');
        return;
      }
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + galleryImages.length > 10) {
      toast.error('Maximum 10 gallery images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Each image must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryImages(prev => [...prev, file]);
        setGalleryPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const required = ['title', 'address', 'city', 'state', 'zip', 'price', 'beds', 'baths', 'sqft', 'contact_phone', 'contact_email'];
    for (let field of required) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace('contact_', '')}`);
        return false;
      }
    }
    if (!thumbnail) {
      toast.error('Please upload a thumbnail image');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  const uploadAllImages = async () => {
    try {
      setUploading(true);

      // Upload thumbnail
      if (thumbnail && !thumbnailUrl) {
        const url = await uploadImageToImageKit(thumbnail);
        setThumbnailUrl(url);
      }

      // Upload gallery images
      const newGalleryUrls = [...galleryUrls];
      for (let i = 0; i < galleryImages.length; i++) {
        if (!newGalleryUrls[i]) {
          const url = await uploadImageToImageKit(galleryImages[i]);
          newGalleryUrls[i] = url;
        }
      }
      setGalleryUrls(newGalleryUrls);

      return { thumbnailUrl, galleryUrls: newGalleryUrls };
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images. Please try again.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload images to ImageKit
      toast.info('Uploading images...');
      const { thumbnailUrl: finalThumbUrl, galleryUrls: finalGalleryUrls } = await uploadAllImages();

      // Create property with image URLs
      const propertyData = {
        ...formData,
        price: parseInt(formData.price),
        beds: parseInt(formData.beds),
        baths: parseFloat(formData.baths),
        sqft: parseInt(formData.sqft),
        images: [finalThumbUrl, ...finalGalleryUrls].filter(Boolean)
      };

      const response = await axios.post(`${Backendurl}/api/properties`, propertyData);

      if (response.data.success) {
        setSubmitted(true);
        toast.success('Property listed successfully!');

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            title: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            price: '',
            beds: '',
            baths: '',
            sqft: '',
            description: '',
            amenities: '',
            contact_phone: '',
            contact_email: ''
          });
          setThumbnail(null);
          setThumbnailPreview(null);
          setThumbnailUrl(null);
          setGalleryImages([]);
          setGalleryPreviews([]);
          setGalleryUrls([]);
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error listing property:', error);
      toast.error(error.response?.data?.message || 'Failed to list property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Property Listed!</h2>
          <p className="text-gray-600 mb-6">
            Your property has been successfully listed. Our team will review it shortly and you'll receive a confirmation email.
          </p>
          <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              List Your Property
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Fill out the form below to list your property on Choice Properties
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 md:p-12"
        >
          {/* Basic Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Property Details</h3>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Beautiful 3BR House in Downtown"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Price & Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="500000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Beds *</label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    placeholder="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Baths *</label>
                  <input
                    type="number"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    placeholder="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sqft *</label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    placeholder="2000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Describe your property, its features, and why someone should buy it..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="e.g., Pool, Gym, Parking, Garden"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8 border-t pt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8 border-t pt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Property Images</h3>

            {/* Thumbnail */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Thumbnail Image * {uploading && thumbnailUrl === null && <Loader className="inline w-4 h-4 animate-spin ml-2" />}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                  disabled={uploading}
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
              {thumbnailPreview && (
                <div className="mt-4 relative w-32 h-32">
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                  {thumbnailUrl && <div className="absolute top-1 right-1 bg-green-600 text-white p-1 rounded-full"><CheckCircle className="w-4 h-4" /></div>}
                  {!thumbnailUrl && (
                    <button
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview(null);
                      }}
                      type="button"
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Gallery Images {uploading && galleryUrls.length < galleryImages.length && <Loader className="inline w-4 h-4 animate-spin ml-2" />}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer mb-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="hidden"
                  id="gallery-upload"
                  disabled={uploading}
                />
                <label htmlFor="gallery-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold mb-2">Upload multiple images</p>
                  <p className="text-sm text-gray-500">Add up to 10 images (currently: {galleryImages.length})</p>
                </label>
              </div>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Gallery ${index}`} className="w-full h-32 object-cover rounded-lg" />
                      {galleryUrls[index] && <div className="absolute top-1 right-1 bg-green-600 text-white p-1 rounded-full"><CheckCircle className="w-3 h-3" /></div>}
                      {!galleryUrls[index] && (
                        <button
                          onClick={() => removeGalleryImage(index)}
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 border-t pt-8 mt-8"
          >
            {loading || uploading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {uploading ? 'Uploading Images...' : 'Listing Property...'}
              </>
            ) : (
              <>
                List Property
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default ListProperty;
