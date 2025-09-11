import moment from "moment";
import { Spinner } from "react-bootstrap";
import { FaBook, FaHome, FaStar, FaUsers } from "react-icons/fa";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];

const AdminDashboard = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // ====== ADMIN DATA ======
    const totals = data.totals || {};
    const bookingStatusSummary = data.bookingStatusSummary || {};
    const popularHouses = data.popularHouses || [];
    const recentBookings = data.recentBookings || [];
    const recentUsers = data.recentUsers || [];

    // Pie chart data for admin/user booking status
    const bookingPieData = Object.entries(bookingStatusSummary).map(([status, value]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value,
    }));

    // Bar chart for admin only
    const popularHouseData = popularHouses.map((house) => ({
        name: house._id,
        Bookings: house.count,
    }));

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
                {[
                    {
                        label: "Total Houses",
                        value: totals.totalHouses,
                        color: "bg-blue-500",
                        icon: <FaHome size={24} />,
                        description: "Number of apartments listed",
                    },
                    {
                        label: "Total Bookings",
                        value: totals.totalBookings,
                        color: "bg-green-500",
                        icon: <FaBook size={24} />,
                        description: "Apartments booked by users",
                    },
                    {
                        label: "Total Users",
                        value: totals.totalUsers,
                        color: "bg-yellow-500",
                        icon: <FaUsers size={24} />,
                        description: "Registered users",
                    },
                    {
                        label: "Total Reviews",
                        value: totals.totalReviews,
                        color: "bg-red-500",
                        icon: <FaStar size={24} />,
                        description: "Reviews submitted by users",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className={`p-6 rounded-lg shadow-lg text-white ${stat.color} flex flex-col justify-between`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {stat.icon}
                            <h2 className="text-xl font-semibold">{stat.label}</h2>
                        </div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm mt-1">{stat.description}</p>
                    </div>
                ))}
            </div>

            {/* Booking Status Pie & Popular Houses Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={bookingPieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                                {bookingPieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Popular Houses</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={popularHouseData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Bookings" fill="#4ade80" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold pb-4">Recent Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2 text-center">House</th>
                                <th className="px-4 py-2 text-center">Price</th>
                                <th className="px-4 py-2 text-center">Phone</th>
                                <th className="px-4 py-2 text-center">Booked At</th>
                                <th className="px-4 py-2 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((booking) => (
                                <tr
                                    key={booking._id}
                                    className="text-center border border-gray-200 hover:bg-gray-100 transition"
                                >
                                    <td className="px-4 py-2 text-left">{booking.name}</td>
                                    <td className="px-4 py-2 text-left">{booking.email}</td>
                                    <td className="px-4 py-2">{booking.house}</td>
                                    <td className="px-4 py-2">${booking.price}</td>
                                    <td className="px-4 py-2">{booking.phone}</td>
                                    <td className="px-4 py-2">{moment(booking.bookedAt).format("DD-MM-YYYY")}</td>
                                    <td
                                        className={`px-4 py-2 font-semibold capitalize ${
                                            booking.status === "approved" ? "text-green-600" : "text-yellow-600"
                                        }`}
                                    >
                                        {booking.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Users */}
            <div>
                <h2 className="text-2xl font-bold pb-4">Recent Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user) => (
                                <tr key={user._id} className="border border-gray-200 hover:bg-gray-100 transition">
                                    <td className="px-4 py-2">{user.displayName}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2 capitalize">{user.role || "user"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
