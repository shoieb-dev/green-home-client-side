import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader/Loader";
import useAuth from "../../../hooks/useAuth";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
    const { admin } = useAuth();
    const { axiosInstance } = useAxiosInstance();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get(API_ENDPOINTS.dashboardSummary)
            .then((res) => setData(res?.data?.data || {}))
            .catch((err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            })
            .finally(() => setLoading(false));
    }, [axiosInstance]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            {admin ? <AdminDashboard data={data} loading={loading} /> : <UserDashboard data={data} loading={loading} />}
        </div>
    );
};

export default Dashboard;
