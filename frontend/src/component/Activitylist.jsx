import React, { useState, useMemo, useEffect } from "react";
import { fetchActivityLog } from "../auth.js"; // import dari auth.js
import "./Activitylist.css";

function formatTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function Activitylist() {
  const [activities, setActivities] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchActivityLog(); // gunakan function dari auth.js
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities.filter((a) => {
      if (!q) return true;
      return (
        (a.username && a.username.toLowerCase().includes(q)) ||
        (a.activity && a.activity.toLowerCase().includes(q)) ||
        (a.nama && a.nama.toLowerCase().includes(q))
      );
    });
  }, [activities, query]);

  if (loading) return <div className="activity-log">Memuat aktivitas...</div>;
  if (error) return <div className="activity-log error">Error: {error}</div>;

  return (
    <div className="activity-log">
      <ul className="activity-list">
        {filtered.length === 0 && <li className="empty">Tidak ada aktivitas.</li>}

        {filtered.map((a) => (
          <li key={a.id} className="activity-item">
            <div className="left">
              <div className="avatar">
                {a.gambar ? (
                  <img
                    src={`${sessionStorage.getItem("host")}/storage/profile_picture/${a.gambar}`}
                    alt={a.nama || a.username}
                  />
                ) : (
                  (a.nama || a.username || "?").charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div className="body">
              <div className="meta">
                <strong className="user">{a.nama || a.username}</strong>
                <span className="action"> — {a.activity}</span>
                <span className="time">{formatTime(a.time)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
