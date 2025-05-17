import "./About.css";
import React, { useEffect } from 'react';

function About() {
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

    const images = document.querySelectorAll('.about-section img');
    images.forEach(img => observer.observe(img));

    return () => images.forEach(img => observer.unobserve(img));
  }, []);
  return (
    <>
      <section className="about-section">
        <div className="features-image">
          <img src="img/img-2.jpg" alt="Missed assignment illustration" className="animate-on-scroll" />
        </div>
        <div className="features-text">
          <h2>Real-time notifications</h2>
          <p>
            Bahria students often miss important assignments because they don't
            check the LMS regularly. Notify Bahria monitors your LMS portal and
            sends you instant alerts.
          </p>
          <ul>
            <li>
              <span className="dot">•</span>
              <span>Get alerts as soon as assignments are posted</span>
            </li>
            <li>
              <span className="dot">•</span>
              <span>Receive reminders before deadlines</span>
            </li>
            <li>
              <span className="dot">•</span>
              <span>Stay updated with real-time notifications</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default About;
