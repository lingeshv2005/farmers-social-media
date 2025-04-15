import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BuyerDashboard.css";

const BuyerDashboard = () => {
    const [buyer, setBuyer] = useState(null);
    const [orders, setOrders] = useState([]);
    const buyerId = localStorage.getItem("buyerId");

    useEffect(() => {
        const fetchBuyerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/buyers/buyer/${buyerId}`);
                const buyerData = response.data;
                setBuyer(buyerData);

                if (buyerData.orderHistory.length > 0) {
                    const orderPromises = buyerData.orderHistory.map(orderId =>
                        axios.get(`http://localhost:5000/api/orders/${orderId}`)
                    );
                    const orderResponses = await Promise.all(orderPromises);
                    const ordersWithProducts = await Promise.all(
                        orderResponses.map(async (orderRes) => {
                            const order = orderRes.data;
                            
                            // Fetch product details for each product in the order
                            const productPromises = order.products.map(product =>
                                axios.get(`http://localhost:5000/api/products/${product.productId}`)
                            );
                            const productResponses = await Promise.all(productPromises);

                            order.products = order.products.map((product, index) => ({
                                ...product,
                                details: productResponses[index].data
                            }));

                            return order;
                        })
                    );

                    setOrders(ordersWithProducts);
                }
            } catch (error) {
                console.error("Error fetching buyer details:", error);
            }
        };

        fetchBuyerDetails();
    }, [buyerId]);

    if (!buyer) return <p className="loading-text">Loading buyer details...</p>;

    return (
        <div className="dashboard">
            <h2 className="dashboard-title">Buyer Dashboard</h2>

            {/* Buyer Details */}
            <div className="buyer-info">
                <h3 className="buyer-info-title">Profile</h3>
                <p className="buyer-info-detail"><strong>Name:</strong> {buyer.name}</p>
                <p className="buyer-info-detail"><strong>Email:</strong> {buyer.email}</p>
                <p className="buyer-info-detail"><strong>Phone:</strong> {buyer.phone}</p>
                <p className="buyer-info-detail"><strong>Address:</strong> {buyer.address.street}, {buyer.address.city}, {buyer.address.state} - {buyer.address.zip}, {buyer.address.country}</p>
                <p className="buyer-info-detail"><strong>Total Spent:</strong> ₹{buyer.totalSpent}</p>
                <p className="buyer-info-detail"><strong>Loyalty Points:</strong> {buyer.loyaltyPoints}</p>
                <p className="buyer-info-detail"><strong>Preferred Payment:</strong> {buyer.preferredPaymentMethod}</p>
            </div>

            {/* Order History */}
            <div className="order-history">
                <h3 className="order-history-title">Order History</h3>
                {orders.length === 0 ? (
                    <p className="no-orders">No orders placed yet.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.orderId} className="order-card">
                            <h4 className="order-card-title">Order ID: {order.orderId}</h4>
                            <p className="order-card-detail"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="order-card-detail"><strong>Payment Status:</strong> {order.paymentStatus}</p>
                            <p className="order-card-detail"><strong>Order Status:</strong> {order.orderStatus}</p>
                            <p className="order-card-detail"><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
                            <p className="order-card-detail"><strong>Estimated Delivery:</strong> {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "Not available"}</p>

                            {/* Products in Order */}
                            <h5 className="order-section-title">Products</h5>
                            <ul className="order-list">
                                {order.products.map((product) => (
                                    <li key={product.productId} className="order-item">
                                        <p className="order-item-detail"><strong>Product Name:</strong> {product.details.name}</p>
                                        <p className="order-item-detail"><strong>Quantity:</strong> {product.quantity}</p>
                                        <p className="order-item-detail"><strong>Price:</strong> ₹{product.details.price}</p>
                                    </li>
                                ))}
                            </ul>

                            {/* Tracking Details */}
                            <h5 className="order-section-title">Tracking Details</h5>
                            {order.trackingDetails.length === 0 ? (
                                <p className="no-tracking">No tracking updates available.</p>
                            ) : (
                                <ul className="order-list">
                                    {order.trackingDetails.map((track, index) => (
                                        <li key={index} className="order-item">
                                            <p className="order-item-detail"><strong>Time:</strong> {new Date(track.timestamp).toLocaleString()}</p>
                                            <p className="order-item-detail"><strong>Location:</strong> {track.location}</p>
                                            <p className="order-item-detail"><strong>Status:</strong> {track.status}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;
