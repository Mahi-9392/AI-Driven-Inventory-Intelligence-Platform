import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';
import GoogleErrorPage from '../pages/auth/GoogleErrorPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import ForecastsPage from '../pages/forecasts/ForecastsPage';
import Layout from '../layout/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: '/auth/google/success',
    element: <GoogleCallbackPage />,
  },
  {
    path: '/auth/google/error',
    element: <GoogleErrorPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/inventory',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <InventoryPage />,
      },
    ],
  },
  {
    path: '/forecasts',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ForecastsPage />,
      },
    ],
  },
]);

