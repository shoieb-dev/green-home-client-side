import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../../components/Loader/Loader";
import { useAxiosInstance } from "../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../services/api";

const Booking = () => {
    const { houseId } = useParams();
    const { axiosInstance } = useAxiosInstance();
    const [house, setHouse] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!houseId) return;

        setLoading(true);

        axiosInstance
            .get(`${API_ENDPOINTS.houses}/${houseId}`)
            .then((res) => {
                setHouse(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.response?.data?.message || "Failed to load house details. Please try again.");
            })
            .finally(() => setLoading(false));
    }, [houseId, axiosInstance]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="my-20 px-5 md:px-16 text-start">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-green-600 text-2xl font-bold">{house.name}</h2>
                <h4 className="text-red-500 text-xl font-semibold">USD: ${house.price}</h4>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white shadow-lg rounded-2xl p-6">
                {/* Left: Image slider */}
                <div className="lg:col-span-2 bg-gray-50 rounded-xl overflow-hidden">
                    {house.images && house.images.length > 0 ? (
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            grabCursor={true}
                            loop={true}
                            spaceBetween={10}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            className="rounded-xl"
                        >
                            {house.images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={img}
                                        alt={`House ${index + 1}`}
                                        className="w-full h-[400px] md:h-[500px] object-cover rounded-xl"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="flex items-center justify-center h-[400px] bg-gray-200 rounded-xl">
                            <p className="text-gray-500">No image available</p>
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h4 className="text-green-600 text-xl font-semibold mb-3">{house.heading}</h4>
                        <p className="text-gray-700 text-justify leading-relaxed">{house.description}</p>
                    </div>

                    <Link to={`/booking/${houseId}/bookingForm`} className="mt-6">
                        <button className="w-full px-6 py-3 text-lg font-medium border border-green-500 text-green-600 rounded-full hover:bg-green-500 hover:text-white transition">
                            Book Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Booking;
