import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminSellerApproval = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchSellerRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/admin/sellers");
        setSellers(response.data);
      } catch (error) {
        setError("Failed to fetch seller requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerRequests();
  }, []);

  const handleApprove = async (sellerId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/seller/${sellerId}`, {
        approvalStatus: "approved",
        adminId: "admin123", // Replace with actual admin ID
      });
      setSellers(sellers.map(seller => 
        seller.sellerId === sellerId ? { ...seller, approvalStatus: "approved" } : seller
      ));
    } catch (err) {
      alert("Approval failed!");
    }
  };

  const handleReject = async (sellerId) => {
    if (!rejectionReason) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/admin/seller/${sellerId}`, {
        approvalStatus: "rejected",
        adminId: "admin123",
        rejectionReason,
      });
      setSellers(sellers.map(seller => 
        seller.sellerId === sellerId ? { ...seller, approvalStatus: "rejected", rejectionReason } : seller
      ));
    } catch (err) {
      alert("Rejection failed!");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - Seller Approvals</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller.sellerId}>
              <td>{seller.shopName}</td>
              <td>{seller.shopLocation}</td>
              <td className={`status ${seller.approvalStatus}`}>{seller.approvalStatus}</td>
              <td>
                {seller.approvalStatus === "pending" ? (
                  <>
                    <button onClick={() => handleApprove(seller.sellerId)} className="approve-btn">Approve</button>
                    <button onClick={() => setSelectedSeller(seller)} className="reject-btn">Reject</button>
                  </>
                ) : (
                  <span>{seller.approvalStatus === "approved" ? "✅ Approved" : `❌ Rejected (${seller.rejectionReason})`}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSeller && (
        <div className="modal">
          <h3>Reject Seller - {selectedSeller.shopName}</h3>
          <textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <button onClick={() => handleReject(selectedSeller.sellerId)}>Confirm Reject</button>
          <button onClick={() => setSelectedSeller(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminSellerApproval;
