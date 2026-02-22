import hackathon from "../assets/hackathon.jpg";
import cultural from "../assets/cultural.jpg";
import tech from "../assets/tech.jpg";

export default function EventPreview() {
  const events = [
    {
      title: "Hackathon 2026",
      date: "Mar 15",
      image: hackathon,
    },
    {
      title: "Cultural Fest",
      date: "Apr 02",
      image: cultural,
    },
    {
      title: "Tech Summit",
      date: "May 10",
      image: tech,
    },
  ];

  return (
    <section className="event-preview-section">
      <div className="event-preview-container">
        {events.map((event, index) => (
          <div key={index} className="event-preview-card">
            <div className="event-preview-image-wrapper">
              <img
                src={event.image}
                alt={event.title}
                className="event-preview-image"
              />
            </div>

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