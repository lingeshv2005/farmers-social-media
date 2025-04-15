import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/product-details.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const buyerId = localStorage.getItem("buyerId"); // Ensure buyerId is stored after login

    if (!buyerId) {
        alert("Please register or log in before adding to cart.");
        navigate("/buyer/register"); // Redirect to registration page if not registered
        return;
    }

    if (!product) return;

    try {
        await axios.post(`http://localhost:5000/api/buyers/${buyerId}/cart`, {
            productId: product.productId,
            quantity,
        });
        alert("Product added to cart!");
    } catch (error) {
        alert("Failed to add product to cart.");
    }
};

  return (
    <div className="product-details-container">
      {loading ? (
        <p>Loading product details...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : product ? (
        <div className="product-details">
          {/* Ensure product has images before accessing */}
          {product.images && product.images.length > 0 ? (
            <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} />
          ) : (
            <p>No image available</p>
          )}

          <div className="details">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h2>₹{product.price}</h2>
            <p>Only {product.stock} Products Available</p>
            <p>{product.orderType?product.orderType:"Cash On Delivery"} Payment Available</p>
            <p>{product.totalSales} Products Sold</p>

            {/* Quantity Selector */}
            <div className="quantity-control">
              <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>

            <button onClick={handleAddToCart}>Add to Cart</button>
            <button className="back-button" onClick={() => navigate("/")}>Back to Home</button>
          </div>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductDetails;
