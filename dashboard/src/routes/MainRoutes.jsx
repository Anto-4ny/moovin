import React, { lazy } from 'react';
import ProtectedRoute from '../component/ProtectedRoute';

// Layouts
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';

// Utilities
import Loadable from 'component/Loadable';
import PaymentPage from 'component/PaymentPage';
import ProfessionalDirectory from 'component/ProfessionalDirectory';
import ProfessionalApplication from 'component/ProfessionalApplication';

// Auth Pages
const AuthLogin = Loadable(lazy(() => import('../views/Login')));
const AuthRegister = Loadable(lazy(() => import('../views/Register')));
import ForgotPassword from '../views/ForgotPassword';
import ResetPasswordConfirm from '../views/ResetPasswordConfirm';

// Dashboard Pages
const AdminDashboard = Loadable(lazy(() => import('views/Dashboard/AdminDashboard')));
const TenantDashboard = Loadable(lazy(() => import('views/Dashboard/TenantDashboard')));
const LandlordDashboard = Loadable(lazy(() => import('views/Dashboard/LandlordDashboard')));

// Admin Pages
const PropertyGrid = Loadable(lazy(() => import('views/Admin/PropertyGrid')));
const DashboardTables = Loadable(lazy(() => import('views/Admin/DashboardTables')));

// Tenant Pages
const BookProperty = Loadable(lazy(() => import('views/Tenant/BookProperty')));

// Landlord Pages
const ManageProperty = Loadable(lazy(() => import('views/Landlord/ManageProperty')));
const AddProperty = Loadable(lazy(() => import('views/Landlord/AddProperty')));
const EditProperty = Loadable(lazy(() => import('views/Landlord/EditProperty')));

const MainRoutes = [
  {
    path: '/',
    element: <MinimalLayout />,
    children: [
      { path: '/dashboard', element: <AuthLogin /> },
      { path: '/dashboard/application/login', element: <AuthLogin /> },
      { path: '/dashboard/application/register', element: <AuthRegister /> },
      { path: '/dashboard/forgot-password', element: <ForgotPassword /> },
      { path: '/dashboard/password/reset/confirm/:uid/:token', element: <ResetPasswordConfirm /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // ------------------------ Admin Routes ------------------------
      {
        path: '/dashboard/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/property-grid',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <PropertyGrid />
          </ProtectedRoute>
        )
      },
            {
        path: '/dashboard/dashboard-tables',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardTables />
          </ProtectedRoute>
        )
      },

      // ------------------------ Tenant Routes ------------------------
      {
        path: '/dashboard/dashboard/tenant',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <TenantDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/book-property',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <BookProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/payment/:id',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <PaymentPage />
          </ProtectedRoute>
        )
      },

      // ------------------------ Landlord Routes ------------------------
      {
        path: '/dashboard/landlord',
        element: (
          <ProtectedRoute allowedRoles={['landlord', 'admin']}>
            <LandlordDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/manage-property',
        element: (
          <ProtectedRoute allowedRoles={['landlord', 'admin']}>
            <ManageProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/add-property',
        element: (
          <ProtectedRoute allowedRoles={['landlord', 'admin']}>
            <AddProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/edit-property/:id',
        element: (
          <ProtectedRoute allowedRoles={['landlord', 'admin']}>
            <EditProperty />
          </ProtectedRoute>
        )
      },
            {
        path: '/dashboard/professionals-directory',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin', 'landlord']}>
            <ProfessionalDirectory />
          </ProtectedRoute>
        )
      },
                  {
        path: '/dashboard/professionals-application',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin', 'landlord']}>
            <ProfessionalApplication />
          </ProtectedRoute>
        )
      },
    ]
  }
];

export default MainRoutes;
