import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

export default function MyRegistrations() {

  const [myEvents, setMyEvents] = useState([]);

  const student = JSON.parse(localStorage.getItem("eventSphereStudent"));

  useEffect(() => {

    const fetchMyEvents = async () => {

      try {

        const res = await axios.get(
          `${API_URL}/events/student-registrations/${student._id}`
        );

        setMyEvents(res.data);

      } catch (error) {
        console.error("Error fetching registrations:", error);
      }

    };

    if (student?._id) {
      fetchMyEvents();
    }

  }, [student?._id]);

  const cancelRegistration = async (eventId) => {

    try {

      await axios.delete(
        `${API_URL}/api/events/cancel-registration/${student._id}/${eventId}`
      );

      setMyEvents((prev) => prev.filter((e) => e._id !== eventId));

    } catch (error) {
      console.error("Cancel registration error:", error);
    }

  };

  return (

    <div className="mt-12">

      <h2 className="text-xl font-semibold text-[#3F3D56] mb-6">
        My Registered Events
      </h2>

      {myEvents.length === 0 ? (

        <p className="text-gray-500">
          You have not registered for any events yet.
        </p>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {myEvents.map((event) => (

            <div
              key={event._id}
              className="bg-white rounded-2xl border p-5 flex flex-col gap-3"
            >

              <h3 className="text-lg font-semibold text-[#3F3D56]">
                {event.eventName}
              </h3>

              <p className="text-sm text-gray-500">
                {event.date} • {event.time}
              </p>

              <p className="text-sm text-gray-500">
                {event.venue}
              </p>

              <button
                onClick={() => cancelRegistration(event._id)}
                className="mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Cancel Registration
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}