import React, { useState } from "react";
import axios from "axios";
import "../styles/CreatePostBox.css";

const NewPostModal = ({ userDetails, onClose }) => {
  const [tags, setTags] = useState([]);
  const [postType, setPostType] = useState("farmUpdate");
  const [content, setContent] = useState("");
  const [videos, setVideos] = useState([]);
  const [isShortFormVideo, setIsShortFormVideo] = useState(false);
  const [isRepostable, setIsRepostable] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleTagChange = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async () => {
    try {
      let uploadedImageUrls = [];
  
      if (selectedFile) {
        const formData = new FormData();
        formData.append("images", selectedFile);
  
        console.log("Uploading image:", selectedFile); // Debugging
  
        const imageResponse = await axios.post(
          "http://localhost:8000/api/v1/photos/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
  
        console.log("Image upload response:", imageResponse.data); // Debugging
  
        uploadedImageUrls = imageResponse.data.imageUrls;
      }
  
      const newPost = {
        userId: userDetails.userId,
        username: userDetails.username,
        tags,
        postType,
        content,
        images: uploadedImageUrls,
        videos,
        isShortFormVideo,
        isRepostable,
      };
  
      console.log("Submitting post:", newPost); // Debugging
  
      await axios.post("http://localhost:8000/api/v1/posts/createpost", newPost, {
        headers: { "Content-Type": "application/json" },
      });
  
      setUploadMessage("Post created successfully!");
      onClose();
    } catch (err) {
      console.error("Error in handlePostSubmit:", err);
      alert("Failed to create post!");
    }
  };
  
  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <h2>Create New Post</h2>

        <label>Tags (comma separated)</label>
        <input type="text" onChange={handleTagChange} />

        <label>Post Type</label>
        <select value={postType} onChange={(e) => setPostType(e.target.value)}>
          <option value="farmUpdate">Farm Update</option>
          <option value="diseaseQuestion">Disease Question</option>
        </select>

        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />

        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" width="100px" />}

        <label>Videos (comma separated URLs)</label>
        <input type="text" onChange={(e) => setVideos(e.target.value.split(","))} />

        <label>
          Short Form Video?
          <input
            type="checkbox"
            checked={isShortFormVideo}
            onChange={(e) => setIsShortFormVideo(e.target.checked)}
          />
        </label>

        <label>
          Is Repostable?
          <input
            type="checkbox"
            checked={isRepostable}
            onChange={(e) => setIsRepostable(e.target.checked)}
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="submit" onClick={handlePostSubmit}>Submit</button>
        </div>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
    </div>
  );
};

const CreatePostBox = ({ userDetails, onClose }) => {
  return <NewPostModal userDetails={userDetails} onClose={onClose} />;
};

export default CreatePostBox;
