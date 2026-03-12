import { useEffect, useState } from "react";
import StudentVerificationForm from "./StudentVerification";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import API_URL from "../api";

export default function Settings() {

  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

          <div className="bg-[#F6F1EB] rounded-3xl border border-gray-200 overflow-hidden flex">


            {/* LEFT CARD */}

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


              {/* Upload */}

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

                <CheckCircle
                  size={18}
                  className="text-green-500"
                />

              </div>

              <p className="text-gray-500 text-sm text-center">
                {currentStudent.email}
              </p>

            </div>



            {/* RIGHT INFO */}

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

        )}

      </div>

    </div>

  );
}