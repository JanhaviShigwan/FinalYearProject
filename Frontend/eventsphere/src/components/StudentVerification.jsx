import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import PopupCard from "../components/PopUpCard";

import {
  Save,
  Phone,
  School,
  CalendarDays,
  GraduationCap,
  Building2
} from "lucide-react";

export default function StudentVerificationForm({ student, onSuccess }) {

  const draftKey = useMemo(
    () => `studentProfileDraft_${student?._id || "unknown"}`,
    [student?._id]
  );

  const collegeOptions = [
    "K J Somaiya College of Engineering",
    "K J Somaiya Institute of Technology",
    "K J Somaiya School of Engineering",
    "K J Somaiya Institute of Management",
    "K J Somaiya School of Business",
    "K J Somaiya School of Banking and Finance",
    "K J Somaiya College of Arts and Commerce",
    "K J Somaiya College of Science and Commerce",
    "K J Somaiya School of Design",
    "K J Somaiya School of Humanities and Social Sciences",
    "K J Somaiya School of Dharma Studies",
    "K J Somaiya Medical College",
    "K J Somaiya College of Physiotherapy",
    "K J Somaiya School of Nursing",
    "K J Somaiya College of Education",
    "K J Somaiya Polytechnic",
    "K J Somaiya School of Basic and Applied Sciences",
    "S K Somaiya College of Arts Science and Commerce",
    "S K Somaiya College",
    "S K Somaiya College of Education",
    "S K Somaiya Vinay Mandir",
    "S K Somaiya Shishu Niketan",
  ];

  const [popup, setPopup] = useState(null);

  const [formData, setFormData] = useState({
    studentIdNumber: "",
    phone: "",
    department: "",
    college: "",
    year: "",
    course: "",
    division: "",
    gender: "",
    dob: "",
  });

  const courseMap = {
    "IT & CS": ["BSc IT", "BSc CS", "BCA"],
    "Commerce": ["BCom", "BBA", "BAF"],
    "Finance": ["BAF", "BMS"],
    "Humanity": ["BA", "Psychology"],
    "Science": ["BSc Physics", "BSc Chemistry", "BSc Maths"]
  };

  useEffect(() => {
    const formatDob = (value) => {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    };

    if (!student?._id) {
      return;
    }

    const draftRaw = localStorage.getItem(draftKey);

    if (draftRaw) {
      try {
        const parsed = JSON.parse(draftRaw);
        setFormData((prev) => ({ ...prev, ...parsed }));
        return;
      } catch (error) {
        localStorage.removeItem(draftKey);
      }
    }

    setFormData((prev) => ({
      ...prev,
      studentIdNumber: student.studentId || "",
      phone: student.phone || "",
      department: student.department || "",
      college: student.college || "",
      year: student.year || "",
      course: student.course || "",
      division: student.division || "",
      gender: student.gender || "",
      dob: formatDob(student.dob),
    }));
  }, [draftKey, student]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    let nextState;

    if (name === "department") {

      nextState = {
        ...formData,
        department: value,
        course: ""
      };

    } else {

      nextState = {
        ...formData,
        [name]: value,
      };

    }

    setFormData(nextState);

    localStorage.setItem(
      draftKey,
      JSON.stringify(nextState)
    );

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!/^\d{10}$/.test(formData.studentIdNumber)) {

      setPopup({
        title: "Invalid Student ID",
        message: "Student ID must be exactly 10 digits",
      });

      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {

      setPopup({
        title: "Invalid Phone",
        message: "Phone must be exactly 10 digits",
      });

      return;
    }

    if (!formData.college) {

      setPopup({
        title: "College Required",
        message: "Please select your college",
      });

      return;
    }

    try {

      await axios.put(
        `${API_URL}/student/complete-profile/${student._id}`,
        formData
      );

      const updatedStudent = {
        ...student,
        profileComplete: true,
        profileStatus: "pending",
      };

      localStorage.setItem(
        "eventSphereStudent",
        JSON.stringify(updatedStudent)
      );

      localStorage.removeItem(draftKey);

      onSuccess(updatedStudent);

    } catch (error) {

      setPopup({
        title: "Profile Update Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong",
      });

    }

  };


  const inputStyle =
    "w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-3 outline-none focus:border-[#9B96E5]";


  return (

    <div className="bg-[#F6F1EB] border border-gray-200 rounded-3xl p-8 shadow-sm">

      <form onSubmit={handleSubmit} className="space-y-8">

        <h2 className="text-2xl font-semibold text-[#3F3D56]">
          Student Verification
        </h2>


        <div className="grid grid-cols-2 gap-6">


          {/* Student ID */}

          <div>

            <label className="text-sm mb-1 block text-gray-600">
              Student ID
            </label>

            <div className="relative">

              <School size={18} className="absolute left-3 top-3 text-gray-400" />

              <input
                name="studentIdNumber"
                value={formData.studentIdNumber}
                maxLength="10"
                inputMode="numeric"
                onChange={handleChange}
                className={inputStyle}
                required
              />

            </div>

          </div>


          {/* Department */}

          <div>

            <label className="text-sm mb-1 block text-gray-600">
              Department
            </label>

            <div className="relative">

              <Building2 size={18} className="absolute left-3 top-3 text-gray-400" />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={inputStyle}
                required
              >
                <option value="">Select Department</option>
                <option>IT & CS</option>
                <option>Commerce</option>
                <option>Finance</option>
                <option>Humanity</option>
                <option>Science</option>
              </select>

            </div>

          </div>


          {/* College */}

          <div>

            <label className="text-sm mb-1 block text-gray-600">
              College
            </label>

            <div className="relative">

              <Building2 size={18} className="absolute left-3 top-3 text-gray-400" />

              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className={inputStyle}
                required
              >
                <option value="">Select College</option>
                {collegeOptions.map((collegeName) => (
                  <option key={collegeName} value={collegeName}>
                    {collegeName}
                  </option>
                ))}
              </select>

            </div>

          </div>


          {/* Course */}

          <div>

            <label className="text-sm mb-1 block text-gray-600">
              Course
            </label>

            <div className="relative">

              <GraduationCap
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={inputStyle}
                required
              >

                <option value="">Select Course</option>

                {courseMap[formData.department]?.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* Year */}

          <div>

            <label className="text-sm mb-1 block text-gray-600">
              Year
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={inputStyle}
                required
              >
                <option value="">Select Year</option>
                <option>FY</option>
                <option>SY</option>
                <option>TY</option>
                <option>Final Year</option>
              </select>

            </div>

          </div>


          {/* Phone */}

          <div>

            <label className="text-sm mb-1 block text-gray-600">
              Phone
            </label>

            <div className="relative">

              <Phone
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                name="phone"
                value={formData.phone}
                maxLength="10"
                inputMode="numeric"
                onChange={handleChange}
                className={inputStyle}
                required
              />

            </div>

          </div>


          {/* Division */}

          <div>
            <label className="text-sm mb-1 block text-gray-600">
              Division
            </label>

            <input
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 outline-none focus:border-[#9B96E5]"
            />
          </div>


          {/* Gender */}

          <div>
            <label className="text-sm mb-1 block text-gray-600">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 outline-none focus:border-[#9B96E5]"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>


          {/* DOB */}

          <div className="col-span-2">

            <label className="text-sm mb-1 block text-gray-600">
              Date of Birth
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputStyle}
              />

            </div>

          </div>

        </div>


        <div className="flex justify-end pt-4 border-t">

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#9B96E5] text-white px-7 py-3 rounded-xl hover:opacity-90"
          >
            <Save size={18} />
            Save Profile
          </button>

        </div>


        {popup && (
          <PopupCard
            title={popup.title}
            message={popup.message}
            onClose={() => setPopup(null)}
          />
        )}

      </form>

    </div>

  );

}