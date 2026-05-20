# Technical Architecture

## Architecture Style

- Client-server web application
- RESTful backend API
- Role-based authorization
- Modular monolith for Phase 1 (can evolve to services)

## Suggested Stack

- Frontend: React (or Next.js) + Tailwind CSS
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Cache/queues (optional phase extension): Redis
- Object storage for caregiver docs: S3-compatible storage

## High-Level Components

1. **Web Client**
   - User portal (family/elderly)
   - Caregiver portal
   - Admin portal
2. **API Server**
   - Auth module
   - User/patient module
   - Caregiver verification module
   - Service catalog module
   - Booking module
   - Notification module
   - Admin analytics module
3. **Database**
   - Relational schema for transactional consistency
4. **Notification Providers**
   - Email (MVP)
   - SMS/push (future)

## Security Design

- JWT auth with refresh tokens
- Password hashing with bcrypt/argon2
- Role-based middleware (`USER`, `CAREGIVER`, `ADMIN`)
- Input validation on all endpoints
- Rate limiting and brute-force protections
- Secure headers (helmet) and CORS restrictions
- Audit log table for sensitive actions

## Booking Lifecycle

`PENDING -> ACCEPTED -> IN_PROGRESS -> COMPLETED`

Additional terminal states:

- `REJECTED`
- `CANCELLED`

## Key API Domains

- `/auth`
- `/users`, `/patients`
- `/caregivers`, `/verification`
- `/services`
- `/bookings`, `/care-notes`
- `/admin/*`

## Deployment Blueprint

- Frontend on Vercel/Netlify
- Backend on Render/AWS ECS/EC2
- PostgreSQL on managed service
- Environment-based configs (`dev`, `staging`, `prod`)

## Observability

- Structured logging (request IDs)
- Error tracking (Sentry or equivalent)
- Basic metrics:
  - Request latency
  - Booking success/failure counts
  - Caregiver response time

## Folder Structure (Example)

```txt
root/
  frontend/
  backend/
    src/
      modules/
        auth/
        users/
        patients/
        caregivers/
        services/
        bookings/
        admin/
      middleware/
      utils/
      app.js
  docs/
```

