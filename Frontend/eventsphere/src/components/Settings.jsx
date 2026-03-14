import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
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
  const [updatingNotif, setUpdatingNotif] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  /* ================= PASSWORD STATES ================= */

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const studentLocal = JSON.parse(
    localStorage.getItem("eventSphereStudent")
  );


  /* ================= FETCH ================= */

  useEffect(() => {

    if (!studentLocal?._id) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {

      try {

        const res = await axios.get(
          `${API_URL}/api/student/${studentLocal._id}`
        );

        setCurrentStudent(res.data);

      } catch (err) {
        console.log(err);
      }

      setLoading(false);

    };

    fetchStudent();

  }, [studentLocal?._id]);


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

      const res = await axios.put(
        `${API_URL}/api/student/change-password/${currentStudent._id}`,
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

    }

  };


  /* ================= DELETE ACCOUNT ================= */

  const deleteAccount = async () => {

    try {

      await axios.delete(
        `${API_URL}/api/student/delete/${studentLocal._id}`
      );

      localStorage.clear();

      window.location.href = "/login";

    } catch (err) {
      console.log(err);
    }

  };


  /* ================= LOGIN ACTIVITY ================= */

  const viewLoginActivity = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/student/login-activity/${studentLocal._id}`
      );

      alert(
        res.data.length
          ? JSON.stringify(res.data, null, 2)
          : "No login activity"
      );

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
          `${API_URL}/api/student/upload-image/${studentLocal._id}`,
          {
            image: reader.result
          }
        );

        setCurrentStudent(res.data);

      } catch (err) {
        console.log(err);
      }

      setUploading(false);

    };

    reader.readAsDataURL(file);

  };


  /* ================= TOGGLE NOTIFICATIONS ================= */

  const toggleNotifications = async () => {

    try {

      setUpdatingNotif(true);

      const newValue = !currentStudent.notificationsEnabled;

      const res = await axios.put(
        `${API_URL}/api/student/notifications/${studentLocal._id}`,
        { notificationsEnabled: newValue }
      );

      setCurrentStudent({
        ...currentStudent,
        notificationsEnabled: res.data.notificationsEnabled
      });

    } catch (err) {
      console.log(err);
    }

    setUpdatingNotif(false);

  };


  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading profile...
      </div>
    );


  const isVerified = currentStudent?.profileComplete;


  return (

    <div className="min-h-screen bg-[#F6F1EB] flex justify-center px-6 py-12">

      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-100 shadow-sm p-10">

        <h1 className="text-3xl font-semibold text-[#3F3D56] mb-6">
          Settings
        </h1>


        {!isVerified && (

          <StudentVerificationForm
            student={currentStudent}
            onSuccess={(updated) => setCurrentStudent(updated)}
          />

        )}


        {isVerified && (

          <div className="space-y-6">

            <ProfileCard
              currentStudent={currentStudent}
              uploadImage={uploadImage}
              uploading={uploading}
            />

            <Preferences
              currentStudent={currentStudent}
              toggleNotifications={toggleNotifications}
              updatingNotif={updatingNotif}
            />

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
            />

            <AccountSettings
              deleteAccount={() => setDeleteOpen(true)}
              viewLoginActivity={viewLoginActivity}
            />

          </div>

        )}

      </div>
      <ConfirmPopup
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        icon={<Trash2 size={20} />}
      />
    </div>

  );

}