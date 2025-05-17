import "./Notification.css";
import React, { useEffect } from 'react';

const Notification = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Optionally remove the class if you want the animation to replay if it scrolls out and back in
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 }); // Adjust threshold as needed

    const images = document.querySelectorAll('.notification-img img');
    images.forEach(img => observer.observe(img));

    return () => images.forEach(img => observer.unobserve(img));
  }, []);
  return (
    <div className="notification-ui">
      <div className="notification-text">
        <header className="header">
          <h1>Fast. Simple. Reliable.</h1>
          <p>Setting up notifications takes less than a minute</p>
        </header>

        <section className="steps-section">
          <ol className="steps-list">
            <li className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h3>Allow notifications</h3>
                <p>Enable browser notifications to receive alerts</p>
              </div>
            </li>
            <li className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h3>Connect your LMS</h3>
                <p>We'll securely link to your Bahria account</p>
              </div>
            </li>
            <li className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h3>Stay updated</h3>
                <p>Receive timely alerts for all assignments</p>
              </div>
            </li>
          </ol>
        </section>
      </div>

      <div className="notification-img">
        <img src="img/img-3.png" alt="Notification" className="animate-on-scroll" />
      </div>
    </div>
  );
};

export default Notification;
