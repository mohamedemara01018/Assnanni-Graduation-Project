import CardComp from "@/components/card-comp/CardComp";
import { Calendar, ChevronLeft, ChevronRight, FileText, LayoutDashboard } from "lucide-react";
import { Activity, useState } from "react";
import { useNavigate } from "react-router";


function OnboardingPage() {

    const [step, setStep] = useState<number>(0);
    const navigator = useNavigate();


    const steps = [
        {
            icon: LayoutDashboard,
            title: 'Welcome to Assnani',
            description: 'Your comprehensive healthcare management platform. Let\'s get you started with a quick tour.',
            color: 'blue'
        },
        {
            icon: Calendar,
            title: 'Book Appointments',
            description: 'Search for doctors, view their availability, and book appointments instantly with just a few clicks.',
            color: 'green'
        },
        {
            icon: FileText,
            title: 'Medical Records',
            description: 'Access all your medical history, prescriptions, and lab results in one secure place.',
            color: 'purple'
        },
        {
            icon: Activity,
            title: 'AI-Powered Scans',
            description: 'Upload medical scans for AI-assisted analysis and get quick preliminary results.',
            color: 'orange'
        }
    ];

    const currentStep = steps[step];
    const Icon = currentStep.icon;

    function handleNext() {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            navigator('/')
        }
    }

    function handleSkip() {
        navigator('/')
    }

    return (
        <div className=" flex items-center justify-center  p-15 ">
            <div className="w-2xl">
                <CardComp classProbs="rounded-xl py-10" >
                    <div className={`w-24 h-24 bg-${currentStep.color}-100 dark:bg-${currentStep.color}-900/30 rounded-full flex items-center justify-center mx-auto`}>
                        <Icon className={`w-12 h-12 text-${currentStep.color}-600 dark:text-${currentStep.color}-400`} children={undefined} />
                    </div>
                    <h2 className="text-3xl   text-center w-full">{currentStep.title}</h2>
                    <p className="text-lg text-(--color-text-light) text-center w-full">{currentStep.description}</p>
                    <div className="flex gap-2 justify-center w-full">
                        {
                            steps.map((_, index) => {
                                return <div
                                    className={` h-2 rounded-full transition-all ${step == index ? 'w-8  bg-(--color-primary)' :
                                        (step > index) ? 'w-2 bg-blue-400' : 'w-2 bg-gray-400'
                                        }`}
                                />
                            })
                        }
                    </div>

                    <div className="flex justify-center space-x-4 w-full">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <span>{step < steps.length - 1 ? 'Next' : 'Get Started'}</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={handleSkip}
                        className="mt-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm text-center w-full"
                    >
                        Skip tutorial
                    </button>
                </CardComp>
            </div>
        </div>
    )
}

export default OnboardingPage