import { X } from "lucide-react";

export default function ConfirmPopup({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg">

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

          <button onClick={onClose}>
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
            className="px-4 py-2 border rounded-xl"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#F08A6C] text-white rounded-xl"
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}