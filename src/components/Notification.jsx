import "./Notification.css";
import React, { useEffect } from 'react';

const Notification = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 });

    // Updated selector to target the device containers for animation
    const animatedElements = document.querySelectorAll('.notification-img .animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => animatedElements.forEach(el => observer.unobserve(el));
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
        {/* New structure for iPhone and Monitor */}
        <div className="device-pair">
          <div className="iphone-device animate-on-scroll">
            <div className="iphone-notch"></div>
            <img src="img/img-3.png" alt="App preview on iPhone" />
          </div>
          <div className="monitor-device animate-on-scroll">
            <div className="monitor-stand-top"></div>
            <div className="monitor-screen">
              <img src="img/img-3.png" alt="App preview on Monitor" />
            </div>
            <div className="monitor-stand-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
