import { useEffect, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
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
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <Alert variant="danger" className="text-center">
                    Error: {error}
                </Alert>
            </div>
        );
    }

    return (
        <section id="reviews" className="review-bg py-5">
            <Container className="py-5 text-center">
                <h2 className="fw-bold text-white review-header">
                    Happy <span className="text-warning">Clients</span> Say
                </h2>
            </Container>

            <Container className="review-bg2">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
                    effect="coverflow"
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    navigation={true}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        0: {
                            // mobile
                            slidesPerView: 1,
                            coverflowEffect: { rotate: 30, depth: 100 },
                        },
                        768: {
                            // tablet
                            slidesPerView: 1.5,
                            coverflowEffect: { rotate: 40, depth: 120 },
                        },
                        1200: {
                            // desktop
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
            </Container>
        </section>
    );
};

export default Reviews;
