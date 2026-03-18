const parseEventTime = (rawTime) => {
  if (!rawTime || typeof rawTime !== "string") {
    return null;
  }

  const value = rawTime.trim();

  const twelveHourMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    const hour12 = Number(twelveHourMatch[1]);
    const minute = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3].toUpperCase();

    if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) {
      return null;
    }

    let hour24 = hour12 % 12;
    if (period === "PM") {
      hour24 += 12;
    }

    return { hours: hour24, minutes: minute };
  }

  const twentyFourHourMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    return { hours: hour, minutes: minute };
  }

  return null;
};

const parseEventDate = (rawDate) => {
  if (!rawDate) {
    return null;
  }

  if (rawDate instanceof Date) {
    const copy = new Date(rawDate);
    return Number.isNaN(copy.getTime()) ? null : copy;
  }

  if (typeof rawDate === "string") {
    const trimmed = rawDate.trim();
    const dateOnlyMatch = trimmed.match(/^\d{4}-\d{2}-\d{2}$/);

    if (dateOnlyMatch) {
      const parsedDateOnly = new Date(`${trimmed}T00:00:00`);
      return Number.isNaN(parsedDateOnly.getTime()) ? null : parsedDateOnly;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const fallback = new Date(rawDate);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const buildEventDateTime = (dateValue, timeValue, useEndOfDayWhenNoTime = false) => {
  const baseDate = parseEventDate(dateValue);

  if (!baseDate) {
    return null;
  }

  const parsedTime = parseEventTime(timeValue);

  if (parsedTime) {
    baseDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
    return baseDate;
  }

  if (useEndOfDayWhenNoTime) {
    baseDate.setHours(23, 59, 59, 999);
  } else {
    baseDate.setHours(0, 0, 0, 0);
  }

  return baseDate;
};

export const getEventStartDateTime = (event) => {
  const startDate = event?.date || event?.startDate || event?.eventDate;
  const startTime = event?.time || event?.startTime;

  return buildEventDateTime(startDate, startTime, false);
};

export const getEventEndDateTime = (event) => {
  const startDateTime = getEventStartDateTime(event);

  const endDate = event?.endDate || event?.date || event?.startDate || event?.eventDate;
  const endTime = event?.endTime || event?.time || event?.startTime;
  const explicitEndDateTime = buildEventDateTime(endDate, endTime, true);

  if (explicitEndDateTime && startDateTime && explicitEndDateTime < startDateTime) {
    const fallbackEnd = new Date(startDateTime);
    fallbackEnd.setHours(fallbackEnd.getHours() + 3);
    return fallbackEnd;
  }

  if (explicitEndDateTime) {
    return explicitEndDateTime;
  }

  if (!startDateTime) {
    return null;
  }

  const inferredEnd = new Date(startDateTime);
  inferredEnd.setHours(inferredEnd.getHours() + 3);
  return inferredEnd;
};

export const getEventLifecycleStatus = (event, nowDate = new Date()) => {
  const now = nowDate instanceof Date ? nowDate : new Date(nowDate);
  const safeNow = Number.isNaN(now.getTime()) ? new Date() : now;

  const startDateTime = getEventStartDateTime(event);
  const endDateTime = getEventEndDateTime(event);

  if (startDateTime && safeNow < startDateTime) {
    return "upcoming";
  }

  if (endDateTime && safeNow > endDateTime) {
    return "ended";
  }

  if (startDateTime && endDateTime) {
    return "live";
  }

  if (startDateTime) {
    return safeNow >= startDateTime ? "live" : "upcoming";
  }

  if (endDateTime) {
    return safeNow > endDateTime ? "ended" : "live";
  }

  return "upcoming";
};

export const getEventLifecycleLabel = (status) => {
  if (status === "live") {
    return "Live";
  }

  if (status === "ended") {
    return "Ended";
  }

  return "Upcoming";
};

export const getEventRegistrationOpenDate = (event, registrationOpenDaysBefore = 14) => {
  const startDateTime = getEventStartDateTime(event);

  if (!startDateTime) {
    return null;
  }

  const openDate = new Date(startDateTime);
  openDate.setDate(openDate.getDate() - registrationOpenDaysBefore);
  return openDate;
};

export const isEventRegistrationOpen = (
  event,
  {
    registrationOpenDaysBefore = 14,
    nowDate = new Date(),
    autoCloseWhenFull = true,
  } = {}
) => {
  const now = nowDate instanceof Date ? nowDate : new Date(nowDate);
  const safeNow = Number.isNaN(now.getTime()) ? new Date() : now;

  const openDate = getEventRegistrationOpenDate(event, registrationOpenDaysBefore);
  const endDateTime = getEventEndDateTime(event);

  if (!openDate || !endDateTime) {
    return false;
  }

  const capacity = Number(event?.totalCapacity);
  const registered = Number(event?.registeredUsers);

  const hasSlots = !autoCloseWhenFull
    ? true
    : (Number.isFinite(capacity) && Number.isFinite(registered)
      ? registered < capacity
      : true);

  return safeNow >= openDate && safeNow <= endDateTime && hasSlots;
};