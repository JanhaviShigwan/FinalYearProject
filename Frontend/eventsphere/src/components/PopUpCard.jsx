import React from "react";

export default function PopupCard({ title, message, onClose, action }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

      <div className="bg-white w-[380px] p-6 rounded-2xl shadow-lg">

        <h2 className="text-xl font-semibold text-[#3F3D56] mb-3">
          {title}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          {action && (
            <button
              onClick={action}
              className="bg-[#9B96E5] text-white px-4 py-2 rounded-lg"
            >
              Go
            </button>
          )}

          <button
            onClick={onClose}
            className="bg-[#F08A6C] text-white px-4 py-2 rounded-lg"
          >
            OK
          </button>

        </div>

      </div>

    </div>
  );
}