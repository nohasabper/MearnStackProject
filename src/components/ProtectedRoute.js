// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ requiredRole }) => {
    const { user, token } = useSelector((state) => state.auth);

    if (!token || !user) {
        // Not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Does not have the required role
        return <Navigate to="/" replace />;
    }

    // Authorized
    return <Outlet />;
};

export default ProtectedRoute;
