const PatientRegistration = () => {
  return (
    <div className="registrationContainer">
      <div id="name">
        <div>
          <label htmlFor="fname">First Name</label>
          <input type="text" placeholder="John" id="fname" />
        </div>
        <div>
          <label htmlFor="lname">Last Name</label>
          <input type="text" id="lname" placeholder="John" />
        </div>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" placeholder="John.doe@example.com" id="email" />
      </div>
      <div>
        <label htmlFor="phone">Phone Number</label>
        <input type="text" placeholder="+1 (555) 000-000" id="phone" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="password" />
      </div>
      <div>
        <label htmlFor="cPassword">Confirm Password</label>
        <input type="password" id="cPassword" placeholder="confirm password" />
      </div>
      <div className="!mt-10 max-sm:w-11/12 w-1/3 m-auto">
        <button className="self-center text-white bg-linear-90  to-[#00AFE5] from-[#00E0A5] w-full rounded-3xl m-auto py-2 px-6 font-bold cursor-pointer hover:bg-blue-500 ">
          Register
        </button>
      </div>
    </div>
  );
};

export default PatientRegistration;
