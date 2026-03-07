import React from "react";
import "../styles/featureeventcard.css";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeaturedEventCard({
  category,
  title,
  description,
  date,
  location,
  users,
  image
}) {

  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate("/view-details");
  };

  return (
    <div className="featured-card">

      {/* LEFT IMAGE */}
      <div className="featured-image-wrapper">

        <img
          src={image}
          alt={title}
          className="featured-image"
        />

        <span className="featured-badge">Featured</span>

      </div>


      {/* RIGHT CONTENT */}

      <div className="featured-content">

        <span className="featured-category">
          {category}
        </span>

        <h2 className="featured-title">
          {title}
        </h2>

        <p className="featured-description">
          {description}
        </p>


        {/* DETAILS */}

        <div className="featured-details">

          <div className="detail-item">
            <Calendar size={18} className="meta-icon" />
            <span>{date}</span>
          </div>

          <div className="detail-item">
            <MapPin size={18} className="meta-icon" />
            <span>{location}</span>
          </div>

          <div className="detail-item">
            <Users size={18} className="meta-icon" />
            <span>{users}</span>
          </div>

        </div>


        <button
          className="featured-button"
          onClick={handleViewDetails}
        >
          View Details →
        </button>

      </div>

    </div>
  );
}

export default FeaturedEventCard;