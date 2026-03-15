import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function Security({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  getStrength,
  passwordMsg,
  passwordError,
  changePassword
}) {
  const strength = getStrength(newPassword);

  const strengthStyles =
    strength === "Strong"
      ? "bg-pastel-green/30 text-deep-slate"
      : strength === "Medium"
        ? "bg-coral/20 text-coral"
        : "bg-deep-slate/10 text-deep-slate/60";

  const inputBase =
    "mt-1 flex items-center rounded-xl border border-soft-blush bg-white px-3 py-2.5 focus-within:border-lavender focus-within:ring-2 focus-within:ring-lavender/20";

  return (
    <div className="h-full rounded-[28px] border border-soft-blush bg-white p-6 shadow-sm">

      <h2 className="inline-flex items-center gap-2 text-xl font-extrabold text-deep-slate">
        <ShieldCheck className="h-5 w-5 text-lavender" />
        Security
      </h2>

      <p className="mt-1 text-sm text-deep-slate/55">
        Keep your account secure by updating your password regularly.
      </p>

      <div className="mt-5 space-y-4">

        {/* Current */}
        <div>

          <label className="text-sm font-semibold text-deep-slate/80">
            Current Password
          </label>

          <div className={inputBase}>

            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              className="flex-1 bg-transparent text-sm text-deep-slate outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrent(!showCurrent)
              }
              className="text-deep-slate/45 hover:text-lavender"
            >
              {showCurrent ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

        </div>


        {/* New */}
        <div>

          <label className="text-sm font-semibold text-deep-slate/80">
            New Password
          </label>

          <div className={inputBase}>

            <LockKeyhole size={16} className="mr-2 text-lavender/70" />

            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="flex-1 bg-transparent text-sm text-deep-slate outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(!showNew)
              }
              className="text-deep-slate/45 hover:text-lavender"
            >
              {showNew ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <div className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${strengthStyles}`}>
            Strength: {strength}
          </div>

        </div>


        {/* Confirm */}
        <div>

          <label className="text-sm font-semibold text-deep-slate/80">
            Confirm Password
          </label>

          <div className={inputBase}>

            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="flex-1 bg-transparent text-sm text-deep-slate outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
              className="text-deep-slate/45 hover:text-lavender"
            >
              {showConfirm ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

        </div>


        {/* Message */}

        {(passwordMsg || passwordError) && (
          <p
            className={`text-sm ${
              passwordError
                ? "text-coral"
                : "text-lavender"
            }`}
          >
            {passwordError || passwordMsg}
          </p>
        )}


        {/* Button */}

        <button
          type="button"
          onClick={changePassword}
          className="inline-flex items-center justify-center rounded-xl bg-lavender px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-lavender/90"
        >
          Change Password
        </button>

      </div>

    </div>
  );
}