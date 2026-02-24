import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

export default function Dashboard() {
  // Temporary static student data (later connect with backend)
  const student = {
    name: "Cherry Sharma",
    email: "cherry@example.com",
    rollNo: "CS2025001",
    department: "Computer Science",
    year: "3rd Year",
    phone: "+91 9876543210",
    profilePic: "https://i.pravatar.cc/150?img=5",
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">Student Dashboard</h1>

        <div className="dashboard-grid">

          {/* Profile Card */}
          <div className="profile-card">
            <img
              src={student.profilePic}
              alt="Profile"
              className="profile-image"
            />
            <h2>{student.name}</h2>
            <p>{student.department}</p>
          </div>

          {/* Student Info */}
          <div className="info-card">
            <h3>Student Information</h3>

            <div className="info-row">
              <span>Roll No:</span>
              <p>{student.rollNo}</p>
            </div>

            <div className="info-row">
              <span>Email:</span>
              <p>{student.email}</p>
            </div>

            <div className="info-row">
              <span>Year:</span>
              <p>{student.year}</p>
            </div>

            <div className="info-row">
              <span>Phone:</span>
              <p>{student.phone}</p>
            </div>
          </div>

          {/* Quick Stats (basic) */}
          <div className="stats-card">
            <h3>Quick Overview</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <h4>5</h4>
                <p>Registered Events</p>
              </div>

              <div className="stat-box">
                <h4>2</h4>
                <p>Upcoming Events</p>
              </div>

              <div className="stat-box">
                <h4>3</h4>
                <p>Completed Events</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}