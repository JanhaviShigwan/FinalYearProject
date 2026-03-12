import { useState } from "react";
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
        `${API_URL}/api/student/complete-profile/${student._id}`,
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

      onSuccess(updatedStudent);

    } catch (error) {
      console.error(error);

      setPopup({
        title: "Profile Update Failed",
        message: "Something went wrong while updating profile",
      });
    }
  };

  const inputStyle =
    "w-full bg-[#F6F1EB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#9B96E5]";

  return (

    <form onSubmit={handleSubmit} className="space-y-10">

      <h2 className="text-xl font-semibold text-[#3F3D56]">
        Student Verification
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <input
          name="studentIdNumber"
          placeholder="Student ID"
          required
          onChange={handleChange}
          className={inputStyle}
        />

        <input
          name="department"
          placeholder="Department"
          required
          onChange={handleChange}
          className={inputStyle}
        />

        <input
          name="college"
          placeholder="College"
          required
          onChange={handleChange}
          className={inputStyle}
        />

        <input
          name="course"
          placeholder="Course"
          required
          onChange={handleChange}
          className={inputStyle}
        />

        <input
          name="year"
          placeholder="Year"
          required
          onChange={handleChange}
          className={inputStyle}
        />

        <input
          name="phone"
          placeholder="Phone"
          required
          onChange={handleChange}
          className={inputStyle}
        />

      </div>

      <button
        type="submit"
        className="bg-[#9B96E5] text-white px-6 py-3 rounded-xl"
      >
        Save Profile
      </button>

      {popup && (
        <PopupCard
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}

    </form>
  );
}