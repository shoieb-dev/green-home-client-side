import moment from "moment";
import { FaBook, FaHome, FaRedo, FaStar, FaUsers } from "react-icons/fa";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Constants
const CHART_COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];
const CHART_HEIGHT = 300;

const STATUS_COLORS = {
    approved: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
    cancelled: "text-gray-600",
};

const STAT_CARDS_CONFIG = [
    {
        label: "Total Houses",
        key: "totalHouses",
        color: "bg-emerald-500",
        icon: FaHome,
        description: "Number of apartments listed",
    },
    {
        label: "Total Bookings",
        key: "totalBookings",
        color: "bg-lime-500",
        icon: FaBook,
        description: "Apartments booked by users",
    },
    {
        label: "Total Users",
        key: "totalUsers",
        color: "bg-amber-500",
        icon: FaUsers,
        description: "Registered users",
    },
    {
        label: "Total Reviews",
        key: "totalReviews",
        color: "bg-rose-500",
        icon: FaStar,
        description: "Reviews submitted by users",
    },
];

/**
 * Stat Card Component
 */
const StatCard = ({ label, value, color, Icon, description }) => (
    <div
        className={`p-6 rounded-lg shadow-lg text-white ${color} flex flex-col justify-between transition-transform hover:scale-105`}
        role="region"
        aria-label={`${label}: ${value}`}
    >
        <div className="flex items-center justify-center gap-3 mb-4">
            <Icon size={24} aria-hidden="true" />
            <h2 className="text-xl font-semibold">{label}</h2>
        </div>
        <p className="text-3xl font-bold">{value || 0}</p>
        <p className="text-sm mt-1 opacity-90">{description}</p>
    </div>
);

/**
 * Empty State Component
 */
const EmptyState = ({ title, description }) => (
    <div className="bg-white p-8 rounded-lg shadow text-center">
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
);

/**
 * Booking Card for Mobile View
 */
const BookingCard = ({ booking }) => (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
            <p>
                <strong className="text-gray-700">Name:</strong> {booking.name}
            </p>
            <p>
                <strong className="text-gray-700">Email:</strong>{" "}
                <a href={`mailto:${booking.email}`} className="text-blue-600 hover:underline">
                    {booking.email}
                </a>
            </p>
            <p>
                <strong className="text-gray-700">House:</strong> {booking.house}
            </p>
            <p>
                <strong className="text-gray-700">Price:</strong> ${booking.price}
            </p>
            <p>
                <strong className="text-gray-700">Phone:</strong>{" "}
                <a href={`tel:${booking.phone}`} className="text-blue-600 hover:underline">
                    {booking.phone}
                </a>
            </p>
            <p>
                <strong className="text-gray-700">Booked At:</strong> {moment(booking.bookedAt).format("MMM DD, YYYY")}
            </p>
            <p>
                <strong className="text-gray-700">Status:</strong>{" "}
                <span className={`capitalize font-semibold ${STATUS_COLORS[booking.status] || "text-gray-600"}`}>
                    {booking.status}
                </span>
            </p>
        </div>
    </div>
);

/**
 * User Card for Mobile View
 */
const UserCard = ({ user }) => (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
            <p>
                <strong className="text-gray-700">Name:</strong> {user.displayName || "N/A"}
            </p>
            <p>
                <strong className="text-gray-700">Email:</strong>{" "}
                <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                </a>
            </p>
            <p>
                <strong className="text-gray-700">Role:</strong>{" "}
                <span className="capitalize">{user.role || "User"}</span>
            </p>
        </div>
    </div>
);

/**
 * Section Header with optional refresh button
 */
const SectionHeader = ({ title, onRefresh }) => (
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {onRefresh && (
            <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                aria-label="Refresh data"
            >
                <FaRedo size={14} />
                <span>Refresh</span>
            </button>
        )}
    </div>
);

/**
 * Main Admin Dashboard Component
 */
const AdminDashboard = ({ data, onRefresh }) => {
    // Extract data with defaults
    const totals = data?.totals || {};
    const bookingStatusSummary = data?.bookingStatusSummary || {};
    const popularHouses = data?.popularHouses || [];
    const recentBookings = data?.recentBookings || [];
    const recentUsers = data?.recentUsers || [];

    // Transform data for charts
    const bookingPieData = Object.entries(bookingStatusSummary).map(([status, value]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value,
    }));

    const popularHouseData = popularHouses.map((house) => ({
        name: house.name || house._id || "Unknown",
        Bookings: house.count || 0,
    }));

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header with refresh */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        aria-label="Refresh all data"
                    >
                        <FaRedo size={16} />
                        <span>Refresh All</span>
                    </button>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {STAT_CARDS_CONFIG.map((config) => (
                    <StatCard
                        key={config.key}
                        label={config.label}
                        value={totals[config.key]}
                        color={config.color}
                        Icon={config.icon}
                        description={config.description}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Booking Status Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Status Distribution</h2>
                    {bookingPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                            <PieChart>
                                <Pie
                                    data={bookingPieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {bookingPieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            <p>No booking status data available</p>
                        </div>
                    )}
                </div>

                {/* Popular Houses Bar Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Most Popular Houses</h2>
                    {popularHouseData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                            <BarChart data={popularHouseData}>
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Bookings" fill="#4ade80" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            <p>No popular house data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Bookings Section */}
            <div className="mb-8">
                <SectionHeader title="Recent Bookings" />

                {recentBookings.length > 0 ? (
                    <>
                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-4">
                            {recentBookings.map((booking) => (
                                <BookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            House
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Price
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Phone
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Booked At
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking) => (
                                        <tr
                                            key={booking._id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-left">{booking.name}</td>
                                            <td className="px-4 py-3 text-left">
                                                <a
                                                    href={`mailto:${booking.email}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {booking.email}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-center">{booking.house}</td>
                                            <td className="px-4 py-3 text-center font-semibold">${booking.price}</td>
                                            <td className="px-4 py-3 text-center">
                                                <a
                                                    href={`tel:${booking.phone}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {booking.phone}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {moment(booking.bookedAt).format("MMM DD, YYYY")}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                                                        STATUS_COLORS[booking.status] || "text-gray-600"
                                                    } bg-opacity-10`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <EmptyState
                        title="No Recent Bookings"
                        description="There are no recent bookings to display at this time."
                    />
                )}
            </div>

            {/* Recent Users Section */}
            <div className="mb-8">
                <SectionHeader title="Recent Users" />

                {recentUsers.length > 0 ? (
                    <>
                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-4">
                            {recentUsers.map((user) => (
                                <UserCard key={user._id} user={user} />
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-left">{user.displayName || "N/A"}</td>
                                            <td className="px-4 py-3 text-left">
                                                <a
                                                    href={`mailto:${user.email}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {user.email}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-left capitalize">{user.role || "User"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <EmptyState
                        title="No Recent Users"
                        description="There are no recent users to display at this time."
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
