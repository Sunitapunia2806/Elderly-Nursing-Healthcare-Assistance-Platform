# Elderly Nursing & Healthcare Assistance Platform

Web-based service portal that connects senior citizens and families with verified caregivers such as nurses, attendants, physiotherapists, and post-hospital care staff.

## Vision

Improve accessibility, safety, and continuity of home-based elderly care through a reliable digital platform.

## What this repository contains

- Product requirements in `docs/PRD.md`
- Technical architecture in `docs/TECHNICAL_ARCHITECTURE.md`
- REST API contract in `docs/API_SPEC.md`
- Initial database schema in `docs/DATABASE_SCHEMA.md`
- Delivery roadmap in `docs/IMPLEMENTATION_PLAN.md`

## Suggested stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Auth: JWT with role-based access control
- Deployment: Vercel (frontend) + Render/AWS (backend + DB)

## User roles

- Family/User
- Caregiver/Service Agent
- Admin

## Core modules

- Authentication and authorization
- Patient profiles
- Service catalog and caregiver profiles
- Booking and scheduling
- Booking status tracking and notifications
- Care notes and service history
- Admin verification, complaints, and analytics

## Start here

1. Review `docs/PRD.md`.
2. Confirm MVP scope and timeline.
3. Implement Phase 1 modules from `docs/IMPLEMENTATION_PLAN.md`.

