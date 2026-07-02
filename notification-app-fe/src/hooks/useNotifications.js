import { useState, useEffect } from "react";
import { fetchNotifications } from "../apis/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchNotifications();
      setNotifications(data.notifications ?? []);
    };

    load();
  }, [notifications]);

  const totalPages = 1;

  return {
    notifications,
    total,
    totalPages,
    loading,
    error,
  };
}
