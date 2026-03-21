import { BellRing, Mail } from "lucide-react";

export default function Preferences({
  currentStudent,
  toggleNotifications,
  updatingNotif,
  notifError
}) {
  const enabled = currentStudent?.emailNotifications ?? !!currentStudent?.notificationsEnabled;

  return (
    <div className="h-full rounded-[28px] border border-soft-blush bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-2xl font-extrabold text-deep-slate">
          <BellRing className="h-5 w-5 text-lavender" />
          Preferences
        </h2>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${enabled ? "bg-lavender/10 text-lavender" : "bg-deep-slate/10 text-deep-slate/60"}`}>
          {enabled ? "ON" : "OFF"}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-soft-blush bg-warm-cream p-4">
        <div className="flex items-center justify-between">
          <div>

            <p className="inline-flex items-center gap-2 text-lg font-bold text-[#3F3D56]">
              <Mail className="h-4 w-4 text-coral" />
              Email Notifications
            </p>

            <p className="mt-1 text-base leading-7 text-deep-slate/55">
              Receive alerts when you register, get updates, or event details change.
            </p>

          </div>

          <button
            onClick={toggleNotifications}
            disabled={updatingNotif}
            className={`relative inline-flex h-9 w-[72px] shrink-0 items-center rounded-full p-1 transition-colors duration-300 ${
              enabled ? "bg-lavender" : "bg-deep-slate/25"
            } ${updatingNotif ? "opacity-70" : ""}`}
            aria-label="Toggle email notifications"
          >

            <span
              className={`h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 ${
                enabled ? "translate-x-[36px]" : "translate-x-0"
              }`}
            />

          </button>

        </div>
      </div>

      <p className="mt-4 text-base text-deep-slate/55">

        {enabled
          ? "You will receive promotional event emails."
          : "Promotional event emails are disabled."}

      </p>

      {notifError ? (
        <p className="mt-3 text-sm font-semibold text-coral">
          {notifError}
        </p>
      ) : null}

    </div>
  );
}