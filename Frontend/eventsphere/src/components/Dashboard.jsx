import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Calendar, AlarmClock, Flame, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function Dashboard() {

  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const student = useMemo(() => {
    return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
  }, []);

  const [dashboardData, setDashboardData] = useState({
    myRegistrations: [],
    upcomingEventList: [],
    ongoingEvents: [],
  });

  const needsProfileCompletion =
    student?.role !== "admin" && !student?.profileComplete;

  // ================= FETCH =================

  useEffect(() => {

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/dashboard/${student._id}`
        );
        setDashboardData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMyEvents = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/events/student-registrations/${student._id}`
        );
        setMyEvents(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/announcements`
        );
        setAnnouncements(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    let announcementsInterval;

    if (student?._id) {
      fetchDashboard();
      fetchMyEvents();
      fetchAnnouncements();

      announcementsInterval = setInterval(() => {
        fetchAnnouncements();
      }, 30000);
    }

    return () => {
      if (announcementsInterval) {
        clearInterval(announcementsInterval);
      }
    };

  }, [student]);

  const today = new Date();

const upcomingEventsFiltered = dashboardData.upcomingEventList.filter(
  (event) => {

    const eventDate = new Date(event.date);

    const isFuture = eventDate > today;

    const isRegistered = myEvents.some(
      (e) => e._id === event._id
    );

    const canRegister =
      event.registrationOpen !== false;

    return isFuture && !isRegistered && canRegister;
  }
);

  // ================= STATS =================

  const stats = [
    {
      icon: <Calendar size={28} color="#9B96E5" />,
      value: myEvents.length,
      label: "My Registered Events",
    },
    {
      icon: <AlarmClock size={28} color="#5ac4eb" />,
      value: dashboardData.upcomingEventList.length,
      label: "Upcoming Events",
    },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* PROFILE ALERT */}

      {needsProfileCompletion && (

        <div className="bg-[#FFF4E5] border border-[#F08A6C]/40 rounded-2xl p-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <AlertCircle size={22} color="#F08A6C" />

            <p className="text-[#3F3D56] font-medium">
              Complete your profile to register for events.
            </p>

          </div>

          <button
            onClick={() => navigate("/settings")}
            className="bg-[#F08A6C] text-white px-5 py-2 rounded-xl"
          >
            Complete Profile
          </button>

        </div>

      )}

      {/* WELCOME */}

      <div className="bg-white rounded-2xl border p-8">

        <h1 className="text-3xl font-semibold text-[#3F3D56]">
          Welcome back, {student?.name} ✨
        </h1>

        <p className="text-gray-500 mt-2">
          Explore events happening across campus.
        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-3 gap-6">

        {stats.map(({ icon, value, label }) => (

          <div
            key={label}
            className="rounded-3xl border p-6 flex flex-col gap-4 hover:shadow-lg transition bg-[#fcf9f6]"
          >

            <div>{icon}</div>

            <h2 className="text-3xl font-semibold text-[#3F3D56]">
              {value}
            </h2>

            <p className="text-gray-600">{label}</p>

          </div>

        ))}

      </div>


      {/* ANNOUNCEMENTS */}

      <div>

        <h2 className="text-2xl font-bold mb-4 text-[#3F3D56]">
          Announcements
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {announcements
            .slice(0, 4)
            .map((a) => (

              <div
                key={a._id}
                className="
                  p-5
                  rounded-xl
                  border
                  bg-[#FCF9F6]
                  hover:shadow-xl
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >

                <h3 className="text-[20px] font-bold text-[#9B96E5]">
                  {a.title}
                </h3>

                <p className="text-sm text-[#3F3D56] mt-1">
                  {a.message}
                </p>

                <span className="text-xs text-gray-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}