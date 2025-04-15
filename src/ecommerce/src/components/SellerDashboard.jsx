import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import RequestProductModal from "./RequestProductModal";
import ProductBox from "./ProductBox"; // Import ProductBox
import "../styles/SellerDashboard.css";

Modal.setAppElement("#root");

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/seller/register");
        return;
      }

      try {
        const sellerResponse = await axios.get(`http://localhost:5000/api/seller/user/${userId}`);
        setSeller(sellerResponse.data);

        const sellerId = sellerResponse.data.sellerId;
        if (sellerId) {
          const productsResponse = await axios.get(`http://localhost:5000/api/products/getallproducts/${sellerId}`);
          setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Seller not found. Redirecting to registration...");
          setTimeout(() => navigate("/seller/register"), 2000);
        } else {
          setError("Failed to fetch seller details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="seller-dashboard">
      <h2>Seller Dashboard</h2>
      <div className="seller-info">
        <p><strong>Shop Name:</strong> {seller.shopName}</p>
        <p><strong>Description:</strong> {seller.shopDescription}</p>
        <p><strong>Location:</strong> {seller.shopLocation}</p>
        <p className={`status ${seller.approvalStatus}`}><strong>Status:</strong> {seller.approvalStatus}</p>
      </div>

      <h4>Shop Images:</h4>
      <div className="shop-images">
        {seller.shopImages.map((img, index) => (
          <img key={index} src={`http://localhost:5000${img}`} alt="Shop" width="100" />
        ))}
      </div>

      <h3>Your Products</h3>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductBox key={product.productId} product={product} />
          ))}
        </div>
      )}

      <button onClick={() => setModalOpen(true)} className="request-approval-btn">
        Request Product Approval
      </button>

      <RequestProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} sellerId={seller?.sellerId} />
    </div>
  );
};

export default SellerDashboard;
