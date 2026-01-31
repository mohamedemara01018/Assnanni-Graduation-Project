const SecuritySettings = () => {
  return (
    <div className="m-4 lg:ml-0 p-4 bg-(--color-surface) rounded-2xl">
      <h1 className="text-2xl font-thin text-(--color-text) mb-8">
        Security Settings
      </h1>
      <div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="currPassword"
              className="text-lg text-(--color-text)"
            >
              Current Password
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full bg-(--color-border) text-(--color-text-light) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              placeholder="Current Password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="newPassword"
              className="text-lg text-(--color-text)"
            >
              New Password
            </label>
            <input
              type="text"
              id="newPassword"
              placeholder="New Password"
              className="w-full bg-(--color-border) text-(--color-text-light) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="text-lg text-(--color-text)"
            >
              Confirm New Password
            </label>
            <input
              type="text"
              id="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full bg-(--color-border) text-(--color-text-light) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button className="mt-6 mb-4 bg-blue-500 font-semibold text-white w-fit m-auto py-2 px-4 rounded-md hover:bg-blue-500/90 cursor-pointer">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
