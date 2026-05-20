# Database Schema (PostgreSQL, MVP)

## users

- `id` (uuid, pk)
- `role` (enum: USER, CAREGIVER, ADMIN)
- `full_name` (varchar)
- `email` (varchar, unique)
- `phone` (varchar)
- `password_hash` (varchar)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## patients

- `id` (uuid, pk)
- `user_id` (uuid, fk -> users.id)
- `full_name` (varchar)
- `age` (int)
- `gender` (varchar)
- `medical_needs` (text)
- `address` (text)
- `city` (varchar)
- `emergency_contact` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## services

- `id` (uuid, pk)
- `name` (varchar)
- `description` (text)
- `duration_type` (enum: HOURLY, DAILY, LONG_TERM)
- `base_price` (numeric)
- `required_qualification` (varchar)
- `is_active` (boolean)

## caregivers

- `id` (uuid, pk)
- `user_id` (uuid, fk -> users.id, unique)
- `bio` (text)
- `qualification` (varchar)
- `experience_years` (int)
- `service_area_city` (varchar)
- `verification_status` (enum: PENDING, VERIFIED, REJECTED)
- `rating_avg` (numeric)
- `rating_count` (int)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## caregiver_availability

- `id` (uuid, pk)
- `caregiver_id` (uuid, fk -> caregivers.id)
- `day_of_week` (int)
- `start_time` (time)
- `end_time` (time)

## bookings

- `id` (uuid, pk)
- `user_id` (uuid, fk -> users.id)
- `patient_id` (uuid, fk -> patients.id)
- `caregiver_id` (uuid, fk -> caregivers.id)
- `service_id` (uuid, fk -> services.id)
- `schedule_start` (timestamp)
- `schedule_end` (timestamp)
- `duration_type` (enum: HOURLY, DAILY, LONG_TERM)
- `status` (enum: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED)
- `special_notes` (text)
- `total_price` (numeric)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## booking_status_history

- `id` (uuid, pk)
- `booking_id` (uuid, fk -> bookings.id)
- `status` (varchar)
- `changed_by` (uuid, fk -> users.id)
- `changed_at` (timestamp)
- `comment` (text)

## care_notes

- `id` (uuid, pk)
- `booking_id` (uuid, fk -> bookings.id)
- `caregiver_id` (uuid, fk -> caregivers.id)
- `notes` (text)
- `vitals_json` (jsonb)
- `created_at` (timestamp)

## reviews

- `id` (uuid, pk)
- `booking_id` (uuid, fk -> bookings.id, unique)
- `user_id` (uuid, fk -> users.id)
- `caregiver_id` (uuid, fk -> caregivers.id)
- `rating` (int, 1-5)
- `comment` (text)
- `created_at` (timestamp)

## complaints

- `id` (uuid, pk)
- `booking_id` (uuid, fk -> bookings.id)
- `raised_by_user_id` (uuid, fk -> users.id)
- `category` (varchar)
- `description` (text)
- `status` (enum: OPEN, IN_REVIEW, RESOLVED, ESCALATED)
- `resolution_notes` (text)
- `updated_by_admin_id` (uuid, fk -> users.id)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## notifications

- `id` (uuid, pk)
- `user_id` (uuid, fk -> users.id)
- `channel` (enum: EMAIL, SMS, IN_APP)
- `title` (varchar)
- `message` (text)
- `is_read` (boolean)
- `sent_at` (timestamp)

## Index Recommendations

- `users(email)`
- `caregivers(verification_status, service_area_city)`
- `bookings(user_id, status)`
- `bookings(caregiver_id, status)`
- `bookings(schedule_start)`
- `reviews(caregiver_id, rating)`

