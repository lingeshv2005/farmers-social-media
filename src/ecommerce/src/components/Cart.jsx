import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const buyerId = localStorage.getItem("buyerId");

  useEffect(() => {
    if (!buyerId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/buyers/${buyerId}/cart`);
        const cartData = response.data.cart;

        // Fetch product details for each cart item
        const productRequests = cartData.map((item) =>
          axios.get(`http://localhost:5000/api/products/${item.productId}`)
        );
        const productResponses = await Promise.all(productRequests);

        // Merge product details with cart items
        const updatedCart = cartData.map((item, index) => ({
          ...item,
          productDetails: productResponses[index].data,
        }));

        setCartItems(updatedCart);
      } catch (err) {
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [buyerId]);

  // Calculate Total Cost
  const totalCost = cartItems.reduce((acc, item) => acc + item.productDetails.price * item.quantity, 0);

  // Remove Item from Cart
  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/buyers/${buyerId}/cart/${productId}`);
      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Failed to remove item.");
    }
  };

  // Update Quantity
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/buyers/${buyerId}/cart/${productId}`,
        { quantity: newQuantity }
      );

      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity.");
      }
    } catch (error) {
      console.error("Failed to update quantity.", error.response?.data);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {loading ? (
        <p>Loading cart...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : cartItems.length > 0 ? (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.productId} className="cart-item">
                {/* Product Image */}
                {item.productDetails.images && item.productDetails.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${item.productDetails.images[0]}`}
                    alt={item.productDetails.name}
                    className="cart-product-image"
                  />
                ) : (
                  <p>No image available</p>
                )}

                <div className="cart-item-details">
                  {/* Product Name & Description */}
                  <h2>
                    <Link to={`/product/${item.productId}`}>{item.productDetails.name}</Link>
                  </h2>
                  <p>{item.productDetails.description}</p>
                  <h3>₹{item.productDetails.price}</h3>

                  {/* Quantity Controls */}
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                  </div>

                  {/* Total Price per Product */}
                  <p><strong>Subtotal:</strong> ₹{item.productDetails.price * item.quantity}</p>

                  {/* Remove Button */}
                  <button onClick={() => handleRemove(item.productId)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Total Cart Cost */}
          <div className="cart-summary">
            <h2>Total Cost: ₹{totalCost}</h2>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
