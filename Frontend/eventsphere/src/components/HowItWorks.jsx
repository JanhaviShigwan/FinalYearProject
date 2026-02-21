export default function HowItWorks() {
  const steps = ["Register", "Browse Events", "Book Ticket", "Attend & Enjoy"];

  return (
    <section className="section bg-white text-center">
      <h2 className="section-title">How It Works</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div key={step} className="card p-6">
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}