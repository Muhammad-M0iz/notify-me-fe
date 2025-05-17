import { useEffect } from "react";
import "./Gradient.css";
const Gradient = ({ children, position = "left" }) => {
  useEffect(() => {
    const colorCircles = document.querySelectorAll(".color-circle");
    colorCircles.forEach((circle) => {
      circle.classList.add("animate");
    });
  }, []);

  const positionClass =
    position === "right" ? "right-position" : "left-position";

  return (
    <div className="gradient-wrapper">
      {/* Background circles */}
      <div className={`color-circle circle-yellow ${positionClass}`}></div>
      <div className={`color-circle circle-red ${positionClass}`}></div>
      <div className={`color-circle circle-orange ${positionClass}`}></div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Gradient;
