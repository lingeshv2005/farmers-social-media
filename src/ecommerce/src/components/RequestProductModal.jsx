import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../styles/RequestProductModal.css";

const categories = ["vegetables", "fruits", "dairy", "seeds", "tools", "others"];

const RequestProductModal = ({ isOpen, onClose, sellerId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
    document: null,
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setError("");

    if (name === "images") {
      const validImages = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (validImages.length > 5) {
        setError("You can only upload up to 5 images.");
        return;
      }

      setImagePreviews(validImages.map((file) => URL.createObjectURL(file)));
      setFormData({ ...formData, images: validImages });
    } else if (name === "document") {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        setError("Document size must be less than 2MB.");
        return;
      }
      setFormData({ ...formData, document: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
  
    const formDataToSend = new FormData();
    formDataToSend.append("sellerId", sellerId);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);
    formData.images.forEach((image, index) => formDataToSend.append(`images`, image));
    formDataToSend.append("document", formData.document);
  
    // Debugging: Log FormData
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      await axios.post("http://localhost:5000/api/products/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSuccess("Product request submitted successfully!");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onRequestClose={loading ? null : onClose} contentLabel="Request Product Approval" className="modal">
      <h2>Request Product Approval</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Product Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Stock:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />

        <label>Product Images (Max: 5):</label>
        <input type="file" name="images" multiple onChange={handleFileChange} accept="image/*" />
        <div className="preview-container">
          {imagePreviews.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} className="preview-image" />
          ))}
        </div>

        <label>Approval Document (Max: 2MB):</label>
        <input type="file" name="document" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" required />

        <div className="button-container">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          <button onClick={onClose} className="close-btn" disabled={loading}>Close</button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestProductModal;
