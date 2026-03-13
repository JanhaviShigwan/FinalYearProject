import { useEffect, useState } from "react";
import StudentVerificationForm from "./StudentVerification";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import API_URL from "../api";

export default function Settings() {

  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updatingNotif, setUpdatingNotif] = useState(false);

  /* ================= PASSWORD STATES ================= */

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const studentLocal = JSON.parse(
    localStorage.getItem("eventSphereStudent")
  );


  /* ================= FETCH ================= */

  useEffect(() => {

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

  }, []);



  /* ================= PASSWORD STRENGTH ================= */

  const getStrength = (password) => {

    if (password.length < 8) return "Weak";

    if (password.match(/[A-Z]/) && password.match(/[0-9]/))
      return "Strong";

    return "Medium";

  };


  /* ================= CHANGE PASSWORD ================= */

  const changePassword = async () => {

    if (newPassword.length < 8) {

      setPasswordError(true);
      setPasswordMsg("Password must be at least 8 characters");

      return;
    }

    if (newPassword !== confirmPassword) {

      setPasswordError(true);
      setPasswordMsg("Passwords do not match");

      return;
    }

    try {

      const res = await axios.put(
        `${API_URL}/api/student/change-password/${studentLocal._id}`,
        {
          currentPassword,
          newPassword
        }
      );

      setPasswordError(false);
      setPasswordMsg(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {

      setPasswordError(true);

      setPasswordMsg(
        err.response?.data?.message || "Error changing password"
      );

    }

  };


  /* ================= DELETE ACCOUNT ================= */

  const deleteAccount = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/api/student/delete/${studentLocal._id}`
      );

      alert("Account deleted");

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

  const uploadImage = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {

      setUploading(true);

      const res = await axios.post(
        `${API_URL}/api/student/upload-image/${studentLocal._id}`,
        formData
      );

      setCurrentStudent(res.data);

    } catch (err) {
      console.log(err);
    }

    setUploading(false);

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



        {/* NOT VERIFIED */}

        {!isVerified && (

          <StudentVerificationForm
            student={currentStudent}
            onSuccess={(updated) => setCurrentStudent(updated)}
          />

        )}



        {/* VERIFIED */}

        {isVerified && (

          <div className="space-y-6">

            {/* PROFILE CARD */}

            <div className="bg-[#F6F1EB] rounded-3xl border border-gray-200 overflow-hidden flex">

              <div className="w-64 bg-white m-6 rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">

                <img
                  src={
                    currentStudent.profileImage
                      ? API_URL + currentStudent.profileImage
                      : "https://i.pravatar.cc/150"
                  }
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />

                <label className="mt-3 text-sm text-[#9B96E5] cursor-pointer">

                  {uploading ? "Uploading..." : "Upload Photo"}

                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    hidden
                    onChange={uploadImage}
                  />

                </label>

                <div className="flex items-center gap-2 mt-4">

                  <h2 className="text-lg font-semibold text-[#3F3D56]">
                    {currentStudent.name}
                  </h2>

                  <CheckCircle size={18} className="text-green-500" />

                </div>

                <p className="text-gray-500 text-sm text-center">
                  {currentStudent.email}
                </p>

              </div>



              {/* RIGHT */}

              <div className="flex-1 p-8">

                <h2 className="text-2xl font-semibold mb-6">
                  Student Information
                </h2>

                <div className="grid grid-cols-2 gap-6">

                  <div>Department: {currentStudent.department}</div>
                  <div>College: {currentStudent.college}</div>
                  <div>Course: {currentStudent.course}</div>
                  <div>Year: {currentStudent.year}</div>
                  <div>Phone: {currentStudent.phone}</div>
                  <div>Gender: {currentStudent.gender}</div>
                  <div>DOB: {currentStudent.dob}</div>
                  <div>Division: {currentStudent.division}</div>

                </div>

              </div>

            </div>



            {/* ================= PREFERENCES ================= */}

            <div className="bg-[#F6F1EB] border border-gray-200 rounded-3xl p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-[#3F3D56] mb-5">
                Preferences
              </h2>

              <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-200 shadow-sm">

                <div>

                  <p className="font-semibold text-[#3F3D56]">
                    Email Notifications
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive email when you register for events
                  </p>

                </div>

                <button
                  onClick={toggleNotifications}
                  disabled={updatingNotif}
                  className={`relative w-16 h-8 flex items-center rounded-full transition duration-300 ${currentStudent.notificationsEnabled
                      ? "bg-[#9B96E5]"
                      : "bg-gray-300"
                    }`}
                >

                  <span
                    className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${currentStudent.notificationsEnabled
                        ? "translate-x-8"
                        : ""
                      }`}
                  />

                </button>

              </div>

              <p className="mt-3 text-sm text-gray-500">

                {currentStudent.notificationsEnabled
                  ? "You will receive event registration emails."
                  : "Event emails are disabled."}

              </p>

            </div>



            {/* ================= SECURITY ================= */}

            <div className="bg-[#F6F1EB] border border-gray-200 rounded-3xl p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-[#3F3D56] mb-5">
                Security
              </h2>

              <div className="space-y-4">

                {/* Current Password */}

                <div>

                  <label className="text-sm font-medium">
                    Current Password
                  </label>

                  <div className="flex items-center border rounded-xl px-3 py-2 bg-white">

                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="flex-1 outline-none"
                    />

                    <button
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>

                  </div>

                </div>



                {/* New Password */}

                <div>

                  <label className="text-sm font-medium">
                    New Password
                  </label>

                  <div className="flex items-center border rounded-xl px-3 py-2 bg-white">

                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="flex-1 outline-none"
                    />

                    <button
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>

                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Strength: {getStrength(newPassword)}
                  </p>

                </div>



                {/* Confirm Password */}

                <div>

                  <label className="text-sm font-medium">
                    Confirm Password
                  </label>

                  <div className="flex items-center border rounded-xl px-3 py-2 bg-white">

                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex-1 outline-none"
                    />

                    <button
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>

                  </div>

                </div>


                {/* MESSAGE */}

                {passwordMsg && (
                  <p
                    className={`text-sm ${passwordError
                        ? "text-red-500"
                        : "text-green-600"
                      }`}
                  >
                    {passwordMsg}
                  </p>
                )}


                <button
                  onClick={changePassword}
                  className="bg-[#9B96E5] text-white px-6 py-2 rounded-xl hover:opacity-90"
                >
                  Change Password
                </button>

              </div>

            </div>



            {/* ================= ACCOUNT ================= */}

            <div className="bg-[#F6F1EB] border border-gray-200 rounded-3xl p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-[#3F3D56] mb-5">
                Account
              </h2>


              {/* DELETE ACCOUNT */}

              <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-200 shadow-sm mb-4">

                <div>
                  <p className="font-semibold text-[#3F3D56]">
                    Delete Account
                  </p>

                  <p className="text-sm text-gray-500">
                    Permanently remove your account
                  </p>
                </div>

                <button
                  onClick={deleteAccount}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600"
                >
                  Delete
                </button>

              </div>


              {/* LOGIN ACTIVITY */}

              <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-200 shadow-sm">

                <div>
                  <p className="font-semibold text-[#3F3D56]">
                    Login Activity
                  </p>

                  <p className="text-sm text-gray-500">
                    View recent login history
                  </p>
                </div>

                <button
                  onClick={viewLoginActivity}
                  className="bg-[#9B96E5] text-white px-5 py-2 rounded-xl"
                >
                  View
                </button>

              </div>

            </div>



          </div>

        )}

      </div>

    </div>

  );

}