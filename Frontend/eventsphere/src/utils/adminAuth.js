export function getStoredStudent() {
  try {
    // Admin sessions are stored in sessionStorage; student sessions in localStorage.
    const rawStudent =
      sessionStorage.getItem("eventSphereStudent") ||
      localStorage.getItem("eventSphereStudent");

    if (!rawStudent) {
      return null;
    }

    return JSON.parse(rawStudent);
  } catch (error) {
    return null;
  }
}

function getStudentIdentifier(student) {
  return student?._id || student?.id || "";
}

export function isAdminStudent(student) {
  return Boolean(getStudentIdentifier(student)) && student?.role === "admin";
}

export function getAdminRequestConfig(config = {}) {
  const student = getStoredStudent();
  const studentId = getStudentIdentifier(student);

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      "x-admin-id": studentId,
    },
  };
}