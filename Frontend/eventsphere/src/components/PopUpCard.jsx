import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, XCircle, AlertTriangle, Info, LogIn, UserCog } from "lucide-react";

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-[#9B96E5]",
    iconBg: "bg-[#F4F1FF]",
    iconRing: "ring-[#E8E3FF]",
    accentFrom: "#9B96E5",
    accentTo: "#F08A6C",
    btnBg: "bg-[#F08A6C] hover:bg-[#E47658]",
  },
  error: {
    icon: XCircle,
    iconColor: "text-[#F08A6C]",
    iconBg: "bg-[#FFF4EF]",
    iconRing: "ring-[#FFE4D8]",
    accentFrom: "#9B96E5",
    accentTo: "#F08A6C",
    btnBg: "bg-[#F08A6C] hover:bg-[#E47658]",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-[#F08A6C]",
    iconBg: "bg-[#FFF4EF]",
    iconRing: "ring-[#FFE4D8]",
    accentFrom: "#9B96E5",
    accentTo: "#F08A6C",
    btnBg: "bg-[#F08A6C] hover:bg-[#E47658]",
  },
  login: {
    icon: LogIn,
    iconColor: "text-[#9B96E5]",
    iconBg: "bg-[#F4F1FF]",
    iconRing: "ring-[#E8E3FF]",
    accentFrom: "#9B96E5",
    accentTo: "#F08A6C",
    btnBg: "bg-[#F08A6C] hover:bg-[#E47658]",
  },
  profile: {
    icon: UserCog,
    iconColor: "text-[#9B96E5]",
    iconBg: "bg-[#F4F1FF]",
    iconRing: "ring-[#E8E3FF]",
    accentFrom: "#9B96E5",
    accentTo: "#F08A6C",
    btnBg: "bg-[#F08A6C] hover:bg-[#E47658]",
  },
  info: {
    icon: Info,
    iconColor: "text-[#9B96E5]",
    iconBg: "bg-[#F4F1FF]",
    iconRing: "ring-[#E8E3FF]",
    accentFrom: "#9B96E5",
    accentTo: "#F08A6C",
    btnBg: "bg-[#F08A6C] hover:bg-[#E47658]",
  },
};

function getVariant(title = "") {
  const t = title.toLowerCase();
  if (t.includes("success")) return "success";
  if (t.includes("error") || t.includes("rejected") || t.includes("invalid") || t.includes("failed")) return "error";
  if (t.includes("review") || t.includes("incomplete") || t.includes("full") || t.includes("warning")) return "warning";
  if (t.includes("login") || t.includes("sign in")) return "login";
  if (t.includes("profile") || t.includes("account")) return "profile";
  return "info";
}

export default function PopupCard({ title, message, onClose, action, actionLabel }) {
  const key = getVariant(title);
  const v = VARIANTS[key];
  const Icon = v.icon;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(63, 61, 86, 0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-full max-w-[460px] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_22px_58px_rgba(15,23,42,0.24)]"
        style={{ animation: "popupIn 0.24s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <div
          className="h-[4px]"
          style={{ background: `linear-gradient(90deg, ${v.accentFrom}, ${v.accentTo})` }}
        />

        <div className="p-7 sm:p-8">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${v.iconBg} ${v.iconRing}`}>
                <Icon size={20} className={v.iconColor} strokeWidth={2.25} />
              </div>
              <h2 className="text-[1.5rem] font-semibold leading-snug text-[#2E2B44]">
                {title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="ml-4 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mb-8 pl-14 text-[1.06rem] leading-relaxed text-slate-500">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                action
                  ? "border border-slate-200 text-[#3F3D56] hover:bg-slate-50"
                  : "bg-[#F08A6C] text-white hover:bg-[#E47658]"
              }`}
            >
              {action ? "Cancel" : "OK"}
            </button>

            {action && (
              <button
                onClick={action}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition ${v.btnBg}`}
              >
                {actionLabel || "Go"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
