export default function Categories() {
  const categories = ["Technical", "Cultural", "Sports", "Workshops", "Hackathons"];

  return (
    <section className="section bg-white">
      <h2 className="section-title">Categories</h2>

      <div className="grid md:grid-cols-5 gap-6 text-center">
        {categories.map((cat) => (
          <div key={cat} className="card p-6 cursor-pointer hover:bg-secondary hover:text-white">
            {cat}
          </div>
        ))}
      </div>
    </section>
  );
}