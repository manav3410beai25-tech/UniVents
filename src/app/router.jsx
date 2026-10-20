import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts & Guards
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { DashboardLayout } from '../components/layout/DashboardLayout.jsx';
import { ProtectedRoute, AccessDeniedPage, NotFoundPage } from './guards.jsx';

// Public & Auth Pages
import { HomePage } from '../features/events/HomePage.jsx';
import { ExploreEventsPage } from '../features/events/ExploreEventsPage.jsx';
import { EventDetailsPage } from '../features/events/EventDetailsPage.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { SignupPage } from '../features/auth/SignupPage.jsx';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage.jsx';
import { ProfilePage } from '../features/auth/ProfilePage.jsx';

// Student Pages
import { StudentDashboard } from '../features/student/StudentDashboard.jsx';
import { RegistrationHistoryPage } from '../features/student/RegistrationHistoryPage.jsx';
import { SavedEventsPage } from '../features/student/SavedEventsPage.jsx';
import { NotificationsPage } from '../features/student/NotificationsPage.jsx';

// Organizer Pages
import { OrganizerDashboard } from '../features/organizer/OrganizerDashboard.jsx';
import { ManageEventsPage as OrganizerManageEventsPage } from '../features/organizer/ManageEventsPage.jsx';
import { EventEditorPage } from '../features/organizer/EventEditorPage.jsx';
import { AttendeeManagementPage } from '../features/organizer/AttendeeManagementPage.jsx';

// Admin Pages
import { AdminDashboard } from '../features/admin/AdminDashboard.jsx';
import { EventReviewPage } from '../features/admin/EventReviewPage.jsx';
import { AdminManageEventsPage } from '../features/admin/ManageEventsPage.jsx';
import { CategoryManagerPage } from '../features/admin/CategoryManagerPage.jsx';

export const router = createBrowserRouter([
  // Public Route Tree
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events', element: <ExploreEventsPage /> },
      { path: 'events/:eventId', element: <EventDetailsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: '403', element: <AccessDeniedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Student Dashboard Routes
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/student/dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'registrations', element: <RegistrationHistoryPage /> },
      { path: 'saved', element: <SavedEventsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
    ],
  },

  // Organizer Dashboard Routes
  {
    path: '/organizer',
    element: (
      <ProtectedRoute allowedRoles={['organizer']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/organizer/dashboard" replace /> },
      { path: 'dashboard', element: <OrganizerDashboard /> },
      { path: 'events', element: <OrganizerManageEventsPage /> },
      { path: 'events/new', element: <EventEditorPage /> },
      { path: 'events/:eventId/edit', element: <EventEditorPage /> },
      { path: 'events/:eventId/attendees', element: <AttendeeManagementPage /> },
    ],
  },

  // Admin Dashboard Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'review', element: <EventReviewPage /> },
      { path: 'events', element: <AdminManageEventsPage /> },
      { path: 'categories', element: <CategoryManagerPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL });
