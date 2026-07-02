# Stage 1

# Notification System REST API Design

This document explains the REST APIs used in the notification system. It includes the API endpoints, request and response format, headers, notification schema, status codes, and the real-time notification process.

---

## Base URL

```
http://localhost:5000/api
```

---

## Request Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

---

# API Endpoints

## 1. Get All Notifications

**Endpoint**

```
GET /notifications
```

**Description**

Returns all the notifications available for the logged-in user.

**Headers**

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request**

No request body is required.

**Response**

```json
{
  "notifications": [
    {
      "id": 1,
      "title": "Placement Update",
      "message": "Interview starts tomorrow.",
      "isRead": false,
      "createdAt": "2026-07-02T10:30:00Z"
    }
  ]
}
```

---

## 2. Get Notification by ID

**Endpoint**

```
GET /notifications/:id
```

**Description**

Returns the details of a particular notification.

**Headers**

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request**

No request body is required.

**Response**

```json
{
  "id": 1,
  "title": "Placement Update",
  "message": "Interview starts tomorrow.",
  "isRead": false,
  "createdAt": "2026-07-02T10:30:00Z"
}
```

---

## 3. Create Notification

**Endpoint**

```
POST /notifications
```

**Description**

Creates a new notification.

**Headers**

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request**

```json
{
  "title": "Exam",
  "message": "Exam starts at 9 AM"
}
```

**Response**

```json
{
  "message": "Notification created successfully"
}
```

---

## 4. Mark Notification as Read

**Endpoint**

```
PATCH /notifications/:id/read
```

**Description**

Updates the selected notification as read.

**Headers**

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request**

No request body is required.

**Response**

```json
{
  "message": "Notification marked as read"
}
```

---

## 5. Delete Notification

**Endpoint**

```
DELETE /notifications/:id
```

**Description**

Deletes the selected notification.

**Headers**

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request**

No request body is required.

**Response**

```json
{
  "message": "Notification deleted successfully"
}
```

---

# Notification JSON Schema

A notification object contains the following fields.

```json
{
  "id": 1,
  "title": "Placement Update",
  "message": "Interview starts tomorrow.",
  "isRead": false,
  "createdAt": "2026-07-02T10:30:00Z"
}
```

---

# HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request completed successfully |
| 201 | Notification created successfully |
| 400 | Invalid request |
| 401 | Unauthorized user |
| 404 | Notification not found |
| 500 | Internal server error |

---

# Real-Time Notification Mechanism

**Technology Used**

Socket.IO

**How it works**

1. The user opens the application and logs in.
2. The frontend connects to the backend using Socket.IO.
3. Whenever a new notification is created, the backend sends it instantly to the connected user.
4. The frontend receives the notification and displays it immediately without refreshing the page.

**Socket Event**

```
notification:new
```

**Example Payload**

```json
{
  "id": 5,
  "title": "Placement Update",
  "message": "Interview starts in 30 minutes.",
  "isRead": false,
  "createdAt": "2026-07-02T11:00:00Z"
}
```

# Stage 2
## Database Choice

I suggest using MySQL as the database for the notification system.

Reasons:
- Easy to use and learn.
- Stores data permanently.
- Supports SQL queries.
- Good performance for notification data.
- Can handle large amounts of data.

## Database Schema

Table Name: notifications


| Column | Data Type | Description |
|---------|-----------|-------------|
| id | INT | Primary Key |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification message |
| is_read | BOOLEAN | Read status |
| created_at | DATETIME | Created date and time |

```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Problems When Data Increases

As the number of notifications increases:

- Searching becomes slower.
- Fetching notifications takes more time.
- Database storage increases.
- Server performance may reduce.

## Solutions

- Use indexes to improve search speed.
- Delete old notifications regularly.
- Use pagination to load fewer notifications at a time.
- Optimize SQL queries.

## get All Notfications
```sql
SELECT * FROM notifications;
```

## Get Notification by ID
```sql
SELECT * FROM notifications
WHERE id = 1;
```

## Create Notification
```sql
INSERT INTO notifications(title, message)
VALUES('Exam','Exam starts at 9 AM');
```

## Mark as Read
```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 1;
```

## Delete Notification
```sql
DELETE FROM notifications
WHERE id = 1;
```

# Stage 3

## Query Given

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

## Is this query accurate?

Yes, the query is correct because it returns all unread notifications for student ID 1042 and sorts them by the notification creation time.

---

## Why is this query slow?

The database contains around 5,000,000 notifications. If there is no index on the `studentID`, `isRead`, and `createdAt` columns, the database has to scan a large number of rows before returning the result. This increases the query execution time.

---

## How can this be improved?

Create a composite index on the columns used in the query.

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

This index helps the database quickly find unread notifications of a particular student and return them in sorted order.

---

## Computational Cost

### Before Index

- Time Complexity: O(n)
- The database scans the entire notifications table.

### After Index

- Time Complexity: O(log n)
- The database directly accesses the required records using the index.

---

## Should indexes be added on every column?

No.

Adding indexes on every column is not a good idea because:

- It increases storage usage.
- Insert, Update, and Delete operations become slower.
- Many indexes are never used.
- Only frequently searched or sorted columns should be indexed.

---

## SQL Query to Find Students Who Received Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

# Stage 3

## Query Given

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

## Is this query accurate?

Yes, the query is correct because it returns all unread notifications for student ID 1042 and sorts them by the notification creation time.

---

## Why is this query slow?

The database contains around 5,000,000 notifications. If there is no index on the `studentID`, `isRead`, and `createdAt` columns, the database has to scan a large number of rows before returning the result. This increases the query execution time.

---

## How can this be improved?

Create a composite index on the columns used in the query.

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

This index helps the database quickly find unread notifications of a particular student and return them in sorted order.

---

## Computational Cost

### Before Index

- Time Complexity: O(n)
- The database scans the entire notifications table.

### After Index

- Time Complexity: O(log n)
- The database directly accesses the required records using the index.

---

## Should indexes be added on every column?

No.

Adding indexes on every column is not a good idea because:

- It increases storage usage.
- Insert, Update, and Delete operations become slower.
- Many indexes are never used.
- Only frequently searched or sorted columns should be indexed.

---

## SQL Query to Find Students Who Received Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

# Stage 4

## Problem

Right now, notifications are loaded from the database every time a user opens or refreshes the page. If many users use the application at the same time, the database receives too many requests. This makes the application slower and gives users a poor experience.

---

## Solution 1: Pagination

Instead of loading all notifications at once, load only a small number of notifications on each page (for example, 10 notifications).

### Advantages

- Reduces the amount of data loaded.
- Faster page loading.
- Reduces database workload.

### Trade-offs

- Users have to move to the next page to see older notifications.

---

## Solution 2: Caching

Store frequently used notifications in a cache like Redis. When the user requests notifications, the application first checks the cache before accessing the database.

### Advantages

- Faster response.
- Fewer database queries.
- Better overall performance.

### Trade-offs

- Extra memory is required.
- Cache needs to be updated whenever notifications change.

---

## Solution 3: Real-Time Notifications

Use Socket.IO or WebSockets to send new notifications directly to users instead of checking the database repeatedly.

### Advantages

- Users receive notifications instantly.
- Reduces unnecessary API requests.
- Improves user experience.

### Trade-offs

- Slightly more difficult to implement.
- Requires maintaining socket connections.

---

## Solution 4: Database Indexing

Create indexes on columns that are searched often, such as `studentID`, `isRead`, and `createdAt`.

### Advantages

- Faster searching and sorting.
- Improves database performance.

### Trade-offs

- Uses extra storage.
- Insert and update operations become slightly slower.

---

## Solution 5: Lazy Loading

Load only the first few notifications when the page opens. Load more notifications only when the user scrolls down or clicks "Load More".

### Advantages

- Faster initial page load.
- Less data is fetched from the database.
- Better user experience.

### Trade-offs

- Requires a little more frontend development.

---

# Stage 5

## Problems in the Current Implementation

The current implementation processes each student one by one. For every student, it sends an email, saves the notification to the database, and pushes the notification to the app.

This approach has a few problems:

- It takes a long time to notify all 50,000 students.
- If sending an email fails for one student, the remaining students may have to wait.
- The whole process becomes slow because every task is performed one after another.
- If the application crashes in the middle, some students may receive notifications while others do not.

---

## What would I change?

Instead of processing each student one by one, I would use a message queue.

The application first stores all notification requests in the queue. Worker processes then handle sending emails, saving notifications, and pushing notifications to the app in the background.

This allows many notifications to be processed at the same time and improves performance.

---

## Should saving to the database and sending email happen together?

No.

These two operations should be handled separately.

The notification should first be saved in the database because it is the main record. Sending the email can happen afterwards in the background.

Even if the email fails, the notification is still available inside the application and the email can be retried later.

---

## Worker Process:

    while queue is not empty:

        request = get next notification

        save notification to database

        send email

        push notification to the application
```

---

## Advantages

- Faster notification delivery.
- Handles thousands of students efficiently.
- Failed emails can be retried later.
- Database records are always saved.
- Better performance and reliability.

---


