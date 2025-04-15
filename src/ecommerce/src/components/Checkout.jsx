import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const [buyer, setBuyer] = useState(null); // Store buyer details
  const buyerId = localStorage.getItem("buyerId");

  // ✅ Fetch Buyer Details (Including Address)
  useEffect(() => {
    if (!buyerId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchBuyerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/buyers/buyer/${buyerId}`);
        setBuyer(response.data);
      } catch (err) {
        setError("Failed to load buyer details.");
      }
    };

    fetchBuyerDetails();
  }, [buyerId]);

  // ✅ Fetch Cart Items
  useEffect(() => {
    if (!buyerId) return;

    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/buyers/${buyerId}/cart`);
        const cartData = response.data.cart;

        // Fetch product details
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

  // ✅ Calculate Total Cost
  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.productDetails.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Cart is empty. Add items before placing an order.");
      return;
    }
  
    try {
      // Step 1: Get Razorpay key
      const { data: keyData } = await axios.get("http://localhost:5000/api/v1/getkey");
      const { key } = keyData;
  
      // Step 2: Create Razorpay order
      const { data: orderData } = await axios.post("http://localhost:5000/api/v1/payment/process", {
        amount: totalCost,
      });
      const { order } = orderData;
  
      // Step 3: Open Razorpay payment
      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'Farm Connect',
        description: 'Checkout Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 4: Verify payment (optional but recommended)
            const verifyResponse = await axios.post("http://localhost:5000/api/v1/paymentverification", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
          });
          
          console.log(`paymentsuccess?reference=${response.razorpay_payment_id}`);  
            // Step 5: Place Order after successful payment
            const orderResponse = await axios.post("http://localhost:5000/api/orders", {
              buyerId,
              products: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
              paymentMethod: verifyResponse.data.paymentMethod || "Online Payment",
            });
  
            if (orderResponse.status === 201) {
              await Promise.all(cartItems.map(async (item) => {
                await axios.delete(`http://localhost:5000/api/buyers/${buyerId}/cart/${item.productId}`);
              }));
              
              setOrderPlaced(true);
              setCartItems([]);
              setError("");
            } else {
              setError(orderResponse.data.message || "Order placement failed.");
            }

          if (verifyResponse.data.success) {
              navigate(`/paymentsuccess?reference=${response.razorpay_payment_id}`);
          } else {
              setError("Payment verification failed.");
          }
          } catch (err) {
            setError("Payment verification or order placement failed.");
          }
        },
        prefill: {
          name: buyer?.name || "Customer",
          email: buyer?.email || "",
          contact: buyer?.phone || ""
        },
        theme: {
          color: "#00a86b",
        },
      };
  
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      setError("Checkout failed. Please try again.");
    }
  };
  
  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {orderPlaced ? (
        <p className="success-message">✅ Order placed successfully!</p>
      ) : (
        <>
          <p>Review your cart and confirm your order.</p>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Loading cart...</p>
          ) : (
            <div className="checkout-summary">
              <h2>Order Summary</h2>
              {cartItems.length > 0 ? (
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.productId}>
                      {item.productDetails?.name} - {item.quantity} x ₹{item.productDetails?.price} = ₹
                      {item.quantity * item.productDetails?.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Your cart is empty.</p>
              )}

              {/* ✅ Show Address */}
              {buyer && (
                <div className="buyer-address">
                  <h3>Delivery Address</h3>
                  <p>
                    {buyer.address.street}, {buyer.address.city}, {buyer.address.state} - {buyer.address.zip},{" "}
                    {buyer.address.country}
                  </p>
                </div>
              )}

              {/* ✅ Total Cost */}
              <h2>Total Cost: ₹{totalCost}</h2>

              <button onClick={handleCheckout} disabled={cartItems.length === 0}>
                Place Order
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
