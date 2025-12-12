import InputField from "@/components/input-field/InputField"
import { doctorVerificationFields, doctorVerificationFieldsRowOne } from "@/constants/registerConstant"
import { useRef } from "react"
import { FiFileText } from "react-icons/fi"
import { LuUpload } from "react-icons/lu"


function VerifyDoctorPage() {
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    function handleChooseFile() {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }
    return (
        <div className="py-16 px-8 flex items-center justify-center">
            <div className="flex flex-col gap-8 items-center bg-(--color-surface) w-[650px] p-8 rounded-xl shadow-2xl">
                <div className="w-16 h-16 bg-green-300/50 flex items-center justify-center rounded-full">
                    <FiFileText className="text-4xl text-green-500" />
                </div>
                <div className="flex flex-col  items-center">
                    <h1 className="text-(--color-text) text-3xl">Doctor Verification</h1>
                    <p className="text-(--color-text-light)">Complete your professional verification to access the platform</p>
                </div>
                <form action="" className="flex flex-col gap-4 w-full">
                    <div className="flex max-sm:flex-col gap-2">
                        {
                            doctorVerificationFieldsRowOne.map((field, idx) => {
                                return (
                                    <InputField key={idx} id={field.id} label={field.label} type={field.type} placeholder={field.placeholder} name={field.name} handleChange={() => { }} />
                                )
                            })
                        }

                    </div>
                    <div className="flex max-sm:flex-col gap-2">
                        <div className="flex flex-col items-start w-full gap-1">
                            <label htmlFor="specialization" className="text-(--color-text)">Specialization</label>
                            <select name="specialization" id="specialization" className="border-2 py-3 px-4 w-full rounded-md bg-(--color-bg) focus:ring-2 focus:border-0"  >
                                <option value="doctor">doctor</option>
                                <option value="doctor">doctor</option>
                                <option value="doctor">doctor</option>
                                <option value="doctor">doctor</option>
                            </select>
                        </div>
                        <InputField id={'yearsOfExperience'} label={'Years of Experience'} type={'number'} placeholder={'5'} name={'yearsOfExperience'} handleChange={() => { }} />
                    </div>
                    {
                        doctorVerificationFields.map((field, idx) => {
                            return (
                                <InputField key={idx} id={field.id} label={field.label} type={field.type} placeholder={field.placeholder} name={field.name} handleChange={() => { }} />

                            )
                        })
                    }

                    <div className=" flex flex-col items-start gap-1 ">
                        <label htmlFor="medicalcertificate">Upload Medical Certificate</label>
                        <div className="flex flex-col items-center justify-center gap-4 w-full p-8 border-dashed border-2 rounded-sm">

                            <LuUpload className="text-5xl text-(--color-text-light)" />
                            <div className="text-center">
                                <h3 className="text-xl">Click to upload or drag and drop</h3>
                                <p className="text-(--color-text-light)">PDF, JPG or PNG (MAX. 10MB)</p>
                            </div>
                            <button type="button" onClick={handleChooseFile} className="text-white bg-(--color-primary) hover:bg-(--color-primary-dark) py-2 px-4 rounded-sm transition duration-200 cursor-pointer">Choose File</button>
                            <input ref={inputFileRef} type="file" className="hidden" />
                        </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            <strong>Note:</strong> All information will be verified by our admin team. Please ensure all details are accurate and documents are clear and valid.
                        </p>
                    </div>
                    <div className="w-full">
                        <button className=" text-white bg-(--color-primary) w-full p-4 rounded-sm hover:bg-(--color-primary-dark) cursor-pointer transition duration-200">Submit for Verification</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default VerifyDoctorPage