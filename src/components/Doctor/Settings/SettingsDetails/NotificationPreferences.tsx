const NotificationPreferences = () => {
  return (
    <div className="m-4 lg:ml-0 p-4 bg-gray-100 rounded-2xl">
      <h1 className="text-2xl font-thin text-gray-800 mb-8">
        Notification Preferences
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex justify-between p-4  bg-gray-300 rounded-lg items-center">
          <label htmlFor="reminderCheckbox">Appointment Reminder</label>
          <input
            type="checkbox"
            id="reminderCheckbox"
            className="h-4 w-4 accent-amber-600"
          />
        </div>
        <div className="flex justify-between p-4  bg-gray-300 rounded-lg items-center">
          <label htmlFor="emailCheckbox">Email Notifications</label>
          <input
            type="checkbox"
            id="emailCheckbox"
            className="h-4 w-4 accent-amber-600"
          />
        </div>
        <div className="flex justify-between p-4  bg-gray-300 rounded-lg items-center">
          <label htmlFor="smsCheckbox">SMS Notifications</label>
          <input
            type="checkbox"
            id="smsCheckbox"
            className="h-4 w-4 accent-amber-600"
          />
        </div>
        <button className="text-white font-semibold bg-blue-500 px-4 py-2 rounded-md w-fit m-auto mt-6 mb-4 cursor-pointer hover:bg-blue-500/90">
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default NotificationPreferences;
