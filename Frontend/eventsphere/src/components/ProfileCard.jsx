import { CheckCircle, User } from "lucide-react";

export default function ProfileCard({
    currentStudent,
    uploadImage,
    uploading
}) {

    const hasImage =
        currentStudent?.profileImage &&
        currentStudent.profileImage.startsWith("data:image");


    // ✅ format date to dd-mm-yyyy
    const formatDate = (date) => {
        if (!date) return "";

        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };


    return (

        <div className="bg-[#F6F1EB] rounded-3xl border border-gray-200 overflow-hidden flex">

            {/* LEFT CARD */}

            <div className="w-64 bg-white m-6 rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">

                {hasImage ? (

                    <img
                        src={currentStudent.profileImage}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border"
                    />

                ) : (

                    <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-gray-100">

                        <User size={40} className="text-gray-400" />

                    </div>

                )}


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


            {/* RIGHT SIDE */}

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

                    {/* ✅ FIXED DOB */}
                    <div>DOB: {formatDate(currentStudent.dob)}</div>

                    <div>Division: {currentStudent.division}</div>

                </div>

            </div>

        </div>

    );
}