export default function EventPreview() {
  const events = [
    { title: "Hackathon 2026", date: "Mar 15" },
    { title: "Cultural Fest", date: "Apr 02" },
    { title: "Tech Summit", date: "May 10" },
  ];

  return (
    <section className="event-preview-section">
      <div className="event-preview-container">
        {events.map((event, index) => (
          <div key={index} className="event-preview-card">
            <div className="event-preview-image" />
            <div className="event-preview-content">
              <h3>{event.title}</h3>
              <p>{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}