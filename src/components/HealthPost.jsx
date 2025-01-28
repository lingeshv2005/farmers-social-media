import React, { useState } from 'react';
import '../styles/HealthPost.css';

const NewPostModal = ({ onClose }) => {
  const [tags, setTags] = useState([]);
  const [postType, setPostType] = useState("farmUpdate");
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isShortFormVideo, setIsShortFormVideo] = useState(false);
  const [isRepostable, setIsRepostable] = useState(true);

  const handleTagChange = (e) => {
    const tag = e.target.value;
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handlePostSubmit = () => {
    const newPost = {
      tags,
      postType,
      content,
      images,
      videos,
      isShortFormVideo,
      isRepostable
    };
    console.log('New Post:', newPost);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <h2>Create New Post</h2>

        {/* Tags input */}
        <label>Tags (comma separated)</label>
        <input type="text" onChange={handleTagChange} />

        {/* Post Type */}
        <label>Post Type</label>
        <select value={postType} onChange={(e) => setPostType(e.target.value)}>
          <option value="farmUpdate">Farm Update</option>
          <option value="diseaseQuestion">Disease Question</option>
        </select>

        {/* Content Textarea */}
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />

        {/* Images input */}
        <label>Images (comma separated URLs)</label>
        <input type="text" onChange={(e) => setImages(e.target.value.split(','))} />

        {/* Videos input */}
        <label>Videos (comma separated URLs)</label>
        <input type="text" onChange={(e) => setVideos(e.target.value.split(','))} />

        {/* Short Form Video Checkbox */}
        <label>
          Short Form Video?
          <input
            type="checkbox"
            checked={isShortFormVideo}
            onChange={(e) => setIsShortFormVideo(e.target.checked)}
          />
        </label>

        {/* Repostable Checkbox */}
        <label>
          Repostable?
          <input
            type="checkbox"
            checked={isRepostable}
            onChange={(e) => setIsRepostable(e.target.checked)}
          />
        </label>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="submit" onClick={handlePostSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

const HealthPost = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      {/* New Post Button */}
      <button onClick={toggleModal}>New Post</button>

      {/* Modal display condition */}
      {showModal && <NewPostModal onClose={toggleModal} />}
    </div>
  );
};

export default HealthPost;
