import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminGuard({ children }) {
    const user = JSON.parse(localStorage.getItem('authUser'));
    const navigate = useNavigate();
    const isAdmin = user && user.isAdmin;

    useEffect(() => {
        if (!isAdmin) {
            // Redirect to '/dashboard' if user is not an admin
            navigate('/dashboard');
        }
    }, [isAdmin, navigate]);

    return isAdmin ? <>{children}</> : null;
}

export default AdminGuard;
