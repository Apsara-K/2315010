import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  async function getNotifications() {
    const data = await fetchNotifications();

    const notificationList = data.notifications;

    const priority = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };

    notificationList.sort((a, b) => {
      const priorityA = priority[a.Type];
      const priorityB = priority[b.Type];

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const topTen = notificationList.slice(0, 10);

    setNotifications(topTen);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Priority Inbox</h1>

      {notifications.map((notification) => (
        <div
          key={notification.ID}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{notification.Type}</h3>

          <p>{notification.Message}</p>

          <p>
            <strong>Time :</strong> {notification.Timestamp}
          </p>
        </div>
      ))}
    </div>
  );
}