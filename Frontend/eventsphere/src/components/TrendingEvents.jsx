export default function TrendingEvents() {
  const events = [
    {
      title: "Code Clash 2026",
      date: "March 15, 2026",
      location: "MIT Auditorium",
      registered: "342 registered",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      title: "Cultural Nite",
      date: "April 2, 2026",
      location: "Central Arena",
      registered: "578 registered",
      image:
        "https://ln.run/nku0G",
    },
    {
      title: "AI Workshop",
      date: "April 18, 2026",
      location: "Tech Lab 3",
      registered: "215 registered",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    },
    {
      title: "Sports Fest",
      date: "May 5, 2026",
      location: "Main Stadium",
      registered: "890 registered",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },
  ];

  return (
    <section className="trending-section">
      <div className="trending-container">

        <h2 className="trending-title">
          Trending <span className="trending-gradient">Events</span>
        </h2>

        <p className="trending-subtitle">
          Don't miss out on the most popular events happening now
        </p>

        <div className="trending-grid">
          {events.map((event, index) => (
            <div key={index} className="trending-card">

              <div className="trending-image-wrapper">
                <img
                  src={event.image}
                  alt={event.title}
                  className="trending-image"
                />
              </div>

              <div className="trending-content">
                <h3>{event.title}</h3>

                <div className="trending-info">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>
                  <p>👥 {event.registered}</p>
                </div>

                <button className="trending-btn">
                  Register Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}