import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken, removeAuthToken } from './util/auth';

const ProtectedRoute = ({ element: Component }) => {
    const isAuthenticated = !!getAuthToken();

    useEffect(() => {
        if (!isAuthenticated) {
            removeAuthToken(); // 만약 토큰이 없다면 제거
        }
    }, [isAuthenticated]);

    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;