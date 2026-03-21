import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import TenantAuth from '../pages/TenantAuth.jsx';
import OwnerAuth from '../pages/OwnerAuth.jsx';
import TenantDashboard from '../pages/TenantDashboard.jsx';
import OwnerDashboard from '../pages/OwnerDashboard.jsx';
import TenantProfile from '../pages/TenantProfile.jsx';
import TenantPropertyDetails from '../pages/TenantPropertyDetails.jsx';
import AddProperty from '../pages/AddProperty.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import AdminLogin from '../pages/AdminLogin.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';

// Centralized route configuration
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tenant" element={<TenantAuth />} />
      <Route path="/owner" element={<OwnerAuth />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Example protected dashboard routes (to be wired with backend later) */}
      <Route
        path="/tenant/dashboard"
        element={
          <ProtectedRoute role="tenant">
            <TenantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tenant/property/:propertyId"
        element={
          <ProtectedRoute role="tenant">
            <TenantPropertyDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tenant/profile"
        element={
          <ProtectedRoute role="tenant">
            <TenantProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute role="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/add-property"
        element={
          <ProtectedRoute role="owner">
            <AddProperty />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

