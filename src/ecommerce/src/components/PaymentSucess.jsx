import React from 'react';
import '../styles/PaymentSuccess.css';
import { useLocation } from 'react-router-dom';

function PaymentSuccess() {
    const query=new URLSearchParams(useLocation().search);
    const reference=query.get("reference")
    return(
        <div className="payment-success-container">
            <div className="payment-success-card">
                <h2 className="payment-success-title">Payment Success!</h2>
                <p className="payment-success-message">
                    Thank you! Your Transacation was Successful!
                </p>
                {reference && (
                    <p className="payment-success-reference">
                        <strong>Reference Id:</strong>{reference}
                    </p>
                )}
            </div>
        </div>
    )
}

export default PaymentSuccess;