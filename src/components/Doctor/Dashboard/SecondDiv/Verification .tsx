import { MdOutlineVerified } from "react-icons/md";

const Verification = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 flex flex-col gap-4">
      <h1 className="text-2xl text-gray-700 mb-2">Verification Status</h1>
      <div className="flex justify-between items-center">
        <p className="text-sm">Medical License</p>
        <div className="flex gap-1 items-center">
          <MdOutlineVerified className="fill-green-600" />
          <span className="text-green-700">Verified</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm">Background Check</p>
        <div className="flex gap-1 items-center">
          <MdOutlineVerified className="fill-green-600" />
          <span className="text-green-700">Verified</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm">Credentials</p>
        <div className="flex gap-1 items-center">
          <MdOutlineVerified className="fill-green-600" />
          <span className="text-green-700">Verified</span>
        </div>
      </div>
    </div>
  );
};

export default Verification;
