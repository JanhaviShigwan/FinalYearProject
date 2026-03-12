import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/api/announcements`);
      setAnnouncements(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "15px",
        height: "100%",
        overflowY: "auto",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#3F3D56",
          marginBottom: "10px",
        }}
      >
        Announcements
      </h2>

      {announcements.length === 0 ? (
        <p
          style={{
            color: "gray",
            fontSize: "14px",
          }}
        >
          No announcements
        </p>
      ) : (
        announcements.map((a) => (
          <div
            key={a._id}
            style={{
              background: "#F6F1EB",
              borderLeft: "5px solid #9B96E5",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                color: "#3F3D56",
              }}
            >
              {a.title}
            </h3>

            <p
              style={{
                fontSize: "14px",
                margin: "5px 0",
              }}
            >
              {a.message}
            </p>

            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}
            >
              {new Date(a.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}