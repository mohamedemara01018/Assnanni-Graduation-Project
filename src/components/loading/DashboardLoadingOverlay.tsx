import { useIsFetching } from "@tanstack/react-query";
import Loading from "./Loading";
import useMinimumLoading from "@/hooks/useMinimumLoading";

function DashboardLoadingOverlay() {
  const isInitialLoading = useMinimumLoading();
  const dashboardFetches = useIsFetching({
    predicate: (query) => {
      const queryKey = query.queryKey.join(" ");

      return queryKey.toLowerCase().includes("dashboard");
    },
  });

  if (!isInitialLoading && dashboardFetches === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-(--color-bg)">
      <Loading />
    </div>
  );
}

export default DashboardLoadingOverlay;
