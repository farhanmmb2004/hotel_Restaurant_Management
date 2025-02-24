import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute component to protect routes that require authentication
 * and optionally specific user roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Optional array of roles allowed to access the route
 * @param {string} [props.redirectPath] - Optional path to redirect to if unauthorized (defaults to /login)
 */
export const PrivateRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectPath = '/login' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state or spinner while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the location they were trying to go to for a redirect after login
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have required role, redirect to unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default PrivateRoute;