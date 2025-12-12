const LandingScape = () => {
  const registered: boolean = true;
  return (
    <div className="mb-4">
      <div className="landingScape w-full h-[90vh] bg-cover p-4 flex items-center rounded-xl max-sm:flex-col">
        <div className="flex-1"></div>
        <div className="flex-1">
          <h1 className="text-3xl max-sm:text-2xl max-sm:mb-12 font-semibold text-green-200 leading-8 tracking-tighter mb-16">
            Modern Healthcare Management Platform
          </h1>
          <p className="text-lg text-blue-50 leading-6 tracking-tight mb-12">
            Assnani connects patients, doctors, and healthcare professionals in
            one secure platform. Streamline appointments, manage medical
            records, and provide better patient care.
          </p>
          <div className="flex gap-6">
            {!registered && (
              <button className="bg-blue-500 px-4 py-2 rounded-full text-white font-semibold">
                Register/Login
              </button>
            )}
            <button className="bg-green-400 rounded-full py-2 px-4 text-white font-semibold">
              Browse Doctors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScape;
