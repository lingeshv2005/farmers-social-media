import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/buyer-register.css";

const RegisterBuyer = () => {
  const [buyer, setBuyer] = useState({
    userId: localStorage.getItem("userId") || "", // Get userId if available
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setBuyer((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setBuyer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/buyers/register", buyer);
      localStorage.setItem("buyerId", response.data.buyer.buyerId); // Save userId in storage
      alert(response.data.message);
      navigate("/"); // Redirect to home page
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register as a Buyer</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={buyer.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={buyer.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={buyer.phone} onChange={handleChange} required />

        <input type="text" name="address.street" placeholder="Street" value={buyer.address.street} onChange={handleChange} required />
        <input type="text" name="address.city" placeholder="City" value={buyer.address.city} onChange={handleChange} required />
        <input type="text" name="address.state" placeholder="State" value={buyer.address.state} onChange={handleChange} required />
        <input type="text" name="address.zip" placeholder="ZIP Code" value={buyer.address.zip} onChange={handleChange} required />
        <input type="text" name="address.country" placeholder="Country" value={buyer.address.country} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterBuyer;
