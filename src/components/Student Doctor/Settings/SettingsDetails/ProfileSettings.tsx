const ProfileSettings = () => {
  return (
    <div className="m-4 lg:ml-0 p-4 bg-gray-100 rounded-2xl">
      <h1 className="text-2xl font-thin text-gray-800 mb-8">
        Profile Settings
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName" className="text-lg">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-lg">
            Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="doe@gmail.com"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-lg">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            placeholder="+1 2323232"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button className="mt-6 mb-4 bg-blue-500 font-semibold text-white w-fit m-auto py-2 px-4 rounded-md hover:bg-blue-500/90 cursor-pointer">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
