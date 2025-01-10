import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const removeFile = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch('http://localhost:8000/openart/api/announcements/create_announcement', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setFormData({ title: '', description: '', category: '' });
      setImage(null);
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <Card className="max-w-2xl mx-auto bg-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-purple-600 text-white border-none">
                <AlertDescription>Announcement created successfully!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 min-h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Music">Music</option>
                  <option value="Dance">Dance</option>
                  <option value="Photography">Photography</option>
                  <option value="Writing">Writing</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Image (Optional)</label>
                {!image ? (
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="announcement-image"
                      accept="image/*"
                    />
                    <label htmlFor="announcement-image" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-2">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAnnouncement;