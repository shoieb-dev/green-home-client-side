/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Alert } from "react-bootstrap";
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
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <Alert variant="danger">Error: {error}</Alert>
            </div>
        );
    }

    return (
        // Reviews Section
        <div id="reviews" className="review-bg py-5">
            <div className="py-5">
                <h2 className="fw-bold text-white review-header">
                    Happy <span className="text-warning">Clients</span> Says
                </h2>
            </div>

            <Container className="review-bg2">
                <Row xs={1} md={2} lg={3}>
                    {reviews.map((review) => (
                        <Review key={review._id} review={review}></Review>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Reviews;
