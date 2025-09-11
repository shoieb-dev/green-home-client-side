import moment from "moment";
import { Spinner } from "react-bootstrap";
import { FaBook, FaStar } from "react-icons/fa";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];

const UserDashboard = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // ====== USER DATA ======
    const myTotals = data.totals || {};
    const myBookingStatus = data.myBookingStatus || {};
    const myRecentBookings = data.recentBookings || [];
    const recommendedHouses = data.recommendedHouses || [];

    // Pie chart data for admin/user booking status
    const bookingPieData = Object.entries(myBookingStatus).map(([status, value]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value,
    }));

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* My Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="p-6 rounded-lg shadow-lg bg-green-500 text-white">
                    <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                        <FaBook /> My Bookings
                    </h2>
                    <p className="text-3xl font-bold">{myTotals.myBookings}</p>
                    <p className="text-sm mt-1">Total bookings you’ve made</p>
                </div>

                <div className="p-6 rounded-lg shadow-lg bg-yellow-500 text-white">
                    <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                        <FaStar /> My Reviews
                    </h2>
                    <p className="text-3xl font-bold">{myTotals.myReviews}</p>
                    <p className="text-sm mt-1">Reviews you’ve submitted</p>
                </div>
            </div>

            {/* Booking Status */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">My Booking Status</h2>
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

            {/* Recent Bookings */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold pb-4">My Recent Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">House</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Booked At</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myRecentBookings.map((booking) => (
                                <tr key={booking._id} className="border border-gray-200 hover:bg-gray-100 transition">
                                    <td className="px-4 py-2">{booking.house}</td>
                                    <td className="px-4 py-2">${booking.price}</td>
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

            {/* Recommended Houses */}
            <div>
                <h2 className="text-2xl font-bold pb-4">Recommended Houses</h2>
                <ul className="space-y-2 bg-white p-6 rounded-lg shadow">
                    {recommendedHouses.map((house) => (
                        <li key={house._id} className="border-b py-2">
                            <strong>{house.name}</strong> – {house.address}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
