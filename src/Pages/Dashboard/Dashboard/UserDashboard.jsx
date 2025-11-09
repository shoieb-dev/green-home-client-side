import moment from "moment";
import { FaBook, FaHome, FaRedo, FaStar } from "react-icons/fa";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Constants
const CHART_COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];
const CHART_HEIGHT = 250;

const STATUS_COLORS = {
    approved: "text-green-600 bg-green-50",
    pending: "text-yellow-600 bg-yellow-50",
    rejected: "text-red-600 bg-red-50",
    cancelled: "text-gray-600 bg-gray-50",
};

/**
 * Stat Card Component for User Stats
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
const EmptyState = ({ title, description, icon: Icon = FaHome }) => (
    <div className="bg-white p-8 rounded-lg shadow text-center">
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-3" aria-hidden="true" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

/**
 * Booking Card for Mobile View
 */
const BookingCard = ({ booking }) => (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
            <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-900">{booking.house}</p>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        STATUS_COLORS[booking.status] || "text-gray-600 bg-gray-50"
                    }`}
                >
                    {booking.status}
                </span>
            </div>
            <p className="text-sm text-gray-600">
                <strong>Price:</strong> <span className="text-green-600 font-semibold">${booking.price}</span>
            </p>
            <p className="text-sm text-gray-600">
                <strong>Booked:</strong> {moment(booking.bookedAt).format("MMM DD, YYYY")}
            </p>
        </div>
    </div>
);

/**
 * House Card for Recommended Houses
 */
const HouseCard = ({ house }) => (
    <div className="border-b last:border-b-0 py-3 hover:bg-gray-50 transition-colors rounded px-2">
        <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{house.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{house.address}</p>
                {house.price && <p className="text-sm font-semibold text-green-600 mt-1">${house.price}</p>}
            </div>
            {house.rating && (
                <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar size={14} />
                    <span className="text-sm font-semibold text-gray-700">{house.rating}</span>
                </div>
            )}
        </div>
    </div>
);

/**
 * Section Header Component
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
 * Main User Dashboard Component
 */
const UserDashboard = ({ data, onRefresh }) => {
    // Extract data with defaults
    const myTotals = data?.totals || {};
    const myBookingStatus = data?.myBookingStatus || {};
    const myRecentBookings = data?.recentBookings || [];
    const recommendedHouses = data?.recommendedHouses || [];

    // Transform data for pie chart
    const bookingPieData = Object.entries(myBookingStatus)
        .filter(([_, value]) => value > 0)
        .map(([status, value]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value,
        }));

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header with refresh */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        aria-label="Refresh all data"
                    >
                        <FaRedo size={16} />
                        <span>Refresh</span>
                    </button>
                )}
            </div>

            {/* My Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                    label="My Bookings"
                    value={myTotals.myBookings}
                    color="bg-emerald-500"
                    Icon={FaBook}
                    description="Total bookings you've made"
                />
                <StatCard
                    label="My Reviews"
                    value={myTotals.myReviews}
                    color="bg-amber-500"
                    Icon={FaStar}
                    description="Reviews you've submitted"
                />
            </div>

            {/* Booking Status Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">My Booking Status</h2>
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
                        <div className="text-center">
                            <FaBook className="mx-auto h-12 w-12 mb-3" />
                            <p>No booking status data available</p>
                            <p className="text-sm mt-1">Start booking to see your statistics</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Bookings Section */}
            <div className="mb-8">
                <SectionHeader title="My Recent Bookings" />

                {myRecentBookings.length > 0 ? (
                    <>
                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {myRecentBookings.map((booking) => (
                                <BookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            House
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Price
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
                                    {myRecentBookings.map((booking) => (
                                        <tr
                                            key={booking._id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-left font-medium">{booking.house}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-green-600">
                                                ${booking.price}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {moment(booking.bookedAt).format("MMM DD, YYYY")}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                                        STATUS_COLORS[booking.status] || "text-gray-600 bg-gray-50"
                                                    }`}
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
                        title="No Bookings Yet"
                        description="You haven't made any bookings yet. Start exploring houses to make your first booking!"
                        icon={FaBook}
                    />
                )}
            </div>

            {/* Recommended Houses Section */}
            <div className="mb-8">
                <SectionHeader title="Recommended Houses" />

                {recommendedHouses.length > 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="space-y-1">
                            {recommendedHouses.map((house) => (
                                <HouseCard key={house._id} house={house} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        title="No Recommendations"
                        description="We don't have any house recommendations for you at the moment. Check back later!"
                        icon={FaHome}
                    />
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
