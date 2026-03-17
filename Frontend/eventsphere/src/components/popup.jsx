import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function ConfirmPopup({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  isLoading = false,
  loadingText = "Processing..."
}) {
  if (!open) return null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-[9999]"
      onClick={(e) => {
        if (!isLoading && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg" aria-busy={isLoading}>

        {/* Header */}

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">

            {icon && (
              <div className="text-[#F08A6C]">
                {icon}
              </div>
            )}

            <h2 className="text-lg font-semibold text-[#3F3D56]">
              {title}
            </h2>

          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>

        </div>


        {/* Description */}

        <p className="text-sm text-gray-600 mb-6">
          {description}
        </p>


        {/* Buttons */}

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-[#F08A6C] text-white rounded-xl disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {isLoading ? loadingText : confirmText}
          </button>

        </div>

      </div>

    </div>
  , document.body);
}