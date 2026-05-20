# Product Requirements Document (PRD)

## Product Name

Elderly Nursing & Healthcare Assistance Platform

## Problem Statement

Elderly individuals and their families struggle to find trusted in-home healthcare support due to fragmented caregiver discovery, manual coordination, inconsistent service quality, and poor transparency in pricing and availability.

## Primary Objectives

- Digitize elderly nursing and healthcare assistance services
- Connect families with verified and trained caregivers
- Enable easy booking and scheduling of care services
- Improve quality, safety, and reliability of care

## Secondary Objectives

- Provide real-time service tracking and updates
- Support long-term care planning
- Enable scalable expansion across regions

## Scope

### In Scope

- Responsive web platform (desktop and mobile web)
- Booking and scheduling of elderly care services
- Caregiver verification and profile management
- Service status tracking and notifications

### Out of Scope (Phase 1)

- Native mobile applications
- Direct hospital management system integrations
- Emergency ambulance services

## User Roles

### Family/User

- Register/login securely
- Create and manage patient profiles
- Browse services and caregivers
- Book services (hourly/daily/long-term)
- Track service status
- View service history and ratings

### Caregiver/Service Agent

- Register and submit verification documents
- Manage profile, availability, and service area
- Accept/reject requests
- Update status and care notes
- View earnings and work history

### Admin

- Verify caregivers and onboard
- Manage users, services, and categories
- Monitor quality, complaints, and disputes
- Access analytics and reports

## Functional Requirements

1. Authentication and role-based access
2. Patient profile management
3. Service catalog and caregiver listing
4. Booking request flow and scheduling
5. Booking lifecycle status updates
6. Notification system (email/SMS/in-app in future phases)
7. Care notes and service history
8. Admin dashboards and moderation tools

## Non-Functional Requirements

### Performance

- Core pages load under 3 seconds on standard broadband/mobile networks
- API p95 response target under 500 ms for common reads

### Security

- Secure authentication with hashed passwords
- Encrypted transport (HTTPS) and encrypted sensitive data at rest
- Role-based authorization for all protected routes
- Audit logs for critical admin actions

### Usability

- Elderly-friendly UI:
  - Larger text and buttons
  - High color contrast
  - Simple navigation and clear labels

### Scalability

- Multi-city support
- Serviceability by pincode/city
- Horizontal scaling for API layer

## Data Entities

- Users
- Patients
- Caregivers
- Services
- Bookings
- CareNotes
- Reviews
- Complaints
- Notifications

## User Journey (MVP)

1. User signs up/logs in
2. User creates patient profile
3. User browses services and caregivers
4. User selects slot and creates booking request
5. Caregiver accepts/rejects booking
6. Service starts, status updates are visible to user
7. Booking completed and care note submitted
8. User rates caregiver

## KPIs

- Registered users
- Verified caregivers
- Booking completion rate
- Average caregiver response time
- User satisfaction score
- Monthly active users

## Assumptions

- Caregivers are verified before active listing
- Families provide accurate patient information
- Care delivery follows healthcare safety guidelines

## Constraints

- No emergency response in Phase 1
- Fixed timeline and budget
- Regional caregiver availability limits service fulfillment

## Deliverables

- Functional web app
- Admin dashboard
- PRD and technical documentation
- Deployment-ready build

## Future Enhancements

- Online payments and insurance support
- Native mobile apps
- Tele-consultation
- Medication reminders
- Emergency SOS workflows

