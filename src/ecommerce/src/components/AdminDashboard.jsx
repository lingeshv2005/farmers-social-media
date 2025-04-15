import React from "react";
import AdminSellerApproval from "./AdminSellerApproval";
import AdminProductApproval from "./AdminProductApproval";

const AdminDashboard = () => {
  return (
    <div>
      <AdminSellerApproval />
      <AdminProductApproval />
    </div>
  );
};

export default AdminDashboard;
