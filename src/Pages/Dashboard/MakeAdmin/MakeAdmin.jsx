import { useState } from "react";
import toast from "react-hot-toast";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const MakeAdmin = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { axiosInstance } = useAxiosInstance();

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axiosInstance.put(`${API_ENDPOINTS.users}/make-admin`, { email });
            if (data.success) {
                toast.success(data.message);
                setEmail(""); // clear after success
            } else {
                toast.error(data.message || "Failed to make admin. Try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-700 text-center pb-6">Make an Admin</h2>

                <form onSubmit={handleAdminSubmit} className="space-y-5 text-left">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Making Admin" : "Make Admin"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MakeAdmin;
