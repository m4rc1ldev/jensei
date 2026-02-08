# Dashboard API Documentation

## Authentication
All endpoints require JWT authentication via Bearer token or HTTP-only cookie.

```
Authorization: Bearer <token>
```

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://api.jensei.com/api`

---

## Appointment Management

### 1. Get Doctor's Appointments
```
GET /appointments/doctor/:doctorId
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status: `confirmed`, `completed`, `cancelled`, `no-show` |
| date | string | Filter by specific date (YYYY-MM-DD) |
| startDate | string | Start of date range (YYYY-MM-DD) |
| endDate | string | End of date range (YYYY-MM-DD) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 50) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": { "name": "John Doe", "email": "john@example.com", "phone": "..." },
      "doctorId": "...",
      "timeSlotId": { "date": "2025-01-15", "startTime": "10:00", "endTime": "10:30", "period": "Morning" },
      "appointmentType": "video_call",
      "status": "confirmed",
      "notes": "Patient notes",
      "doctorNotes": "",
      "consultationFee": 500,
      "paymentStatus": "pending",
      "createdAt": "..."
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

---

### 2. Get Appointment Statistics
```
GET /appointments/doctor/:doctorId/statistics
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | `today`, `week`, `month`, or `all` (default: `today`) |

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "today",
    "totalAppointments": 45,
    "todayCount": 8,
    "upcomingCount": 12,
    "counts": {
      "confirmed": 20,
      "completed": 18,
      "cancelled": 5,
      "noShow": 2
    },
    "confirmedCount": 20,
    "completedCount": 18,
    "cancelledCount": 5,
    "noShowCount": 2,
    "revenue": 22500,
    "totalRevenue": 22500,
    "paidAppointments": 18,
    "avgConsultationFee": 500,
    "appointmentTypes": {
      "videoCall": 15,
      "voiceCall": 10,
      "clinicVisit": 20
    }
  },
  "counts": { "confirmed": 20, "completed": 18, "cancelled": 5, "noShow": 2 },
  "appointmentTypes": { "videoCall": 15, "voiceCall": 10, "clinicVisit": 20 },
  "revenue": 22500
}
```

**Notes:**
- `counts`, `appointmentTypes`, and `revenue` are available both inside `data` and at the top level for convenience.
- Flat count fields (`confirmedCount`, `completedCount`, etc.) inside `data` are kept for backward compatibility.
- `data.revenue` and top-level `revenue` are the same numeric total.

---

### 3. Search Appointments by Patient
```
GET /appointments/doctor/:doctorId/search
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search term (matches patient name or email) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

**Response:** Same format as Get Doctor's Appointments.

---

### 4. Update Appointment Status
```
PATCH /appointments/:appointmentId/status
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid statuses:** `confirmed`, `completed`, `no-show`

**Notes:**
- Returns `404` if `appointmentId` is not a valid MongoDB ObjectId format.
- Cannot update status of cancelled appointments
- Only the appointment's doctor or admin can update status
- Setting status to `completed` automatically sets `completedAt` timestamp

**Response:**
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": { ... }
}
```

---

### 5. Add Doctor Notes
```
PATCH /appointments/:appointmentId/notes
```

**Request Body:**
```json
{
  "doctorNotes": "Patient responded well to treatment. Follow-up in 2 weeks."
}
```

**Notes:**
- Returns `404` if `appointmentId` is not a valid MongoDB ObjectId format.
- Only the appointment's doctor or admin can add notes
- Updates `notesUpdatedAt` timestamp automatically

**Response:**
```json
{
  "success": true,
  "message": "Doctor notes updated successfully",
  "data": { ... }
}
```

---

### 6. Get Single Appointment
```
GET /appointments/:appointmentId
```

**Notes:**
- Returns `404` if `appointmentId` is not a valid MongoDB ObjectId format.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": { "name": "...", "email": "...", "phone": "..." },
    "doctorId": { "name": "...", "specialty": "...", "image": "..." },
    "timeSlotId": { "date": "...", "startTime": "...", "endTime": "...", "period": "..." },
    "appointmentType": "video_call",
    "status": "confirmed",
    "notes": "...",
    "doctorNotes": "...",
    "consultationFee": 500,
    "paymentStatus": "pending",
    "completedAt": null,
    "notesUpdatedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 7. Cancel Appointment
```
PATCH /appointments/:appointmentId/cancel
```

**Request Body:**
```json
{
  "reason": "Patient requested cancellation",
  "cancelledBy": "doctor"
}
```

**Valid `cancelledBy` values:** `user`, `doctor`, `system`

**Notes:**
- Returns `404` if `appointmentId` is not a valid MongoDB ObjectId format.
- Uses a MongoDB transaction to atomically cancel the appointment and free the associated time slot.

---

## Slot Management

### 8. Get Available Slots
```
GET /slots/:doctorId
```

**Authentication:** Not required (public endpoint).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| date | string | Date to check (YYYY-MM-DD, default: today) |
| period | string | Filter by period: `Morning`, `Afternoon`, `Evening`, `Night` |

**Response:**
```json
{
  "success": true,
  "data": {
    "availableSlots": [
      {
        "_id": "...",
        "doctorId": "...",
        "date": "2025-02-10T00:00:00.000Z",
        "startTime": "10:00",
        "endTime": "10:30",
        "period": "Morning",
        "bookingType": null,
        "status": "available"
      }
    ],
    "isDoctorAvailable": true,
    "unavailabilityReason": null,
    "unavailabilityType": null,
    "message": null
  }
}
```

**Notes:**
- When the doctor is marked unavailable, `isDoctorAvailable` is `false` and `unavailabilityReason`/`unavailabilityType` describe why.
- `availableSlots` only includes slots with `status: "available"` (booked/cancelled slots are excluded).

---

### 9. Generate Slots (Admin)
```
POST /slots/:doctorId/generate
```

**Request Body:**
```json
{
  "startDate": "2025-02-01",
  "endDate": "2025-02-28"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "slotsGenerated": 120,
  "message": "Generated 120 slots for doctor 6988c31ad4b15a262132c8bb"
}
```

**Notes:**
- Returns `201 Created` on success (not 200).
- Validates date format — returns `400` if dates are not valid `YYYY-MM-DD`.
- Validates date range — returns `400` if `endDate` is before `startDate`.
- Duplicate slots (same doctor + date + startTime) are silently skipped thanks to the unique index on TimeSlot.
- Requires the doctor to have `DoctorSchedule` documents defining their weekly availability.

---

### 10. Bulk Update Slots
```
PATCH /slots/:doctorId/bulk
```

**Request Body:**
```json
{
  "slotIds": ["slot_id_1", "slot_id_2", "slot_id_3"],
  "status": "cancelled"
}
```

**Valid statuses:** `available`, `cancelled`

**Notes:**
- Cannot change booked slots to available (cancel the appointment first)
- Booked slots are automatically excluded from bulk updates
- Only the doctor or admin can perform bulk updates

**Response:**
```json
{
  "success": true,
  "message": "3 slots updated successfully",
  "data": {
    "updatedCount": 3,
    "totalRequested": 3
  }
}
```

---

### 11. Mark Doctor Unavailable
```
POST /slots/:doctorId/unavailable
```

**Request Body:**
```json
{
  "startDate": "2025-02-15",
  "endDate": "2025-02-17",
  "reason": "Conference",
  "type": "other",
  "isRecurring": false
}
```

---

### 12. Get Unavailability Periods
```
GET /slots/:doctorId/unavailable
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Start of range to check |
| endDate | string | End of range to check |

---

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... }
}
```

### Error
```json
{
  "error": "Error message here"
}
```

## Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |

## Authorization Rules
- **Patient:** Can view/cancel their own appointments only
- **Doctor:** Can view/update their own appointments, add notes, update status, manage slots
- **Admin:** Full access to all endpoints
