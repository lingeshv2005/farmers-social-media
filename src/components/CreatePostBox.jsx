import React, { useState } from "react";
import axios from "axios";
import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, ENDPOINTS } from '../config/api';
import "../styles/CreatePostBox.css";

const NewPostModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadMessage("Please select an image file");
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadMessage("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    // Reset all form fields
    setTitle("");
    setContent("");
    setSelectedFile(null);
    setImagePreview(null);
    setUploadMessage("");
    setIsUploading(false);
    // Navigate back to posts page
    navigate('/posts');
  };

  const handlePostSubmit = async () => {
    try {
      if (!token || !userId || !username) {
        setUploadMessage("Please log in to create a post.");
        navigate('/login');
        return;
      }

      if (!selectedFile) {
        setUploadMessage("Please select an image first.");
        return;
      }

      setIsUploading(true);
      setUploadMessage("Uploading image...");

      const formData = new FormData();
      formData.append("image", selectedFile);

      // Upload image to Cloudinary through our backend
      console.log('Uploading image to:', `${API_BASE_URL}${ENDPOINTS.UPLOAD_PHOTO}`);
      const imageResponse = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.UPLOAD_PHOTO}`,
        formData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log('Image upload response:', imageResponse.data);

      if (!imageResponse.data || !imageResponse.data.imageUrl) {
        throw new Error("Failed to get image URL from response");
      }

      const uploadedImageUrl = imageResponse.data.imageUrl;
      console.log('Cloudinary image URL:', uploadedImageUrl);

      // Create the post with the Cloudinary image URL
      const newPost = {
        userId: userId,
        authorName: username,
        title: title.trim(),
        content: content.trim(),
        images: [uploadedImageUrl],
        postType: 'farmUpdate',
        likeUsers: [],
        likeCount: 0,
        commentCount: 0
      };

      console.log('Creating post with data:', newPost);

      const postResponse = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.CREATE_POST}`,
        newPost,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log('Post creation response:', postResponse.data);

      if (postResponse.data.success) {
        setUploadMessage("Post created successfully");
        handleCancel();
      } else {
        throw new Error(postResponse.data.message || "Failed to create post");
      }

    } catch (err) {
      console.error("Error:", err);
      if (err.response?.status === 503) {
        setUploadMessage("Server is temporarily unavailable. Please try again in a few minutes.");
      } else if (err.response?.status === 401) {
        setUploadMessage("Please log in again to create a post.");
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('isAuth');
        navigate('/login');
      } else if (err.response?.status === 400) {
        console.error("Server response:", err.response.data);
        setUploadMessage(err.response.data.message || "Invalid post data. Please check your input.");
      } else {
        setUploadMessage(err.response?.data?.message || "Failed to create post. Please try again.");
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <div className="modal-header">
          <IconButton 
            onClick={handleCancel}
            sx={{ 
              position: 'absolute',
              left: 10,
              top: 10,
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <h2>Create New Post</h2>
        </div>

        <label>Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />

        <label>Content</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
        />

        <label>Upload Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Preview" 
            style={{ maxWidth: '100%', marginTop: '10px' }}
          />
        )}

        <div className="modal-actions">
          <button onClick={handleCancel} disabled={isUploading}>Cancel</button>
          <button 
            className="submit" 
            onClick={handlePostSubmit}
            disabled={!title.trim() || !content.trim() || !selectedFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
        {uploadMessage && <p className={uploadMessage.includes('successfully') ? 'success' : 'error'}>{uploadMessage}</p>}
      </div>
    </div>
  );
};

const CreatePostBox = ({ onClose }) => {
  return (
    <div>
      <NewPostModal onClose={onClose} />
    </div>
  );
};

export default CreatePostBox;
