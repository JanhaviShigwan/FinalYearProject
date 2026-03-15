export function getStoredStudent() {
  try {
    const rawStudent = localStorage.getItem("eventSphereStudent");

    if (!rawStudent) {
      return null;
    }

    return JSON.parse(rawStudent);
  } catch (error) {
    return null;
  }
}

export function isAdminStudent(student) {
  return Boolean(student?._id) && student?.role === "admin";
}

export function getAdminRequestConfig(config = {}) {
  const student = getStoredStudent();

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      "x-admin-id": student?._id || "",
    },
  };
}