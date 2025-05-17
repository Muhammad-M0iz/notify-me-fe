import React, { useEffect } from "react";
import AnimatedLogo from "./AnimatedLogo.jsx";
import "./Hero.css";
function Hero() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            // Optionally remove the class if you want the animation to replay if it scrolls out and back in
             entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    const images = document.querySelectorAll(".hero-section .hero-image");
    images.forEach((img) => observer.observe(img));

    return () => images.forEach((img) => observer.unobserve(img));
  }, []);
  return (
    <>
      <AnimatedLogo />

      <section className="hero-section">
        <div className="text-box">
          <p className="text">
            Never Miss a Due Date
            <br /> Again!
          </p>
          <p className="sub-text">
            Our app sends you friendly reminders so you stay ahead—no more
            last-minute panic.
          </p>
        </div>

        <div className="img-box">
          <img
            src="img/img-1.jpg"
            alt="Hero illustration"
            className="hero-image animate-on-scroll"
          />
        </div>
      </section>
    </>
  );
}

export default Hero;
