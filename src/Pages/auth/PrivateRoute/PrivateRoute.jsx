import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import useAuth from "../../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, isCheckingUser } = useAuth();
    const location = useLocation();

    if (isCheckingUser) {
        return <Loader />;
    }

    // Only allow verified users
    return user?.email ? children || <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
