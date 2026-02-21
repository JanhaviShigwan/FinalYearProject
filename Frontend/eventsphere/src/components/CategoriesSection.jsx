export default function Categories() {
  const categories = [
    {
      title: "Technical",
      description: "Coding contests & tech talks",
      icon: "💻",
    },
    {
      title: "Cultural",
      description: "Dance, music & art events",
      icon: "🎵",
    },
    {
      title: "Sports",
      description: "Tournaments & fitness challenges",
      icon: "🏆",
    },
    {
      title: "Workshops",
      description: "Hands-on learning sessions",
      icon: "🛠",
    },
    {
      title: "Hackathons",
      description: "Build, innovate & compete",
      icon: "🚀",
    },
  ];

  return (
    <section className="categories-section">
      <div className="categories-container">

        <h2 className="categories-title">
          Browse <span className="categories-gradient">Categories</span>
        </h2>

        <p className="categories-subtitle">
          Find events that match your interests and passions
        </p>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">
                {cat.icon}
              </div>

              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}