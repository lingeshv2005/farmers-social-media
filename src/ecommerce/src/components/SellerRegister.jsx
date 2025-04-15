import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SellerRegister.css";

const SellerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopLocation: "",
    shopImages: [],
    documents: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "shopImages") {
      const imageURLs = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(imageURLs);
    } else if (name === "documents") {
      const docURLs = Array.from(files).map((file) => URL.createObjectURL(file));
      setDocumentPreviews(docURLs);
    }

    setFormData({ ...formData, [name]: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userId", userId);
    formDataToSend.append("shopName", formData.shopName);
    formDataToSend.append("shopDescription", formData.shopDescription);
    formDataToSend.append("shopLocation", formData.shopLocation);

    for (let i = 0; i < formData.shopImages.length; i++) {
      formDataToSend.append("shopImages", formData.shopImages[i]);
    }

    for (let i = 0; i < formData.documents.length; i++) {
      formDataToSend.append("documents", formData.documents[i]);
    }

    try {
      await axios.post("http://localhost:5000/api/seller/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/seller-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-register">
      <h2>Register as a Seller</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Shop Name:</label>
        <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required />

        <label>Shop Description:</label>
        <textarea name="shopDescription" value={formData.shopDescription} onChange={handleChange} required />

        <label>Shop Location:</label>
        <input type="text" name="shopLocation" value={formData.shopLocation} onChange={handleChange} required />

        <label>Shop Images:</label>
        <input type="file" name="shopImages" multiple onChange={handleFileChange} accept="image/*" />
        <div className="preview-container">
          {imagePreviews.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} className="preview-image" />
          ))}
        </div>

        <label>Documents:</label>
        <input type="file" name="documents" multiple onChange={handleFileChange} />
        <div className="preview-container">
          {documentPreviews.map((src, index) => (
            <a key={index} href={src} target="_blank" rel="noopener noreferrer" className="preview-doc">
              View Document {index + 1}
            </a>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default SellerRegister;
