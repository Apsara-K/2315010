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