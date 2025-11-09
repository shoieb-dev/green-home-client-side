import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader/Loader";
import useAuth from "../../../hooks/useAuth";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

/**
 * Main Dashboard component that renders different views based on user role
 * Fetches dashboard summary data and displays appropriate dashboard
 */
const Dashboard = () => {
    const { admin } = useAuth();
    const { axiosInstance } = useAxiosInstance();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches dashboard summary data from API
     * Includes error handling and cleanup for unmounted components
     */
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_ENDPOINTS.dashboardSummary);
            const dashboardData = response?.data?.data;

            // Validate that we received data
            if (!dashboardData) {
                throw new Error("No dashboard data received from server");
            }

            setData(dashboardData);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to load dashboard data";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Dashboard data fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [axiosInstance]);

    /**
     * Fetch data on component mount
     */
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await fetchDashboardData();
            }
        };

        loadData();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [fetchDashboardData]);

    /**
     * Retry handler for failed requests
     */
    const handleRetry = () => {
        fetchDashboardData();
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    // Error state with retry option
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load dashboard</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
                <button
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Try Again
                </button>
            </div>
        );
    }

    // Empty state (optional - if you want to handle empty data differently)
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No dashboard data available</h3>
                    <p className="mt-1 text-sm text-gray-500">There is no data to display at the moment.</p>
                </div>
            </div>
        );
    }

    // Render appropriate dashboard based on user role
    return (
        <div>
            {admin ? (
                <AdminDashboard data={data} onRefresh={fetchDashboardData} />
            ) : (
                <UserDashboard data={data} onRefresh={fetchDashboardData} />
            )}
        </div>
    );
};

export default Dashboard;
