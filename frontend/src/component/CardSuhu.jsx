import React from "react";
import "./CardSuhu.css";
export default function CardSuhu({ rooms, temps, humidities }) {
  const count = Math.min(rooms.length, temps.length, humidities.length);

  return (
    <div className="card-container card">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} id="card">
          <p className="room">{rooms[i]}</p>
          <p className="value"><strong>{temps[i]}°C🌡️</strong></p>
          <p className="value">H : {humidities[i]}%</p>
        </div>
      ))}
    </div>
  );
}
