import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from './util/auth';

const ProtectedRoute = ({ element: Component }) => {
    const isAuthenticated = !!getAuthToken();

    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;