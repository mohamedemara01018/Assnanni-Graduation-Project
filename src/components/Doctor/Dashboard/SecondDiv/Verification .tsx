import { MdOutlineVerified } from "react-icons/md";

const Verification = () => {
  return (
    <div className="bg-(--color-surface) rounded-xl p-6 flex flex-col gap-4">
      <h1 className="text-xl font-normal border-b-2 pb-2 border-gray-300 text-(--color-text) mb-2">
        Verification Status
      </h1>
      <div className="flex justify-between items-center">
        <p className="text-sm text-(--color-text)">Medical License</p>
        <div className="flex gap-1 items-center">
          <MdOutlineVerified className="fill-green-600" />
          <span className="text-green-700">Verified</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-(--color-text)">Background Check</p>
        <div className="flex gap-1 items-center">
          <MdOutlineVerified className="fill-green-600" />
          <span className="text-green-700">Verified</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-(--color-text)">Credentials</p>
        <div className="flex gap-1 items-center">
          <MdOutlineVerified className="fill-green-600" />
          <span className="text-green-700">Verified</span>
        </div>
      </div>
    </div>
  );
};

export default Verification;
