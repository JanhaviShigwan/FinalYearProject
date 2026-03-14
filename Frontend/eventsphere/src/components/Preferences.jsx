export default function Preferences({
  currentStudent,
  toggleNotifications,
  updatingNotif
}) {
  return (
    <div className="bg-[#F6F1EB] border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold text-[#3F3D56] mb-5">
        Preferences
      </h2>

      <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-200 shadow-sm">

        <div>

          <p className="font-semibold text-[#3F3D56]">
            Email Notifications
          </p>

          <p className="text-sm text-gray-500">
            Receive email when you register for events
          </p>

        </div>

        <button
          onClick={toggleNotifications}
          disabled={updatingNotif}
          className={`relative w-16 h-8 flex items-center rounded-full transition duration-300 ${
            currentStudent.notificationsEnabled
              ? "bg-[#9B96E5]"
              : "bg-gray-300"
          }`}
        >

          <span
            className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
              currentStudent.notificationsEnabled
                ? "translate-x-8"
                : ""
            }`}
          />

        </button>

      </div>

      <p className="mt-3 text-sm text-gray-500">

        {currentStudent.notificationsEnabled
          ? "You will receive event registration emails."
          : "Event emails are disabled."}

      </p>

    </div>
  );
}