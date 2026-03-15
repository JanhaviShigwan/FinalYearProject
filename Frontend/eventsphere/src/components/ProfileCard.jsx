import { CheckCircle2, User } from "lucide-react";

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

        <div className="overflow-hidden rounded-[28px] border border-soft-blush bg-white shadow-sm">

            <div className="h-2 bg-gradient-to-r from-lavender via-soft-blush to-coral" />

            <div className="grid grid-cols-1 gap-6 p-6 md:p-8 lg:grid-cols-[300px_minmax(0,1fr)]">

                {/* LEFT CARD */}

                <div className="rounded-2xl border border-soft-blush bg-warm-cream p-6 text-center">

                    {hasImage ? (

                        <img
                            src={currentStudent.profileImage}
                            alt="profile"
                            className="mx-auto h-28 w-28 rounded-full border-4 border-white object-cover shadow-sm"
                        />

                    ) : (

                        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm">

                            <User size={42} className="text-deep-slate/35" />

                        </div>

                    )}


                    <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full border border-lavender/30 bg-white px-4 py-2 text-sm font-bold text-lavender transition-colors hover:bg-lavender hover:text-white">

                        {uploading ? "Uploading..." : "Upload Photo"}

                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            hidden
                            onChange={uploadImage}
                        />

                    </label>


                    <div className="mt-5 flex items-center justify-center gap-2">

                        <h2 className="text-xl font-extrabold text-deep-slate">
                            {currentStudent?.name || "Student"}
                        </h2>

                        <CheckCircle2
                            size={18}
                            className="text-lavender"
                        />

                    </div>


                    <p className="mt-1 text-sm text-deep-slate/55">
                        {currentStudent?.email || "No email"}
                    </p>

                    <p className="mt-2 inline-flex rounded-full bg-lavender/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.11em] text-lavender">
                        {currentStudent?.role || "Student"}
                    </p>

                </div>


                {/* RIGHT SIDE */}

                <div className="flex-1">

                    <h2 className="text-2xl font-extrabold text-deep-slate">
                        Student Information
                    </h2>

                    <p className="mt-1 text-sm text-deep-slate/55">
                        Keep your academic and contact details up to date for smoother event registrations.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {[
                            ["Department", currentStudent?.department],
                            ["College", currentStudent?.college],
                            ["Course", currentStudent?.course],
                            ["Year", currentStudent?.year],
                            ["Phone", currentStudent?.phone],
                            ["Gender", currentStudent?.gender],
                            ["DOB", formatDate(currentStudent?.dob)],
                            ["Division", currentStudent?.division],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-soft-blush bg-warm-cream/60 px-4 py-3"
                            >
                                <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-deep-slate/45">
                                    {label}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-deep-slate">
                                    {value || "-"}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>

    );
}