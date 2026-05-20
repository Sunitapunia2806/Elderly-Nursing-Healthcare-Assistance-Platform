# API Specification (MVP)

Base URL: `/api/v1`

## Authentication

### POST `/auth/register`

- Creates a user account (role defaults to `USER`)

### POST `/auth/login`

- Authenticates user and returns access token

### POST `/auth/refresh`

- Refreshes access token

### POST `/auth/logout`

- Invalidates active session token

## User and Patient

### GET `/users/me`

- Returns authenticated user profile

### PUT `/users/me`

- Updates user profile

### POST `/patients`

- Create patient profile for dependent elderly person

### GET `/patients`

- List patient profiles created by user

### PUT `/patients/:id`

- Update patient profile

## Services and Caregivers

### GET `/services`

- List available service categories and pricing

### GET `/caregivers`

- List verified caregivers with filters:
  - service type
  - city
  - availability
  - rating

### GET `/caregivers/:id`

- Detailed caregiver profile

## Bookings

### POST `/bookings`

- Create booking request
- Request body:
  - `patientId`
  - `serviceId`
  - `caregiverId` (optional if auto-assign strategy is added later)
  - `scheduleStart`
  - `durationType` (`HOURLY`, `DAILY`, `LONG_TERM`)
  - `notes`

### GET `/bookings`

- List bookings for current user/caregiver

### GET `/bookings/:id`

- Booking details + status timeline

### PATCH `/bookings/:id/status`

- Update status (caregiver/admin authorized)

### PATCH `/bookings/:id/cancel`

- Cancel booking (user/admin rules apply)

## Care Notes and Reviews

### POST `/bookings/:id/care-notes`

- Caregiver adds visit note and observations

### GET `/bookings/:id/care-notes`

- User/admin views care notes

### POST `/bookings/:id/review`

- User adds rating and comment

## Caregiver Portal

### POST `/caregivers/register`

- Register caregiver profile

### POST `/caregivers/verification-documents`

- Upload verification documents

### PUT `/caregivers/me/availability`

- Manage slot availability and service areas

### GET `/caregivers/me/earnings`

- View earning summary and completed jobs

## Admin

### GET `/admin/caregivers/pending`

- List pending caregiver verifications

### PATCH `/admin/caregivers/:id/verify`

- Approve/reject caregiver

### GET `/admin/complaints`

- List complaints/disputes

### PATCH `/admin/complaints/:id`

- Resolve/escalate complaint

### GET `/admin/analytics/overview`

- Dashboard KPIs

## Standard Response Shape

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": {}
}
```

## Error Shape

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "issue": "Email already exists"
    }
  ]
}
```

