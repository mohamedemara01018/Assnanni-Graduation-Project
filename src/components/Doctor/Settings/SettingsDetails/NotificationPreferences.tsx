const NotificationPreferences = () => {
  return (
    <div className="m-4 lg:ml-0 p-4 bg-(--color-surface) rounded-2xl">
      <h1 className="text-2xl font-thin text-(--color-text) mb-8">
        Notification Preferences
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex justify-between p-4  bg-(--color-border) rounded-lg items-center">
          <label htmlFor="reminderCheckbox" className="text-(--color-text)">
            Appointment Reminder
          </label>
          <input
            type="checkbox"
            id="reminderCheckbox"
            className="h-4 w-4 accent-amber-600"
          />
        </div>
        <div className="flex justify-between p-4  bg-(--color-border) rounded-lg items-center">
          <label htmlFor="emailCheckbox" className="text-(--color-text)">
            Email Notifications
          </label>
          <input
            type="checkbox"
            id="emailCheckbox"
            className="h-4 w-4 accent-amber-600"
          />
        </div>
        <div className="flex justify-between p-4  bg-(--color-border) rounded-lg items-center">
          <label htmlFor="smsCheckbox" className="text-(--color-text)">
            SMS Notifications
          </label>
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
