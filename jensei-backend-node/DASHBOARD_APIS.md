# Dashboard API Documentation

> **Status:** ✅ Production Ready
> **Last Updated:** February 9, 2026

---

## 🔐 Authentication

All dashboard endpoints require JWT authentication. **Two methods supported:**

### Method 1: Bearer Token (⭐ Recommended for Dashboard)

**Step 1: Login to get token**
```bash
POST https://jensei.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dr. John Smith",
    "email": "doctor@example.com",
    "role": "doctor"
  }
}
```

**Step 2: Use token in all requests**
```bash
GET https://jensei.onrender.com/api/appointments/doctor/:doctorId/statistics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Method 2: HTTP-Only Cookies (For Web Apps)

Login automatically sets a secure cookie. Include `credentials: 'include'` in fetch requests:

```javascript
fetch('https://jensei.onrender.com/api/appointments/doctor/:id/statistics', {
  credentials: 'include'
})
```

---

## 🌐 Base URLs

- **Production:** `https://jensei.onrender.com/api`
- **Development:** `http://localhost:3000/api`

---

## 📋 Available Endpoints

### 1. Get Doctor's Appointments

**Endpoint:** `GET /appointments/doctor/:doctorId`

**Description:** Retrieve paginated list of appointments with filtering by status, date, or date range.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by: `confirmed`, `completed`, `cancelled`, `no-show` |
| `date` | string | No | Specific date (YYYY-MM-DD) |
| `startDate` | string | No | Start of date range (YYYY-MM-DD) |
| `endDate` | string | No | End of date range (YYYY-MM-DD) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 50) |

**Example:**
```bash
GET /api/appointments/doctor/507f1f77bcf86cd799439011?status=confirmed&page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "doctorId": "507f1f77bcf86cd799439011",
      "timeSlotId": {
        "date": "2026-02-15T00:00:00.000Z",
        "startTime": "10:00",
        "endTime": "10:30",
        "period": "Morning",
        "bookingType": "video_call"
      },
      "appointmentType": "video_call",
      "status": "confirmed",
      "notes": "Patient notes here",
      "doctorNotes": "",
      "consultationFee": 500,
      "paymentStatus": "pending",
      "completedAt": null,
      "notesUpdatedAt": null,
      "createdAt": "2026-02-08T10:30:00.000Z",
      "updatedAt": "2026-02-08T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Authorization:**
- Doctor can only view their own appointments
- Admin can view any doctor's appointments

---

### 2. Get Appointment Statistics

**Endpoint:** `GET /appointments/doctor/:doctorId/statistics`

**Description:** Get aggregated KPIs including counts, revenue, and appointment type breakdown.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | No | `today`, `week`, `month`, or `all` (default: `today`) |

**Example:**
```bash
GET /api/appointments/doctor/507f1f77bcf86cd799439011/statistics?period=week
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "totalAppointments": 45,
    "todayCount": 8,
    "upcomingCount": 12,
    "confirmedCount": 20,
    "completedCount": 18,
    "cancelledCount": 5,
    "noShowCount": 2,
    "totalRevenue": 22500,
    "paidAppointments": 18,
    "avgConsultationFee": 1250,
    "appointmentTypes": {
      "videoCall": 15,
      "voiceCall": 10,
      "clinicVisit": 20
    }
  }
}
```

**Authorization:**
- Doctor can only view their own statistics
- Admin can view any doctor's statistics

---

### 3. Search Appointments by Patient

**Endpoint:** `GET /appointments/doctor/:doctorId/search`

**Description:** Search appointments by patient name or email (case-insensitive).

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | ✅ Yes | Search term (matches name or email) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 50) |

**Example:**
```bash
GET /api/appointments/doctor/507f1f77bcf86cd799439011/search?query=john
Authorization: Bearer <token>
```

**Response:** Same format as "Get Doctor's Appointments"

**Authorization:**
- Doctor can only search their own appointments
- Admin can search any doctor's appointments

---

### 4. Update Appointment Status

**Endpoint:** `PATCH /appointments/:appointmentId/status`

**Description:** Update appointment status (confirmed → completed/no-show).

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid Status Values:**
- `confirmed`
- `completed`
- `no-show`

**Example:**
```bash
PATCH /api/appointments/60d5ec49f1b2c72b8c8e4f1a/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "status": "completed",
    "completedAt": "2026-02-09T14:30:00.000Z",
    ...
  }
}
```

**Notes:**
- Cannot update status of cancelled appointments
- Setting status to `completed` automatically sets `completedAt` timestamp

**Authorization:**
- Only the appointment's doctor or admin can update status

---

### 5. Add/Update Doctor Notes

**Endpoint:** `PATCH /appointments/:appointmentId/notes`

**Description:** Add or update clinical notes for an appointment.

**Request Body:**
```json
{
  "doctorNotes": "Patient responded well to treatment. Prescribed medication XYZ. Follow-up in 2 weeks."
}
```

**Example:**
```bash
PATCH /api/appointments/60d5ec49f1b2c72b8c8e4f1a/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorNotes": "Patient doing well, no complications."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor notes updated successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "doctorNotes": "Patient doing well, no complications.",
    "notesUpdatedAt": "2026-02-09T14:35:00.000Z",
    ...
  }
}
```

**Authorization:**
- Only the appointment's doctor or admin can add notes

---

### 6. Bulk Update Slot Status

**Endpoint:** `PATCH /slots/:doctorId/bulk`

**Description:** Update multiple time slots at once (mark as cancelled/available).

**Request Body:**
```json
{
  "slotIds": [
    "60d5ec49f1b2c72b8c8e4f1a",
    "60d5ec49f1b2c72b8c8e4f1b",
    "60d5ec49f1b2c72b8c8e4f1c"
  ],
  "status": "cancelled"
}
```

**Valid Status Values:**
- `available`
- `cancelled`

**Example:**
```bash
PATCH /api/slots/507f1f77bcf86cd799439011/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "slotIds": ["60d5ec49f1b2c72b8c8e4f1a", "60d5ec49f1b2c72b8c8e4f1b"],
  "status": "cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 slots updated successfully",
  "data": {
    "updatedCount": 2,
    "totalRequested": 2
  }
}
```

**Notes:**
- Cannot change booked slots to available (must cancel appointment first)
- Booked slots are automatically excluded from bulk updates

**Authorization:**
- Only the doctor or admin can bulk update slots

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "pagination": { ... }  // Only for list endpoints
}
```

### Error Response
```json
{
  "error": "Descriptive error message"
}
```

---

## 🚦 HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `500` | Server Error |

---

## 🔒 Authorization Rules

| Role | Permissions |
|------|-------------|
| **Doctor** | View/update own appointments, statistics, and slots only |
| **Admin** | Full access to all doctors' data |
| **Patient** | Cannot access dashboard endpoints |

---

## 💡 Common Use Cases

### 1. Dashboard Overview (KPIs)
```bash
# Get today's statistics
GET /api/appointments/doctor/:doctorId/statistics?period=today
```

### 2. Upcoming Appointments
```bash
# Get confirmed appointments for today
GET /api/appointments/doctor/:doctorId?status=confirmed
```

### 3. Complete Appointment Workflow
```bash
# 1. Mark as completed
PATCH /api/appointments/:appointmentId/status
{ "status": "completed" }

# 2. Add clinical notes
PATCH /api/appointments/:appointmentId/notes
{ "doctorNotes": "Treatment successful" }
```

### 4. Find Patient's Appointments
```bash
# Search by patient name
GET /api/appointments/doctor/:doctorId/search?query=john
```

### 5. Block Time Off
```bash
# Cancel multiple slots at once
PATCH /api/slots/:doctorId/bulk
{ "slotIds": [...], "status": "cancelled" }
```

---

## 🧪 Testing with Postman/Thunder Client

### 1. Login & Get Token
```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "email": "your-doctor@email.com",
  "password": "yourpassword"
}

Save the token from response
```

### 2. Test Statistics Endpoint
```
GET {{baseUrl}}/appointments/doctor/{{doctorId}}/statistics?period=week
Headers:
  Authorization: Bearer {{token}}
```

### 3. Test Update Status
```
PATCH {{baseUrl}}/appointments/{{appointmentId}}/status
Headers:
  Authorization: Bearer {{token}}
  Content-Type: application/json
Body:
{
  "status": "completed"
}
```

---

## 🐛 Troubleshooting

### 401 Unauthorized
- **Cause:** Invalid or expired token
- **Solution:** Login again to get a fresh token

### 403 Forbidden
- **Cause:** Trying to access another doctor's data
- **Solution:** Use the correct `doctorId` that matches your authenticated user

### 400 Bad Request
- **Cause:** Missing required fields or invalid values
- **Solution:** Check request body matches the documentation

### 404 Not Found
- **Cause:** Invalid appointment ID or doctor ID
- **Solution:** Verify the IDs exist in the database

---

## 📞 Support

For issues or questions about these APIs:
- Check error message in response
- Verify authentication token is valid
- Ensure correct `doctorId` is being used
- Contact backend team: [Your contact info]

---

**Version:** 1.0
**Last Tested:** February 9, 2026
**Environment:** Production (Render)
