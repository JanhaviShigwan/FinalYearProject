export default function AccountSettings({
  deleteAccount,
  viewLoginActivity
}) {
  return (
    <div className="bg-[#F6F1EB] border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold text-[#3F3D56] mb-5">
        Account
      </h2>


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
          className="bg-red-500 text-white px-5 py-2 rounded-xl"
        >
          Delete
        </button>

      </div>


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
  );
}