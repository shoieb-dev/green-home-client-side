import React from "react";
import { Spinner } from "react-bootstrap";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <Spinner animation="border" variant="danger" />;
    }

    return user?.email ? (
        children || <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

export default PrivateRoute;
