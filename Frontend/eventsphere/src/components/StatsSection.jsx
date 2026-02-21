import { Calendar, GraduationCap, Building2 } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">

        <div className="stats-card">
          <Calendar className="stats-icon" size={28} />
          <h3>200+</h3>
          <p>Events Conducted</p>
        </div>

        <div className="stats-card">
          <GraduationCap className="stats-icon" size={28} />
          <h3>5,000+</h3>
          <p>Students Registered</p>
        </div>

        <div className="stats-card">
          <Building2 className="stats-icon" size={28} />
          <h3>20+</h3>
          <p>Colleges Connected</p>
        </div>

      </div>
    </section>
  );
}