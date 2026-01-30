import React from "react";
import { createPortal } from "react-dom";
import "./Loder.css";

export default function Loder({ duration = 1, color = "#f35525" }) {
  return createPortal(
    <div className="loder-overlay">
      <div className="loder">
        <div style={{ animationDuration: `${duration}s`, backgroundColor: color }}></div>
        <div style={{ animationDuration: `${duration}s`, animationDelay: `${duration * 0.15}s`, backgroundColor: color }}></div>
        <div style={{ animationDuration: `${duration}s`, animationDelay: `${duration * 0.3}s`, backgroundColor: color }}></div>
        <div style={{ animationDuration: `${duration}s`, animationDelay: `${duration * 0.45}s`, backgroundColor: color }}></div>
      </div>
    </div>,
    document.body
  );
}
