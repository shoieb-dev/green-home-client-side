import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ReviewBg from "../../../../assets/images/reviewBg.jpg";
import Loader from "../../../../components/Loader/Loader";
import { useAxiosInstance } from "../../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../../services/api";
import Review from "../Review/Review";
import "./Reviews.css";

const Reviews = () => {
    const { axiosInstance } = useAxiosInstance();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.reviews);
                setReviews(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || err.message);
                toast.error("Failed to load reviews. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [axiosInstance]);

    return (
        <section
            id="reviews"
            className="bg-cover bg-center py-12"
            style={{ backgroundImage: `url(${ReviewBg})`, backgroundAttachment: "fixed" }}
        >
            <div className="mx-auto text-center">
                <h2 className="text-3xl font-bold text-white drop-shadow-[1px_10px_5px_rgba(0,0,0,0.9)]">
                    Happy <span className="text-yellow-400">Clients</span> Say
                </h2>
            </div>

            <div className="mx-auto mt-8 p-4 max-w-7xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-24">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow">
                            {error}
                        </div>
                    </div>
                ) : (
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
                        effect="coverflow"
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        grabCursor
                        centeredSlides
                        className="bg-black/60 rounded-lg"
                        loop
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                coverflowEffect: { rotate: 30, depth: 100 },
                            },
                            768: {
                                slidesPerView: 1.5,
                                coverflowEffect: { rotate: 40, depth: 120 },
                            },
                            1200: {
                                slidesPerView: 3,
                                coverflowEffect: { rotate: 50, depth: 120 },
                            },
                        }}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 150,
                            modifier: 1,
                            slideShadows: true,
                        }}
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review._id}>
                                <Review review={review} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
};

export default Reviews;
