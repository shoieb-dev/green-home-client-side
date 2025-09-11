import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaBook, FaHome, FaStar, FaUsers } from "react-icons/fa";
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
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const totals = data.totals || {};
    const bookingStatusSummary = data.bookingStatusSummary || {};
    const popularHouses = data.popularHouses || [];
    const recentUsers = data.recentUsers || [];

    const stats = [
        {
            label: "Total Houses",
            value: totals.totalHouses,
            color: "bg-blue-500",
            icon: <FaHome size={24} />,
            description: "Number of apartments listed",
            chartData: popularHouses.map((house, idx) => ({
                value: house.count,
                idx,
            })),
        },
        {
            label: "Total Bookings",
            value: totals.totalBookings,
            color: "bg-green-500",
            icon: <FaBook size={24} />,
            description: "Apartments booked by users",
            chartData: Object.values(bookingStatusSummary).map((v, idx) => ({
                value: v,
                idx,
            })),
        },
        {
            label: "Total Users",
            value: totals.totalUsers,
            color: "bg-yellow-500",
            icon: <FaUsers size={24} />,
            description: "Registered users",
            chartData: recentUsers.map((_, idx) => ({ value: idx + 1, idx })),
        },
        {
            label: "Total Reviews",
            value: totals.totalReviews,
            color: "bg-red-500",
            icon: <FaStar size={24} />,
            description: "Reviews submitted by users",
            chartData: [],
        },
    ];

    // Pie chart data for booking status
    const bookingPieData = Object.entries(bookingStatusSummary).map(([status, value]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value,
    }));

    // Bar chart data for popular houses
    const popularHouseData = popularHouses.map((house) => ({
        name: house._id,
        Bookings: house.count,
    }));

    return (
        <div>
            {admin ? <AdminDashboard data={data} loading={loading} /> : <UserDashboard data={data} loading={loading} />}
        </div>
    );
};

export default Dashboard;
