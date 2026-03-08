import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Save,
  Phone,
  School,
  User,
  CalendarDays,
  GraduationCap,
  Building2
} from "lucide-react";

export default function Settings() {

  const navigate = useNavigate();

  const student = useMemo(() => {
    return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
  }, []);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.put(
        `http://localhost:5000/api/student/complete-profile/${student._id}`,
        formData
      );

      const updatedStudent = {
        ...student,
        profileComplete: true,
      };

      localStorage.setItem(
        "eventSphereStudent",
        JSON.stringify(updatedStudent)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Error updating profile");
    }
  };

  const inputStyle =
    "w-full bg-[#F6F1EB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#9B96E5] transition";

  return (
    <div className="min-h-screen bg-[#F6F1EB] flex justify-center px-6 py-12">

      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-100 shadow-sm p-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-3xl font-semibold text-[#3F3D56]">
            Complete Your Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Fill your details so you can start registering for events.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Academic Info */}

          <div>

            <h2 className="text-lg font-semibold text-[#3F3D56] mb-6">
              Academic Information
            </h2>

            <div className="grid grid-cols-2 gap-6">

              {/* Student ID */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  Student ID (10 digits)
                </label>

                <div className="relative">

                  <GraduationCap
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type="text"
                    name="studentIdNumber"
                    maxLength="10"
                    required
                    value={formData.studentIdNumber}
                    onChange={handleChange}
                    className={`${inputStyle} pl-10`}
                  />

                </div>

              </div>

              {/* Department */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  Department
                </label>

                <div className="relative">

                  <School
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className={`${inputStyle} pl-10`}
                  />

                </div>

              </div>

              {/* College */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  College
                </label>

                <div className="relative">

                  <Building2
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type="text"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleChange}
                    className={`${inputStyle} pl-10`}
                  />

                </div>

              </div>

              {/* Course */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  Course
                </label>

                <input
                  type="text"
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

              {/* Year */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  Year
                </label>

                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select Year</option>
                  <option value="FY">FY</option>
                  <option value="SY">SY</option>
                  <option value="TY">TY</option>
                  <option value="Final Year">Final Year</option>
                </select>

              </div>

              {/* Division */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  Division
                </label>

                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

            </div>

          </div>

          {/* Personal Info */}

          <div>

            <h2 className="text-lg font-semibold text-[#3F3D56] mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-2 gap-6">

              {/* Phone */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type="text"
                    name="phone"
                    maxLength="10"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${inputStyle} pl-10`}
                  />

                </div>

              </div>

              {/* Gender */}

              <div>

                <label className="text-sm text-gray-600 mb-1 block">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

              </div>

              {/* DOB */}

              <div className="col-span-2">

                <label className="text-sm text-gray-600 mb-1 block">
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
                    className={`${inputStyle} pl-10`}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Save Button */}

          <div className="flex justify-end pt-6 border-t">

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#9B96E5] text-white px-7 py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              <Save size={18} />
              Save Profile
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}