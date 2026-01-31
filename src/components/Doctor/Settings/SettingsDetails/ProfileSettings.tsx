const ProfileSettings = () => {
  return (
    <div className="m-4 lg:ml-0 p-4 bg-(--color-surface) rounded-2xl">
      <h1 className="text-2xl font-thin text-(--color-text) mb-8">
        Profile Settings
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName" className="text-lg text-(--color-text)">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full bg-(--color-border) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 text-(--color-text-light)"
            placeholder="John Doe"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-lg text-(--color-text)">
            Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="doe@gmail.com"
            className="w-full bg-(--color-border) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 text-(--color-text-light)"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-lg text-(--color-text)">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            placeholder="+1 2323232"
            className="w-full bg-(--color-border) px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 text-(--color-text-light)"
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
