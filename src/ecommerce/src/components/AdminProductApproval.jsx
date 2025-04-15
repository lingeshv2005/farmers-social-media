import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminProductApproval = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchProductRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/product-requests/unapproved");
  
        // Ensure response is always an array
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError("Failed to fetch product requests.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductRequests();
  }, []);
  
  const handleApproval = async (productId, status) => {
    try {
      const payload = {
        productId,
        status,
        adminId: "admin123", // Replace with actual admin ID
      };
      if (status === "rejected") {
        if (!rejectionReason) {
          alert("Please provide a reason for rejection.");
          return;
        }
        payload.rejectionReason = rejectionReason;
      }

      await axios.put("http://localhost:5000/api/product-requests/approve-or-reject", payload);

      setProducts(products.filter(product => product.productId !== productId));

      if (status === "rejected") {
        setSelectedProduct(null);
        setRejectionReason(""); // Reset rejection reason
      }
    } catch (err) {
      alert(`${status === "approved" ? "Approval" : "Rejection"} failed!`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - Product Approvals</h2>

      {products.length === 0 ? (
        <p className="no-products">No products to approve.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.productId}>
                <td>{product.name}</td>
                <td>{product.sellerId}</td>
                <td className={`status ${product.approvalStatus}`}>{product.approvalStatus}</td>
                <td>
                  {product.approvalStatus === "pending" ? (
                    <>
                      <button onClick={() => handleApproval(product.productId, "approved")} className="approve-btn">Approve</button>
                      <button onClick={() => setSelectedProduct(product)} className="reject-btn">Reject</button>
                    </>
                  ) : (
                    <span>
                      {product.approvalStatus === "approved"
                        ? "✅ Approved"
                        : `❌ Rejected (${product.rejectionReason})`}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedProduct && (
        <div className="modal">
          <h3>Reject Product - {selectedProduct.name}</h3>
          <textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <div className="modal-actions">
            <button onClick={() => handleApproval(selectedProduct.productId, "rejected")} className="reject-btn">
              Confirm Reject
            </button>
            <button onClick={() => setSelectedProduct(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductApproval;
