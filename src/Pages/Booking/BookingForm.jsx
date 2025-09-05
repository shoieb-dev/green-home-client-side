import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useAxiosInstance } from "../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../services/api";

const BookingForm = () => {
    const { user, admin } = useAuth();
    const { houseId } = useParams();
    const { axiosInstance } = useAxiosInstance();
    const navigate = useNavigate();
    const [house, setHouse] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        axiosInstance
            .get(`${API_ENDPOINTS.houses}/${houseId}`)
            .then((response) => {
                setHouse(response.data);
            })
            .catch((err) => {
                toast.error("Failed to load house details. Please try again.");
            });
    }, [houseId]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            house: house?.name || data.house,
            price: house?.price || data.price,
        };
        setLoading(true);
        try {
            const res = await axiosInstance.post(API_ENDPOINTS.bookings, payload);
            if (res.data.insertedId) {
                toast.success("House Booked Successfully");
                reset();
                setTimeout(() => {
                    if (admin) {
                        navigate("/manageAllBookings");
                    } else {
                        navigate("/bookings");
                    }
                }, 2000);
            }
        } catch (err) {
            toast.error("Failed to book the house. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-700 pb-6">Book This Apartment</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            {...register("name", { required: "Name is required", maxLength: 50 })}
                            defaultValue={user?.displayName || ""}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format",
                                },
                            })}
                            defaultValue={user?.email || ""}
                            type="email"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* House */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">House Name</label>
                        <input
                            {...register("house", { required: "House Name is required", min: 0, valueAsNumber: true })}
                            defaultValue={house?.name || ""}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.house && <p className="text-red-500 text-sm mt-1">{errors.house.message}</p>}
                    </div>
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                            {...register("price", { required: "Price is required", min: 0, valueAsNumber: true })}
                            defaultValue={house?.price || ""}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9]{10,15}$/,
                                    message: "Invalid phone number format",
                                },
                            })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Spinner animation="border" size="sm" className="mr-2" />
                                    Booking...
                                </span>
                            ) : (
                                "Book"
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default BookingForm;
