import { useCallback, useEffect, useMemo, useState } from "react";
import { ShieldCheck, Sparkles, Trash2, UserCog } from "lucide-react";
import StudentVerificationForm from "./StudentVerification";
import ConfirmPopup from "./popup";
import axios from "axios";
import API_URL from "../api";

import ProfileCard from "../components/ProfileCard";
import Preferences from "../components/Preferences";
import Security from "../components/Security";
import AccountSettings from "../components/AccountSettings";

export default function Settings() {

  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [updatingNotif, setUpdatingNotif] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const studentLocal = useMemo(
    () => JSON.parse(localStorage.getItem("eventSphereStudent")),
    []
  );
  const studentId = studentLocal?._id || studentLocal?.id;

  /* ================= FETCH ================= */

  const fetchStudent = useCallback(async () => {

    if (!studentId) {
      setLoading(false);
      return;
    }

    try {

      const res = await axios.get(
        `${API_URL}/student/${studentId}`
      );

      setCurrentStudent(res.data);

      localStorage.setItem(
        "eventSphereStudent",
        JSON.stringify(res.data)
      );

    } catch (err) {
      console.log(err);
    }

    setLoading(false);

  }, [studentId]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  useEffect(() => {
    if (!studentId) return undefined;

    const intervalId = setInterval(() => {
      fetchStudent();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchStudent, studentId]);


  /* ================= PASSWORD STRENGTH ================= */

  const getStrength = (password) => {

    if (password.length < 8) return "Weak";

    if (password.match(/[A-Z]/) && password.match(/[0-9]/))
      return "Strong";

    return "Medium";

  };


  /* ================= CHANGE PASSWORD ================= */

  const handleChangePassword = async () => {

    setPasswordMsg("");
    setPasswordError("");

    const activeStudentId = currentStudent?._id || studentId;

    if (!activeStudentId) {
      setPasswordError("Session expired. Please log in again.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "Password must be at least 8 characters"
      );
      return;
    }

    const passwordRules = {
      minLength:   /.{8,}/,
      upperCase:   /[A-Z]/,
      lowerCase:   /[a-z]/,
      number:      /[0-9]/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/,
    };

    const passwordValidation = Object.fromEntries(
      Object.entries(passwordRules).map(([k, r]) => [k, r.test(newPassword)])
    );

    if (!Object.values(passwordValidation).every(Boolean)) {
      setPasswordError(
        "Password must contain uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "Passwords do not match"
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password should not be same as current password"
      );
      return;
    }

    try {
      setChangingPassword(true);

      await axios.put(
        `${API_URL}/student/change-password/${activeStudentId}`,
        {
          currentPassword,
          newPassword,
        }
      );

      setPasswordMsg("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {

      setPasswordError(
        err.response?.data?.message ||
        "Error changing password"
      );

    } finally {
      setChangingPassword(false);
    }

  };


  /* ================= DELETE ================= */

  const deleteAccount = async () => {

    try {

      await axios.delete(
        `${API_URL}/student/delete/${studentId}`
      );

      localStorage.clear();

      window.location.href = "/login";

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= UPLOAD IMAGE ================= */

  const uploadImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {

      try {

        setUploading(true);

        const res = await axios.post(
          `${API_URL}/student/upload-image/${studentId}`,
          {
            image: reader.result
          }
        );

        setCurrentStudent(res.data);

        localStorage.setItem(
          "eventSphereStudent",
          JSON.stringify(res.data)
        );

      } catch (err) {
        console.log(err);
      }

      setUploading(false);

    };

    reader.readAsDataURL(file);

  };


  /* ================= REMOVE IMAGE ================= */

  const removeImage = async () => {

    if (!studentId || !currentStudent?.profileImage) {
      return;
    }

    try {
      setRemovingImage(true);

      const res = await axios.post(
        `${API_URL}/student/upload-image/${studentId}`,
        { image: "" }
      );

      setCurrentStudent(res.data);

      localStorage.setItem(
        "eventSphereStudent",
        JSON.stringify(res.data)
      );
    } catch (err) {
      console.log(err);
    }

    setRemovingImage(false);

  };


  /* ================= TOGGLE NOTIF ================= */

  const toggleNotifications = async () => {

    setNotifError("");

    const activeStudentId = currentStudent?._id || studentId;

    if (!activeStudentId || !currentStudent) {
      setNotifError("Session expired. Please log in again.");
      return;
    }

    try {

      setUpdatingNotif(true);

      const newValue =
        !(currentStudent.emailNotifications ?? currentStudent.notificationsEnabled);

      const res = await axios.put(
        `${API_URL}/student/notifications/${activeStudentId}`,
        { notificationsEnabled: newValue }
      );

      setCurrentStudent((prev) => ({
        ...prev,
        emailNotifications: res.data.emailNotifications,
        notificationsEnabled: res.data.notificationsEnabled,
      }));

      localStorage.setItem(
        "eventSphereStudent",
        JSON.stringify({
          ...currentStudent,
          emailNotifications: res.data.emailNotifications,
          notificationsEnabled: res.data.notificationsEnabled,
        })
      );

    } catch (err) {
      setNotifError(
        err.response?.data?.message ||
        "Unable to update notification settings"
      );
      console.log(err);
    }

    setUpdatingNotif(false);

  };


  if (loading)
    return (
      <div className="min-h-screen bg-[#F6F1EB] px-6 py-10">
        <div className="mx-auto max-w-6xl rounded-[28px] border border-soft-blush bg-white p-10 text-center text-deep-slate/60 shadow-sm">
          Loading profile...
        </div>
      </div>
    );


  const profileStatus =
    currentStudent?.role === "admin"
      ? "approved"
      : (currentStudent?.profileStatus || (currentStudent?.profileComplete ? "approved" : "pending"));

  const canEditVerification =
    currentStudent?.role !== "admin";

  const isProfileApproved =
    Boolean(currentStudent?.profileApproved)
    || profileStatus === "approved";

  const statusLabel =
    profileStatus === "approved"
      ? "Approved"
      : profileStatus === "rejected"
        ? "Rejected"
        : "Pending";

  return (

    <div className="min-h-screen bg-[#F6F1EB] px-4 py-8 md:px-8">

      <div className="mx-auto w-full max-w-6xl space-y-6">

        <section className="relative overflow-hidden rounded-[30px] border border-soft-blush bg-white p-7 shadow-sm md:p-9">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-lavender/10" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-20 rounded-full bg-coral/10" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-lavender/20 bg-lavender/10 px-3 py-1 text-sm font-bold text-lavender">
                <Sparkles className="h-4 w-4" />
                Personalize your account
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-deep-slate md:text-4xl">
                Settings
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-deep-slate/60 md:text-base">
                Manage your profile details, security, notifications, and account preferences from one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-soft-blush bg-warm-cream px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-deep-slate/45">Profile</p>
                <p className="mt-1 text-sm font-extrabold text-deep-slate inline-flex items-center gap-1.5">
                  <UserCog className="h-4 w-4 text-lavender" />
                  {currentStudent?.name || "Student"}
                </p>
              </div>
              <div className="rounded-2xl border border-soft-blush bg-white px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-deep-slate/45">Status</p>
                <p className={`mt-1 text-sm font-extrabold inline-flex items-center gap-1.5 ${profileStatus === "approved" ? "text-lavender" : "text-coral"}`}>
                  <ShieldCheck className="h-4 w-4" />
                  {statusLabel}
                </p>
              </div>
            </div>
          </div>
        </section>


        {canEditVerification && (

          <section className="rounded-[28px] border border-soft-blush bg-white p-6 shadow-sm md:p-8">
            {isProfileApproved ? (
              <div className="rounded-2xl border border-lavender/20 bg-lavender/10 px-4 py-3 text-sm font-medium text-deep-slate/75">
                Your profile is approved. You cannot edit details.
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-2xl border border-lavender/20 bg-lavender/10 px-4 py-3 text-sm font-medium text-deep-slate/75">
                  {profileStatus === "rejected"
                    ? "Your last submission was rejected. Update your details here and the new version will go back to admin for approval."
                    : "Your profile is not approved yet. You can still edit your details here, and each save will update the database for admin review."}
                </div>

                <StudentVerificationForm
                  student={currentStudent}
                  onSuccess={(updated) => {

                    localStorage.setItem(
                      "eventSphereStudent",
                      JSON.stringify(updated)
                    );

                    setCurrentStudent(updated);

                    fetchStudent();

                  }}
                />
              </>
            )}
          </section>

        )}


        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          <div className="xl:col-span-3">
            <ProfileCard
              currentStudent={currentStudent}
              uploadImage={uploadImage}
              uploading={uploading}
              removeImage={removeImage}
              removingImage={removingImage}
              onPhoneUpdated={(updatedStudent) => {
                setCurrentStudent(updatedStudent);
              }}
            />
          </div>

          <div className="xl:col-span-1">
            <Preferences
              currentStudent={currentStudent}
              toggleNotifications={toggleNotifications}
              updatingNotif={updatingNotif}
              notifError={notifError}
            />
          </div>

          <div className="xl:col-span-2">
            <Security
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showCurrent={showCurrent}
              setShowCurrent={setShowCurrent}
              showNew={showNew}
              setShowNew={setShowNew}
              showConfirm={showConfirm}
              setShowConfirm={setShowConfirm}
              getStrength={getStrength}
              passwordMsg={passwordMsg}
              passwordError={passwordError}
              changePassword={handleChangePassword}
              changingPassword={changingPassword}
            />
          </div>

          <div className="xl:col-span-3">
            <AccountSettings
              deleteAccount={() => setDeleteOpen(true)}
            />
          </div>
        </div>

      </div>

      <ConfirmPopup
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account?"
        confirmText="Delete"
        cancelText="Cancel"
        icon={<Trash2 size={20} />}
      />

    </div>

  );

}