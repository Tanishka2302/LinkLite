import React, { useState } from 'react';
import { postService } from '../../../services/postService';

const PostCreate = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit post (text + optional media)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (media) formData.append('media', media);

      const response = await postService.createPost(formData);
      if (response?.post) {
        onPostCreated(response.post);
        setContent('');
        setMedia(null);
        setPreview(null);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Share your professional thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ✅ File input */}
        <div className="mt-3">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="text-sm text-gray-600"
          />
        </div>

        {/* ✅ Media Preview */}
        {preview && (
          <div className="mt-3">
            {media?.type.startsWith('video') ? (
              <video
                src={preview}
                controls
                className="w-full rounded-md"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-md"
              />
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">{content.length}/500</span>
          <button
            type="submit"
            disabled={loading || (!content.trim() && !media)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
