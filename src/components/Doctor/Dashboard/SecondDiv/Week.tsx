type DashboardResponse = Record<string, unknown>;

interface WeekProps {
  dashboardData?: DashboardResponse;
}

const fallbackWeekStats = {
  appointments: {
    completed: 0,
    total: 0,
  },
  reviews: {
    completed: 0,
    total: 0,
  },
};

const getNestedValue = (data: DashboardResponse | undefined, path: string) =>
  path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object" && key in value) {
      return (value as DashboardResponse)[key];
    }

    return undefined;
  }, data);

const getNumber = (data: DashboardResponse | undefined, paths: string[]) => {
  for (const path of paths) {
    const value = getNestedValue(data, path);

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const numberValue = Number(value);

      if (Number.isFinite(numberValue)) {
        return numberValue;
      }
    }
  }

  return undefined;
};

const getPercentage = (completed: number, total: number) => {
  if (total <= 0) {
    return 0;
  }

  return Math.min((completed / total) * 100, 100);
};

const Week = ({ dashboardData }: WeekProps) => {
  const appointmentCompleted =
    getNumber(dashboardData, [
      "weeklyAppointments.completed",
      "weeklyAppointments.count",
      "weeklyStats.appointments.completed",
      "weeklyStats.appointments.count",
      "thisWeek.appointments.completed",
      "thisWeek.appointments.count",
      "appointmentsThisWeek",
      "weeklyAppointments",
    ]) ?? fallbackWeekStats.appointments.completed;

  const appointmentTotal =
    getNumber(dashboardData, [
      "weeklyAppointments.total",
      "weeklyAppointments.target",
      "weeklyStats.appointments.total",
      "weeklyStats.appointments.target",
      "thisWeek.appointments.total",
      "thisWeek.appointments.target",
      "appointmentsThisWeekTotal",
      "weeklyAppointmentTarget",
    ]) ?? fallbackWeekStats.appointments.total;

  const reviewsCompleted =
    getNumber(dashboardData, [
      "weeklyReviews.completed",
      "weeklyReviews.count",
      "weeklyStats.reviews.completed",
      "weeklyStats.reviews.count",
      "thisWeek.reviews.completed",
      "thisWeek.reviews.count",
      "reviewsCompletedThisWeek",
      "completedReviews",
      "reviewsCompleted",
    ]) ?? fallbackWeekStats.reviews.completed;

  const reviewsTotal =
    getNumber(dashboardData, [
      "weeklyReviews.total",
      "weeklyReviews.target",
      "weeklyStats.reviews.total",
      "weeklyStats.reviews.target",
      "thisWeek.reviews.total",
      "thisWeek.reviews.target",
      "reviewsThisWeekTotal",
      "weeklyReviewTarget",
      "totalReviews",
    ]) ?? fallbackWeekStats.reviews.total;

  return (
    <div className="bg-(--color-surface) rounded-xl p-6 flex flex-col gap-4">
      <h1 className="text-xl font-normal border-b-2 border-gray-300 pb-2 mb-2 text-(--color-text) ">
        This Week
      </h1>
      <div className=" flex flex-col gap-4">
        <div className="flex justify-between ">
          <p className="text-sm text-(--color-text-light)">Appointments</p>
          <span className="text-sm font-semibold text-(--color-text)">
            {appointmentCompleted}/{appointmentTotal}
          </span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div
            className="bg-blue-600 h-2.5 rounded-3xl"
            style={{
              width: `${getPercentage(appointmentCompleted, appointmentTotal)}%`,
            }}
          ></div>
        </div>
      </div>
      <div className=" flex flex-col gap-4">
        <div className="flex justify-between ">
          <p className="text-sm text-(--color-text-light)">Reviews Completed</p>
          <span className="text-sm font-semibold text-(--color-text)">
            {reviewsCompleted}/{reviewsTotal}
          </span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div
            className="bg-green-600 h-2.5 rounded-3xl"
            style={{
              width: `${getPercentage(reviewsCompleted, reviewsTotal)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Week;
