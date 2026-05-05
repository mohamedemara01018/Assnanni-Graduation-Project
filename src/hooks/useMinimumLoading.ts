import { useEffect, useState } from "react";

function useMinimumLoading(duration = 800) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration]);

  return isLoading;
}

export default useMinimumLoading;
