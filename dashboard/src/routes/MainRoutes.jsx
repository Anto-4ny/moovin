import React, { lazy } from 'react';
import ProtectedRoute from '../component/ProtectedRoute';

// project import
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'component/Loadable';

// Auth pages
const AuthLogin = Loadable(lazy(() => import('../views/Login')));
const AuthRegister = Loadable(lazy(() => import('../views/Register')));

// Dashboards by role
const AdminDashboard = Loadable(lazy(() => import('views/Dashboard/AdminDashboard')));
const TenantDashboard = Loadable(lazy(() => import('views/Dashboard/TenantDashboard')));
const LandlordDashboard = Loadable(lazy(() => import('views/Dashboard/LandlordDashboard')));

// Tenant-specific
const BookProperty = Loadable(lazy(() => import('views/Tenant/BookProperty')));
const BookRepair = Loadable(lazy(() => import('views/Tenant/BookRepair')));
const TrackRepair = Loadable(lazy(() => import('views/Tenant/TrackRepair')));

// Landlord-specific
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
      // Admin Dashboard
      {
        path: '/dashboard/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },

      // Tenant Dashboard + Features
      {
        path: '/dashboard/tenant',
        element: (
          <ProtectedRoute allowedRoles={['tenant']}>
            <TenantDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/book-property',
        element: (
          <ProtectedRoute allowedRoles={['tenant']}>
            <BookProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/book-repair',
        element: (
          <ProtectedRoute allowedRoles={['tenant']}>
            <BookRepair />
          </ProtectedRoute>
        )
      },
      {
        path: '/track-repair',
        element: (
          <ProtectedRoute allowedRoles={['tenant']}>
            <TrackRepair />
          </ProtectedRoute>
        )
      },

      // Landlord Dashboard + Features
      {
        path: '/dashboard/landlord',
        element: (
          <ProtectedRoute allowedRoles={['landlord']}>
            <LandlordDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/manage-property',
        element: (
          <ProtectedRoute allowedRoles={['landlord']}>
            <ManageProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/add-property',
        element: (
          <ProtectedRoute allowedRoles={['landlord']}>
            <AddProperty />
          </ProtectedRoute>
        )
      },
      {
        path: '/edit-property/:id',
        element: (
          <ProtectedRoute allowedRoles={['landlord']}>
            <EditProperty />
          </ProtectedRoute>
        )
      }
    ]
  }
];

export default MainRoutes;