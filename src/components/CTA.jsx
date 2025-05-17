import React, { useState } from "react";
import "./CTA.css";

const CTA = ({ onNotifyClick }) => {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleClick = async () => {
    if (onNotifyClick) {
      await onNotifyClick(setLoading, setRegistered);
    }
  };

  return (
    <div className="cta-container">
      <div className="cta-content">
        <h2 className="cta-title">Ready to stay on top of assignments?</h2>
        <p className="cta-subtitle">
          Join students across Bahria University who never miss an assignment
        </p>
        <h3 className="cta-heading">Get started now</h3>

        {loading ? (
          <div className="spinner"></div>
        ) : registered ? (
          <p className="text-green-400 font-semibold">
            Registered for notifications!
          </p>
        ) : (
          <button
            className="cta-button"
            onClick={handleClick}
            disabled={loading}
          >
            Notify Me
          </button>
        )}
      </div>
    </div>
  );
};

export default CTA;
