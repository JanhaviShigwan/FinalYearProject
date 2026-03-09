import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Calendar, AlarmClock, Flame, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";

export default function Dashboard() {

  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);

  const student = useMemo(() => {
    return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
  }, []);

  const [dashboardData, setDashboardData] = useState({
    myRegistrations: [],
    upcomingEventList: [],
    ongoingEvents: [],
  });

  // const cancelRegistration = async (eventId) => {

  //   try {

  //     await axios.delete(
  //       `http://localhost:5000/api/events/cancel-registration/${student._id}/${eventId}`
  //     );

  //     setMyEvents((prev) => prev.filter(e => e._id !== eventId));

  //   } catch (error) {
  //     console.error(error);
  //   }

  // };

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/dashboard/${student._id}`
        );
        setDashboardData(res.data);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }

    };

    const fetchMyEvents = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/events/student-registrations/${student._id}`
        );

        setMyEvents(res.data);

      } catch (error) {
        console.error(error);
      }

    };

    if (student?._id) {
      fetchDashboard();
      fetchMyEvents();
    }

  }, [student]);

  const stats = [
    { icon: <Calendar size={28} color="#9B96E5" />, value: myEvents.length, label: "My Registered Events" },
    { icon: <AlarmClock size={28} color="#5ac4eb" />, value: dashboardData.upcomingEventList.length, label: "Upcoming Events" },
    { icon: <Flame size={28} color="#F08A6C" />, value: dashboardData.ongoingEvents.length, label: "Ongoing Events" },
  ];

  return (
    <>
      {!student?.profileComplete && (

        <div className="bg-[#FFF4E5] border border-[#F08A6C]/40 rounded-2xl p-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <AlertCircle size={22} color="#F08A6C" />

            <p className="text-[#3F3D56] font-medium">
              Complete your profile to register for events.
            </p>

          </div>

          <button
            onClick={() => navigate("/settings")}
            className="bg-[#F08A6C] text-white px-5 py-2 rounded-xl font-medium hover:bg-[#e67858]"
          >
            Complete Profile
          </button>

        </div>

      )}

      <div className="bg-white rounded-2xl border p-8 mt-6">

        <h1 className="text-3xl font-semibold text-[#3F3D56]">
          Welcome back, {student?.name} ✨
        </h1>

        <p className="text-gray-500 mt-2">
          Explore events happening across campus.
        </p>

      </div>

      <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">

        {stats.map(({ icon, value, label }) => (

          <div key={label} className="rounded-3xl border p-6 flex flex-col gap-4" style={{ backgroundColor: "#fcf9f6" }}>

            <div className="text-2xl">{icon}</div>

            <h2 className="text-3xl font-semibold text-[#3F3D56]">{value}</h2>

            <p className="text-gray-600">{label}</p>

          </div>

        ))}

      </div>

      <div className="mt-12">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {dashboardData?.upcomingEventList?.map((event) => (

            <EventCard
              key={event._id}
              category={event.category}
              title={event.eventName}
              date={`${event.date} - ${event.time}`}
              location={event.venue}
              image={event.image}
            />

          ))}

        </div>

      </div>
    </>
  );
}