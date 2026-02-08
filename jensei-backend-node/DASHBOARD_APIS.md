# Dashboard API Documentation

> **Status:** ✅ Tested & Production Ready
> **Last Updated:** February 9, 2026
> **APIs Tested:** 4/4 Working

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

## 📋 Available APIs (4 Tested Endpoints)

### 1. Get Doctor's Appointments ✅

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
      "createdAt": "2026-02-08T10:30:00.000Z"
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

### 2. Get Appointment Statistics ✅

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

### 3. Search Appointments by Patient ✅

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

### 4. Get Available Slots ✅

**Endpoint:** `GET /slots/:doctorId`

**Description:** Get available time slots for a doctor on a specific date.

**Authentication:** ⚠️ **Public endpoint - No authentication required**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | No | Date to check (YYYY-MM-DD, default: today) |
| `period` | string | No | Filter by: `Morning`, `Afternoon`, `Evening`, `Night` |

**Example:**
```bash
GET /api/slots/507f1f77bcf86cd799439011?date=2026-02-10&period=Morning
```

**Response:**
```json
{
  "success": true,
  "data": {
    "availableSlots": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "doctorId": "507f1f77bcf86cd799439011",
        "date": "2026-02-10T00:00:00.000Z",
        "startTime": "09:00",
        "endTime": "09:30",
        "period": "Morning",
        "bookingType": null,
        "status": "available"
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "doctorId": "507f1f77bcf86cd799439011",
        "date": "2026-02-10T00:00:00.000Z",
        "startTime": "09:30",
        "endTime": "10:00",
        "period": "Morning",
        "bookingType": null,
        "status": "available"
      }
    ],
    "isDoctorAvailable": true,
    "unavailabilityReason": null,
    "unavailabilityType": null
  }
}
```

**Notes:**
- `availableSlots` only includes slots with `status: "available"`
- When doctor is unavailable, `isDoctorAvailable` will be `false`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
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
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `500` | Server Error |

---

## 🔒 Authorization Rules

| Endpoint | Authorization Required |
|----------|----------------------|
| Get Appointments | ✅ Doctor (own data) or Admin |
| Get Statistics | ✅ Doctor (own data) or Admin |
| Search Patients | ✅ Doctor (own data) or Admin |
| Get Slots | ❌ Public (no auth needed) |

---

## 💡 Common Use Cases

### 1. Dashboard Overview (KPIs)
```bash
# Get today's statistics
GET /api/appointments/doctor/:doctorId/statistics?period=today
Authorization: Bearer <token>
```

### 2. Upcoming Appointments List
```bash
# Get confirmed appointments
GET /api/appointments/doctor/:doctorId?status=confirmed
Authorization: Bearer <token>
```

### 3. Find Patient's Appointments
```bash
# Search by patient name
GET /api/appointments/doctor/:doctorId/search?query=john
Authorization: Bearer <token>
```

### 4. Check Doctor Availability
```bash
# Get available slots for tomorrow (no auth needed)
GET /api/slots/:doctorId?date=2026-02-10
```

---

## 🧪 Testing with Postman/Thunder Client

### Setup: Create Environment Variables
```
baseUrl = https://jensei.onrender.com/api
doctorId = (your doctor's user ID)
token = (leave empty, will be set after login)
```

### 1. Login & Get Token
```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "email": "doctor@example.com",
  "password": "yourpassword"
}

# After response, copy the token
# Set {{token}} = <token-from-response>
```

### 2. Test Statistics
```
GET {{baseUrl}}/appointments/doctor/{{doctorId}}/statistics?period=today
Authorization: Bearer {{token}}
```

### 3. Test Appointments List
```
GET {{baseUrl}}/appointments/doctor/{{doctorId}}?status=confirmed&page=1&limit=10
Authorization: Bearer {{token}}
```

### 4. Test Patient Search
```
GET {{baseUrl}}/appointments/doctor/{{doctorId}}/search?query=john
Authorization: Bearer {{token}}
```

### 5. Test Slots (No Auth)
```
GET {{baseUrl}}/slots/{{doctorId}}?date=2026-02-10&period=Morning
# No Authorization header needed
```

---

## 🐛 Troubleshooting

### 401 Unauthorized
- **Cause:** Missing or expired token
- **Fix:** Login again to get a fresh token

### 403 Forbidden
- **Cause:** Trying to access another doctor's data
- **Fix:** Use the correct `doctorId` matching your authenticated user

### 400 Bad Request - "Search query is required"
- **Cause:** Missing `query` parameter in search endpoint
- **Fix:** Add `?query=searchterm` to the URL

### 404 Not Found
- **Cause:** Invalid doctor ID or appointment ID
- **Fix:** Verify IDs exist in the database

### Empty `availableSlots` array
- **Cause:** No slots available for that date/period, or all slots are booked
- **Fix:** Try a different date or check `isDoctorAvailable` flag

---

## 📞 Support

**Questions or Issues?**
1. Check the error message in the response
2. Verify your authentication token is valid
3. Ensure you're using the correct `doctorId`
4. Contact backend team: [Your contact info]

---

## 📝 Notes

- All 4 endpoints have been tested and verified working
- Token expires in 7 days - login again if you get 401 errors
- Use Bearer token authentication for easier testing and integration
- Slots endpoint is public - useful for checking availability without login

---

**Version:** 1.0
**Tested:** February 9, 2026
**Environment:** Production (Render)
**Total APIs:** 4 (All tested ✅)
