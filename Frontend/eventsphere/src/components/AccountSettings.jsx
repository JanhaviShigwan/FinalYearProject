import { History, Trash2 } from "lucide-react";

export default function AccountSettings({
  deleteAccount,
  viewLoginActivity,
  loginActivityError,
  loadingLoginActivity
}) {
  return (
    <div className="rounded-[28px] border border-soft-blush bg-white p-6 shadow-sm">

      <h2 className="text-xl font-extrabold text-deep-slate mb-5">
        Account
      </h2>


      <div className="mb-4 flex items-center justify-between rounded-2xl border border-soft-blush bg-warm-cream px-5 py-4">

        <div>
          <p className="font-semibold text-[#3F3D56] inline-flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-coral" />
            Delete Account
          </p>

          <p className="text-sm text-deep-slate/55">
            Permanently remove your account
          </p>
        </div>

        <button
          onClick={deleteAccount}
          className="rounded-xl border border-coral/30 bg-coral/10 px-5 py-2 text-sm font-bold text-coral transition-colors hover:bg-coral hover:text-white"
        >
          Delete
        </button>

      </div>


      <div className="flex items-center justify-between rounded-2xl border border-soft-blush bg-white px-5 py-4">

        <div>
          <p className="font-semibold text-[#3F3D56] inline-flex items-center gap-2">
            <History className="h-4 w-4 text-lavender" />
            Login Activity
          </p>

          <p className="text-sm text-deep-slate/55">
            View recent login history
          </p>
        </div>

        <button
          onClick={viewLoginActivity}
          disabled={loadingLoginActivity}
          className="rounded-xl bg-lavender px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-lavender/90"
        >
          {loadingLoginActivity ? "Loading..." : "View"}
        </button>

      </div>

      {loginActivityError && (
        <p className="mt-4 rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
          {loginActivityError}
        </p>
      )}

    </div>
  );
}