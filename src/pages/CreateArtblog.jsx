import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateArtblog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/openart/api/artblogs/create_artblog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setFormData({ title: '', content: '', category: '' });
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
          <CardTitle className="text-2xl font-bold">Create New Artblog</CardTitle>
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
                <AlertDescription>Artblog created successfully!</AlertDescription>
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
                <label className="block text-sm font-medium mb-2">Content*</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 min-h-64"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Artblog'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateArtblog;