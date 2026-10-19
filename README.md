# Univents — University Event Management Portal

**Tagline:** One Campus. Every Event.  
**Stack:** React 19, Vite, React Router 7, Context API, Vanilla CSS Design System, versioned `localStorage`.

---

## 🚀 Overview

Univents centralizes campus event discovery, student registration, organizer event creation, and administrative event moderation in a single responsive, indigo-and-white SaaS application.

The entire application runs **100% frontend-only in the browser** without requiring an external backend or database. All records (events, demo accounts, registrations, saved bookmarks, categories, and notifications) persist across browser refreshes via versioned `localStorage` keys (`univents:v1:*`).

---

## 👥 Simulated Roles & Demo Credentials

Univents provides 1-click demo login buttons directly on the **Sign In** screen (`/login`):

| Role | Demo User | Email | Password | Permissions & Workflow |
|---|---|---|---|---|
| **Student** | Alex Rivera | `alex.rivera@university.edu` | `password123` | Explore events, save bookmarks, register, cancel, review registration history, in-app notifications, and view/print attendance certificates. |
| **Organizer** | Elena Rostova | `elena.rostova@university.edu` | `password123` | Draft events, upload custom banners, submit proposals to admin review, manage attendees, check in attendance, and export participant CSVs. |
| **Administrator** | Dr. Marcus Vance | `marcus.vance@university.edu` | `password123` | Platform oversight metrics, approve or reject proposals with mandatory feedback, cancel events, and manage category taxonomies. |

*Note: All credentials and student records are fictional demo data.*

---

## 🛠️ Key Features

- **P0 / Critical Foundation:**
  - Simulated Authentication & Signup (restricted to Student role).
  - Role-based navigation guards and simulated password reset.
  - Reset Demo Data button (available in both navigation header and footer) to restore factory seed data at any time.
  - Persistent Dark / Light Mode.
- **Event Discovery:**
  - Live full-text search across titles, descriptions, venues, and topic tags.
  - Multi-criteria filter sidebar: Category, Schedule (upcoming, this week, this month, past), Ticket Price (free vs paid), and Seat Availability (seats open vs full).
  - Dynamic sorting (Soonest upcoming, Newest added, Title, Capacity).
- **Student Workflows:**
  - Real-time seat reservation with instant confirmation codes (`UV-XXXXX`).
  - Strict validation preventing double-registration, expired deadlines, full-capacity events, or registrations for unapproved drafts.
  - Pre-event cancellation releasing capacity in real-time.
  - Printable / Downloadable Sample Attendance Certificates for verified attended events.
- **Organizer Workflows:**
  - Event editor supporting drafts, agenda timelines, preset banners, and custom image uploads (&lt;300KB with preview).
  - Resubmission workflow for rejected events with admin feedback notes.
  - Attendee roster with 1-click check-in toggle.
  - One-click native CSV attendee export.
- **Admin Moderation:**
  - Real-time pending submission queue with full inspection modal.
  - Approve & Publish (immediately visible to students).
  - Reject with mandatory feedback (notifies organizer).
  - Category manager (create, edit, and toggle active status).

---

## 🏃 Getting Started & Development

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

---

## 📋 Recommended Demonstration Walkthrough

1. **Homepage Discovery:** Open `/` and search for *"Hackathon"*. Click on the card to open its detail page.
2. **Student Registration:** Click **Register Now**, which redirects to `/login`. Click the **1-Click Student (Alex Rivera)** button. Return to the event and click **Register for Event**. Notice the confirmation code `UV-XXXXX` and the in-app notification.
3. **Persistence Verification:** Refresh the browser. Confirm that the student session and registration status persist without data loss.
4. **Organizer Event Creation:** Switch to the Organizer account (sign out or switch via `/login`). Go to **Create New Event**, fill out details, choose a banner, and click **Submit for Admin Review**.
5. **Admin Moderation:** Switch to the Administrator account. Navigate to **Review Queue**, inspect the newly submitted event, and click **Approve & Publish**.
6. **Public Visibility:** Return to `/events`. Confirm that the newly approved event is now visible to all students.
7. **Attendee Export:** Return to the Organizer dashboard, click **Attendees** on any event, toggle attendance check-in, and click **Export CSV Roster**.
8. **Reset Demo Data:** Click the **Reset Demo** icon in the navigation bar to restore the database to its pristine sample state.
