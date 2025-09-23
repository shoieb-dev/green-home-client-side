import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../../../../components/Loader/Loader";
import { API_ENDPOINTS } from "../../../../services/api";
import Review from "../Review/Review";
import "./Reviews.css";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.reviews);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <section id="reviews" className="review-bg py-12">
                <Loader />
            </section>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <section id="reviews" className="review-bg py-12">
            <div className="mx-auto text-center">
                <h2 className="text-3xl font-bold text-white review-header">
                    Happy <span className="text-yellow-400">Clients</span> Say
                </h2>
            </div>

            <div className="mx-auto mt-8 p-4 max-w-7xl overflow-hidden">
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
            </div>
        </section>
    );
};

export default Reviews;
