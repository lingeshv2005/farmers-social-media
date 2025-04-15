import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ecom-home.css"; 

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/category?category=${category}`
        );
        setProducts(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Invalid category or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="ecom-container">
      <header className="hero-section">
        <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
        <p>Browse fresh and organic {category} directly from farmers!</p>
      </header>

      <section className="products-section">
        <h2>Available {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
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
              <p>No products available in this category.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryProducts;
