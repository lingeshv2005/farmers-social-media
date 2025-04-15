// src/components/ProductBox.jsx
import React from "react";
import "../styles/ProductBox.css"; // Add styling for the product box

const ProductBox = ({ product }) => {
  return (
    <div className="product-box">
      {/* Display product images */}
      <div className="product-images">
        {product.images.length > 0 ? (
          <img
            src={`http://localhost:5000${product.images[0]}`} // Display only the first image
            alt={product.name}
            className="product-image"
          />
        ) : (
          <p>No Image Available</p>
        )}
      </div>

      {/* Product details */}
      <div className="product-info">
        <h3>{product.name}</h3>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p className={`status ${product.approvalStatus}`}><strong>Status:</strong> {product.approvalStatus}</p>
      </div>
    </div>
  );
};

export default ProductBox;
