import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ecom-home.css";

const EcomHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkBuyerRegistration = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        navigate("/buyer/register"); // Redirect if no userId in storage
        return;
      }

      try {
        // Check if buyer exists
        await axios.get(`http://localhost:5000/api/buyers/${userId}`);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate("/buyer/register"); // Redirect to registration if buyer not found
        }
      }
    };

    const fetchApprovedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/approved");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    checkBuyerRegistration().then(fetchApprovedProducts);
  }, [navigate]);

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="ecom-container">
      <header className="hero-section">
        <h1>Farmers E-Commerce</h1>
        <p>Buy fresh farm products directly from farmers!</p>
      </header>

      <section className="products-section">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product._id}>
                  <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                  <button onClick={() => handleViewDetails(product.productId)}>View Details</button>
                </div>
              ))
            ) : (
              <p>No approved products available.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default EcomHome;
