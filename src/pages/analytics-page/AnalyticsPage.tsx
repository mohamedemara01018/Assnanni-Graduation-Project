import CardComp from '@/components/card-comp/CardComp';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout'
import Error from '@/components/error/Error';
import MiniLoading from '@/components/mini-loading/MiniLoading';
import StatCard from '@/components/statical-card/StaticalCard'
import { fetchAdminDashboardAnalysis, selectAnalyticsDashboardState, type AnalyticsDashboardState } from '@/store/slices/admin-slice/analtics-dashboard-slice/analticsDashboardSlice';
import { fetchAdminSummary, selectSummary, type SummaryState } from '@/store/slices/admin-slice/summary-slice/SummarySlice';
import type { AppDispatch } from '@/store/store';
import { Calendars, FileText, ShieldCheck, Users } from 'lucide-react'
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ScaleLoader } from 'react-spinners';


import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line, Legend, LineChart, BarChart, Bar } from 'recharts';

// import { RechartsDevtools } from '@recharts/devtools';





function AnalyticsPage() {

    const dispatch: AppDispatch = useDispatch();
    const { data, loading, error } =
        useSelector(selectSummary) as SummaryState;


    const {
        data: analticsData,
        loading: analyticsLoading,
        error: analticsError
    } = useSelector(selectAnalyticsDashboardState) as AnalyticsDashboardState


    useEffect(() => {
        Promise.all([
            dispatch(fetchAdminSummary()),
            dispatch(fetchAdminDashboardAnalysis())
        ])
    }, [dispatch]);


    const totalUser = data
        ? data.totalDoctors +
        data.totalPatients +
        data.totalReceptionists +
        data.totalStudents
        : 0;
    return (
        <DashboardLayout pageTitle='Analytics Data'>
            <div className="mb-6">
                <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Reports & Analytics</h2>
                <p className="text-gray-600 dark:text-gray-400">View system insights and generate reports</p>
            </div>

            {loading ? (
                <div className="w-full  flex items-center justify-center">
                    <ScaleLoader color="#6d61ff" />{" "}
                </div>
            ) : error ? (
                <Error message={error} />
            ) : (
                <div className="grid max-sm:grid-cols-2 grid-cols-4 gap-4">
                    <StatCard
                        Icon={Users}
                        label="Total User"
                        value={String(totalUser)}
                        colorClass="text-blue-500 bg-blue-200"
                    />
                    <StatCard
                        Icon={ShieldCheck}
                        label="Active Doctors"
                        value={String(data?.totalVerified)}
                        colorClass="text-green-500 bg-green-200"
                    />
                    <StatCard
                        Icon={Calendars}
                        label="Appointments Today"
                        value={String(data?.appointmentsToday)}
                        colorClass="text-purple-500 bg-purple-200"
                    />
                    <StatCard
                        Icon={FileText}
                        label="Total Scans"
                        value={String(1234)}
                        colorClass="text-orange-500 bg-orange-200"
                    />
                </div>
            )}


            {/* analtics */}
            <div className='space-y-3'>
                <div className='flex justify-between'>
                    <h2 className='text-xl'>Analytics & Insights</h2>
                    <select className='py-1 px-2 bg-(--color-surface) border border-(--color-border) rounded-md'>
                        <option value="7day">Last 7 Day</option>
                        <option value="30day">Last 30 Day</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last 1 Year</option>
                    </select>
                </div>


                {analyticsLoading ?
                    <MiniLoading />
                    : analticsError ?
                        <Error message={analticsError || 'there is error when fetch anatics dashboard'} />
                        : <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                            {analticsData?.patientGrowth && <CardComp>
                                <h2 className='text-lg'>Patient Growth</h2>
                                <AreaChart
                                    style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                                    responsive
                                    data={analticsData?.patientGrowth}
                                    margin={{
                                        top: 20,
                                        right: 0,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                    onContextMenu={(_, e) => e.preventDefault()}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" niceTicks="snap125" />
                                    <YAxis width="auto" niceTicks="snap125" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--color-surface)',
                                            borderColor: 'var(--color-border)',
                                        }} />
                                    <Area type="monotone" dataKey="count" fill="var(--chart-1)" />
                                    {/* <RechartsDevtools /> */}
                                </AreaChart>
                            </CardComp>}
                            {
                                analticsData?.appointmentsChart && <CardComp>
                                    <h2 className='text-lg'>Appointments </h2>
                                    <LineChart
                                        style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
                                        responsive
                                        data={analticsData?.appointmentsChart}
                                        margin={{
                                            top: 5,
                                            right: 0,
                                            left: 0,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={'date'} stroke="var(--color-text-light)" />
                                        <YAxis width="auto" stroke="var(--color-text-light)" />
                                        <Tooltip
                                            cursor={{
                                                stroke: 'var(--color-border-2)',
                                            }}
                                            contentStyle={{
                                                backgroundColor: 'var(--color-surface)',
                                                borderColor: 'var(--color-border)',
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="var(--chart-2)"
                                            strokeWidth={2}
                                            dot={{
                                                fill: 'var(--color-surface-base)',
                                            }}
                                            activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
                                        />
                                    </LineChart>
                                </CardComp>}

                            {analticsData?.topDoctors && <CardComp>
                                <h2 className='text-lg'>Doctor Activity (Top 5)</h2>
                                <BarChart
                                    style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                                    responsive
                                    data={analticsData.topDoctors}
                                    margin={{
                                        top: 20,
                                        right: 0,
                                        left: 0,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="doctorName" />
                                    <YAxis yAxisId="left" orientation="left" stroke="var(--color-text-light)" width="auto" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--color-surface)',
                                            borderColor: 'var(--color-border)',
                                        }} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="totalAppointments" fill="var(--chart-3)" />

                                </BarChart>
                            </CardComp>}

                            {analticsData?.revenueChart && <CardComp>
                                <h2 className='text-lg'>Revenue & Payments</h2>
                                <AreaChart
                                    style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                                    responsive
                                    data={analticsData.revenueChart}
                                    margin={{
                                        top: 20,
                                        right: 0,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                    onContextMenu={(_, e) => e.preventDefault()}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" niceTicks="snap125" />
                                    <YAxis width="auto" niceTicks="snap125" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--color-surface)',
                                            borderColor: 'var(--color-border)',
                                        }} />
                                    <Area type="monotone" dataKey="revenue" fill="var(--chart-4)" />
                                    {/* <RechartsDevtools /> */}
                                </AreaChart>
                            </CardComp>}

                        </div>
                }

            </div>

        </DashboardLayout>
    )
}

export default AnalyticsPage