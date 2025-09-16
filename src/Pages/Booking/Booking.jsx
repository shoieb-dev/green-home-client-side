import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../../components/Loader/Loader";
import { API_ENDPOINTS } from "../../services/api";

const Booking = () => {
    const { houseId } = useParams();
    const [house, setHouse] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_ENDPOINTS.houses}/${houseId}`)
            .then((res) => res.json())
            .then((data) => {
                setHouse(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [houseId]);

    if (loading) {
        return <Loader />;
    }

    return (
        // Apartment details
        <div className="body mt-5 text-start">
            <Container>
                <div className="d-flex justify-content-between">
                    <h2 className="text-success">{house.name}</h2>
                    <div>
                        <h4 className="text-danger">USD: ${house.price}</h4>
                    </div>
                </div>

                <Row className="py-3 my-2 rounded-3">
                    <Col xs={1} md={6} lg={8} className="bg-light pt-2">
                        {house.images && house.images.length > 0 ? (
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                grabCursor={true}
                                loop={true}
                                spaceBetween={10}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
                                className="pb-3 rounded-3"
                            >
                                {house.images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={img}
                                            alt={`House ${index + 1}`}
                                            className="w-100 h-[500px] rounded-3"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <img className="w-100 pb-3 rounded-3" src="" alt="No image available" />
                        )}
                    </Col>

                    <Col xs={1} md={6} lg={4}>
                        <h4 className="text-success">{house.heading}</h4>
                        <p style={{ textAlign: "justify" }} className="">
                            {house.description}
                        </p>
                        <Link to={`/booking/${houseId}/bookingForm`}>
                            <Button variant="outline-success" className="px-5 w-100 rounded-pill">
                                Book Now
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Booking;
