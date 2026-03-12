import { useEffect, useState } from "react";
import StudentVerificationForm from "./StudentVerification";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import API_URL from "../api";

export default function Settings() {

  const [currentStudent, setCurrentStudent] = useState(null);

  const studentLocal = JSON.parse(
    localStorage.getItem("eventSphereStudent")
  );

  // ✅ FETCH FROM DB
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

    };

    fetchStudent();

  }, []);


  if (!currentStudent) return null;

  const isVerified = currentStudent?.profileComplete;


  return (

    <div className="min-h-screen bg-[#F6F1EB] flex justify-center px-6 py-12">

      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-100 shadow-sm p-10">

        <h1 className="text-3xl font-semibold text-[#3F3D56] mb-6">
          Settings
        </h1>


        {/* ========================= */}
        {/* NOT VERIFIED */}
        {/* ========================= */}

        {!isVerified && (

          <StudentVerificationForm
            student={currentStudent}
            onSuccess={(updated) => setCurrentStudent(updated)}
          />

        )}


        {/* ========================= */}
        {/* VERIFIED */}
        {/* ========================= */}

        {isVerified && (

          <div className="bg-[#F6F1EB] rounded-3xl border border-gray-200 overflow-hidden flex">


            {/* LEFT CARD */}

            <div className="w-64 bg-white m-6 rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">

              <img
                src="https://i.pravatar.cc/150"
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border"
              />

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



            {/* RIGHT INFO */}

            <div className="flex-1 p-8">

              <h2 className="text-2xl font-semibold text-[#3F3D56] mb-6">
                Student Information
              </h2>

              <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">

                <div>
                  <b>Department:</b> {currentStudent.department}
                </div>

                <div>
                  <b>College:</b> {currentStudent.college}
                </div>

                <div>
                  <b>Course:</b> {currentStudent.course}
                </div>

                <div>
                  <b>Year:</b> {currentStudent.year}
                </div>

                <div>
                  <b>Phone:</b> {currentStudent.phone}
                </div>

                <div>
                  <b>Gender:</b> {currentStudent.gender}
                </div>

                <div>
                  <b>DOB:</b> {currentStudent.dob}
                </div>

                <div>
                  <b>Division:</b> {currentStudent.division}
                </div>

              </div>

            </div>


          </div>

        )}

      </div>

    </div>

  );
}