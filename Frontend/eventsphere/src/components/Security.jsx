import { Eye, EyeOff } from "lucide-react";

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
  return (
    <div className="bg-[#F6F1EB] border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold text-[#3F3D56] mb-5">
        Security
      </h2>

      <div className="space-y-4">

        {/* Current */}
        <div>

          <label className="text-sm font-medium">
            Current Password
          </label>

          <div className="flex items-center border rounded-xl px-3 py-2 bg-white">

            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              className="flex-1 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrent(!showCurrent)
              }
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

          <label className="text-sm font-medium">
            New Password
          </label>

          <div className="flex items-center border rounded-xl px-3 py-2 bg-white">

            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="flex-1 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(!showNew)
              }
            >
              {showNew ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <p className="text-xs text-gray-500 mt-1">
            Strength: {getStrength(newPassword)}
          </p>

        </div>


        {/* Confirm */}
        <div>

          <label className="text-sm font-medium">
            Confirm Password
          </label>

          <div className="flex items-center border rounded-xl px-3 py-2 bg-white">

            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="flex-1 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
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
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {passwordError || passwordMsg}
          </p>
        )}


        {/* Button */}

        <button
          type="button"
          onClick={changePassword}
          className="bg-[#9B96E5] text-white px-6 py-2 rounded-xl"
        >
          Change Password
        </button>

      </div>

    </div>
  );
}