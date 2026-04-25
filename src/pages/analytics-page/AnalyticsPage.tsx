import CardComp from '@/components/card-comp/CardComp';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout'
import StatCard from '@/components/statical-card/StaticalCard'
import { Calendars, FileText, ShieldCheck, TrendingUp, Users } from 'lucide-react'


import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line, Legend, LineChart, BarChart, Bar } from 'recharts';

// import { RechartsDevtools } from '@recharts/devtools';


const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];


function AnalyticsPage() {
    return (
        <DashboardLayout pageTitle='Analytics Data'>
            <div className="mb-6">
                <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Reports & Analytics</h2>
                <p className="text-gray-600 dark:text-gray-400">View system insights and generate reports</p>
            </div>

            <div className="grid max-sm:grid-cols-2 grid-cols-4 gap-4">
                <StatCard
                    Icon={Users}
                    TrendIcon={TrendingUp}
                    trendValue="5"
                    label="total user"
                    value={1234}
                    colorClass="text-blue-500 bg-blue-200"
                />
                <StatCard
                    Icon={ShieldCheck}
                    TrendIcon={TrendingUp}
                    trendValue="5"
                    label="total user"
                    value={1234}
                    colorClass="text-green-500 bg-green-200"
                />
                <StatCard
                    Icon={Calendars}
                    TrendIcon={TrendingUp}
                    trendValue="5"
                    label="total user"
                    value={1234}
                    colorClass="text-purple-500 bg-purple-200"
                />
                <StatCard
                    Icon={FileText}
                    TrendIcon={TrendingUp}
                    trendValue="5"
                    label="total user"
                    value={1234}
                    colorClass="text-orange-500 bg-orange-200"
                />
            </div>


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

                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                    <CardComp>
                        <h2 className='text-lg'>Patient Growth</h2>
                        <AreaChart
                            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                            responsive
                            data={data}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                            onContextMenu={(_, e) => e.preventDefault()}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" niceTicks="snap125" />
                            <YAxis width="auto" niceTicks="snap125" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderColor: 'var(--color-border)',
                                }} />
                            <Area type="monotone" dataKey="uv" fill="var(--chart-1)" />
                            {/* <RechartsDevtools /> */}
                        </AreaChart>
                    </CardComp>

                    <CardComp>
                        <h2 className='text-lg'>Appointments </h2>
                        <LineChart
                            style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
                            responsive
                            data={data}
                            margin={{
                                top: 5,
                                right: 0,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="var(--color-text-light)" />
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
                                dataKey="pv"
                                stroke="var(--chart-2)"
                                strokeWidth={2}
                                dot={{
                                    fill: 'var(--color-surface-base)',
                                }}
                                activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
                            />
                        </LineChart>
                    </CardComp>

                    <CardComp>
                        <h2 className='text-lg'>Doctor Activity (Top 5)</h2>
                        <BarChart
                            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                            responsive
                            data={data}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="var(--color-text-light)" width="auto" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderColor: 'var(--color-border)',
                                }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="pv" fill="var(--chart-3)" />

                        </BarChart>
                    </CardComp>

                    <CardComp>
                        <h2 className='text-lg'>Revenue & Payments</h2>
                        <AreaChart
                            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                            responsive
                            data={data}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                            onContextMenu={(_, e) => e.preventDefault()}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" niceTicks="snap125" />
                            <YAxis width="auto" niceTicks="snap125" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderColor: 'var(--color-border)',
                                }} />
                            <Area type="monotone" dataKey="uv" fill="var(--chart-4)" />
                            {/* <RechartsDevtools /> */}
                        </AreaChart>
                    </CardComp>

                </div>
            </div>

        </DashboardLayout>
    )
}

export default AnalyticsPage