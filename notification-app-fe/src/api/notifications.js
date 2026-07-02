// Fetch notifications from the given API

export async function fetchNotifications() {
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);

    return [];
  }
}