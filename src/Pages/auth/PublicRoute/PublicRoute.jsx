import { Navigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import useAuth from "../../../hooks/useAuth";

const PublicRoute = ({ children }) => {
    const { user, isCheckingUser } = useAuth();

    if (isCheckingUser) return <Loader />;

    // If logged in, redirect to dashboard (or home)
    return user?.email ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
