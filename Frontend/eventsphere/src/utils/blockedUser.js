export const BLOCKED_POPUP_MESSAGE = "Your account is blocked. Please contact admin.";

const BLOCKED_NOTICE_KEY = "eventsphereBlockedNotice";
const BLOCKED_EVENT_NAME = "eventsphere:blocked";

export const isBlockedPayload = (payload) => payload?.message === "BLOCKED";

export const consumeBlockedNotice = () => {
  const shouldShow = sessionStorage.getItem(BLOCKED_NOTICE_KEY) === "1";

  if (shouldShow) {
    sessionStorage.removeItem(BLOCKED_NOTICE_KEY);
  }

  return shouldShow;
};

export const triggerBlockedLogout = () => {
  localStorage.removeItem("eventSphereStudent");
  sessionStorage.removeItem("eventSphereStudent");
  sessionStorage.setItem(BLOCKED_NOTICE_KEY, "1");

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BLOCKED_EVENT_NAME));

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
};

export const BLOCKED_EVENT = BLOCKED_EVENT_NAME;
