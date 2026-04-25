import CardComp from "@/components/card-comp/CardComp";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { Brain, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { Link } from "react-router";


function AIModelsPage() {

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Active':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Training':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Deprecated':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'Training':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            case 'Deprecated':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default:
                return '';
        }
    };

    return (
        <DashboardLayout pageTitle="AI Models History">
            <div className="mb-6">
                <h2 className="text-2xl   mb-2">AI Model History</h2>
                <p className="text-(--color-text-light)">Manage and monitor AI models used for medical scan analysis</p>
            </div>

            <div>
                <CardComp>
                    <div className="flex items-start justify-between mb-4 w-full border-b pb-8 border-(--color-border)">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg  mb-1">{'model name'}</h3>
                                <p className="text-sm text-(--color-text-light)">{'model type'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon('active')}
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('active')}`}>
                                {'model status'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4   w-full ">
                        <div>
                            <p className="text-sm text-(--color-text-light) mb-1">Accuracy</p>
                            <p >{'94.5%'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-(--color-text-light) mb-1">Total Predictions</p>
                            <p >{'1,234'.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-(--color-text-light) mb-1 flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Last Updated</span>
                            </p>
                            <p w-full>{'2024-01-15'}</p>
                        </div>
                    </div>

                    <div className="flex space-x-3 mt-6 w-full">
                        <Link
                            to={`/ai-models/1`}
                            className="px-4 py-2 bg-(--color-primary) text-white rounded-lg transition-colors text-sm"
                        >
                            View Details
                        </Link>
                        <Link
                            to={`/ai-models/1`}
                            className="px-4 py-2 border border-(--color-border) text-(--color-text-light) rounded-lg hover:bg-(--color-bg-link-hover)  transition-colors text-sm"
                        >
                            Performance Metrics
                        </Link>
                    </div>
                </CardComp>
            </div>
        </DashboardLayout>
    )
}

export default AIModelsPage