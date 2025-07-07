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

// Dashboard Pages
const AdminDashboard = Loadable(lazy(() => import('views/Dashboard/AdminDashboard')));
const TenantDashboard = Loadable(lazy(() => import('views/Dashboard/TenantDashboard')));
const LandlordDashboard = Loadable(lazy(() => import('views/Dashboard/LandlordDashboard')));

// Admin Pages
const PropertyGrid = Loadable(lazy(() => import('views/Admin/PropertyGrid')));
const DashboardTables = Loadable(lazy(() => import('views/Admin/DashboardTables')));

// Tenant Pages
const BookProperty = Loadable(lazy(() => import('views/Tenant/BookProperty')));
const BookRepair = Loadable(lazy(() => import('views/Tenant/BookRepair')));
const TrackRepair = Loadable(lazy(() => import('views/Tenant/TrackRepair')));

// Landlord Pages
const ManageProperty = Loadable(lazy(() => import('views/Landlord/ManageProperty')));
const AddProperty = Loadable(lazy(() => import('views/Landlord/AddProperty')));
const EditProperty = Loadable(lazy(() => import('views/Landlord/EditProperty')));

const MainRoutes = [
  {
    path: '/',
    element: <MinimalLayout />,
    children: [
      { path: '/', element: <AuthLogin /> },
      { path: '/application/login', element: <AuthLogin /> },
      { path: '/application/register', element: <AuthRegister /> }
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
        path: '/property-grid',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <PropertyGrid />
          </ProtectedRoute>
        )
      },
            {
        path: '/dashboard-tables',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardTables />
          </ProtectedRoute>
        )
      },

      // ------------------------ Tenant Routes ------------------------
      {
        path: '/dashboard/tenant',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <TenantDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/book-property',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <BookProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/book-repair',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <BookRepair />
          </ProtectedRoute>
        )
      },
      {
        path: '/track-repair',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <TrackRepair />
          </ProtectedRoute>
        )
      },
      {
        path: '/payment/:id',
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
        path: '/manage-property',
        element: (
          <ProtectedRoute allowedRoles={['landlord', 'admin']}>
            <ManageProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/add-property',
        element: (
          <ProtectedRoute allowedRoles={['landlord', 'admin']}>
            <AddProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/edit-property/:id',
        element: (
          <ProtectedRoute allowedRoles={['landlord', 'admin']}>
            <EditProperty />
          </ProtectedRoute>
        )
      },
            {
        path: '/professionals-directory',
        element: (
          <ProtectedRoute allowedRoles={['tenant', 'admin', 'landlord']}>
            <ProfessionalDirectory />
          </ProtectedRoute>
        )
      },
                  {
        path: '/professionals-application',
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
