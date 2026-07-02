import { useState } from "react";
import {Alert,Badge,Box,CircularProgress,Divider,Pagination,Stack,Typography,} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { notifications, totalPages, loading, error } = useNotifications();

  // Count unread notifications
  let unreadCount = 0;

  for (let i = 0; i < notifications.length; i++) {
    if (!notifications[i].isRead) {
      unreadCount++;
    }
  }

  // Filter notifications
  let filteredNotifications = [];

  if (filter === "all")
  {
    filteredNotifications = notifications;
  } 
  else if (filter === "read") 
  {
    filteredNotifications = notifications.filter(
      function (notification) 
      {
        return notification.isRead;
      });
  } 
  else if (filter === "unread") 
  {
    filteredNotifications = notifications.filter(
      function (notification) 
      {
        return !notification.isRead;
      });
  }
  // Change filter
  function handleFilterChange(newFilter) 
  {
    setFilter(newFilter);
    setPage(1);
  }
  // Change page
  function handlePageChange(event, newPage)
  {
    setPage(newPage);
  }
  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Badge badgeContent={unreadCount} color="primary">
          <NotificationsIcon />
        </Badge>

        <Typography variant="h5">
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <NotificationFilter
        value={filter}
        onChange={handleFilterChange}
      />

      <br />

      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">
          Failed to load notifications.
        </Alert>
      )}

      {!loading && !error && filteredNotifications.length === 0 && (
        <Alert severity="info">
          No notifications available.
        </Alert>
      )}

      {!loading && !error && filteredNotifications.length > 0 && (
        <Stack spacing={2}>
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}/>
          ))}
        </Stack>
      )}

      {!loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}