import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useRef } from "react";
import { LuUpload } from "react-icons/lu";

const Scan = () => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  function handleChooseFile() {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }
  return (
    <DashboardLayout pageTitle={"Doctor Medical Scan"}>
      <div className="xl:-ml-6 -mt-6 bg-(--color-bg) rounded-2xl -mr-7 p-4">
        <h1 className="text-2xl font-semibold text-(--color-text) mb-8 mt-2">
          Upload Medical Scan
        </h1>
        <form className="w-2/3 m-auto flex flex-col justify-center items-center bg-(--color-surface) rounded-2xl p-6 max-md:w-11/12">
          <div className="w-full flex flex-col items-center gap-2 mb-4 mt-2 ">
            <p className="text-base font-semibold text-(--color-text)">
              Scan Type
            </p>
            <select
              name="type"
              id="type"
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-(--color-border) px-4 py-2 pr-8 leading-tight text-(--color-text) shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-center"
            >
              <option value="x-ray">X-Ray</option>
              <option value="ct-scan">CT-Scan</option>
            </select>
          </div>
          <div className=" flex flex-col items-center  gap-4 mt-4 ">
            <label htmlFor="medicalcertificate" className="text-(--color-text)">
              Upload The Scan
            </label>
            <div className="flex flex-col items-center justify-center gap-4 w-full p-8 border-dashed border-2 rounded-sm bg-(--color-border) border-gray-300">
              <LuUpload className="text-5xl text-(--color-text-light)" />
              <div className="text-center">
                <h3 className="text-xl text-(--color-text)">
                  Click to upload or drag and drop
                </h3>
                <p className="text-(--color-text-light)">
                  PDF, JPG or PNG (MAX. 10MB)
                </p>
              </div>
              <button
                type="button"
                onClick={handleChooseFile}
                className="text-white bg-(--color-primary) hover:bg-(--color-primary-dark) py-2 px-4 rounded-sm transition duration-200 cursor-pointer"
              >
                Choose File
              </button>
              <input ref={inputFileRef} type="file" className="hidden" />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 p-4 mt-6 text-(--color-text)">
            <p>Additional Notes</p>
            <textarea
              name="notes"
              id="notes"
              cols={40}
              className="w-full p-4 border border-gray-300 bg-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write any additional notes"
            ></textarea>
          </div>
          <button className="text-white font-semibold bg-blue-500 px-4 py-2 mb-6 rounded-lg mt-4">
            Upload And Analyze
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Scan;
