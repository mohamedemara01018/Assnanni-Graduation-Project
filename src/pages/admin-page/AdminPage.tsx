import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import StatCard from "@/components/statical-card/StaticalCard";
import {
  Calendars,
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

function AdminPage() {
  return (
    <DashboardLayout pageTitle="Admin page">
      <>
        <div>
          <div className="flex gap-3 items-end">
            <h1 className="text-3xl text-(--color-text)">Welcome Back, John</h1>
            <div className="flex gap-1 bg-red-100 px-3 py-0.5 text-red-400  rounded-full">
              <ShieldCheck className="w-5" />
              <span className="text-sm">Admin</span>
            </div>
          </div>
          <p className=" text-(--color-text-light)">
            Here's your health dashboard overview
          </p>
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
        
      </>
    </DashboardLayout>
  );
}

export default AdminPage;
