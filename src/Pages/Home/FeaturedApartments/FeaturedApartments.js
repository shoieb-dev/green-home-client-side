/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { API_ENDPOINTS } from "../../../services/api";
import Apartment from "../../Apartments/Apartment/Apartment";

const FeaturedApartments = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*  useEffect(() => {
    fetch(API_ENDPOINTS.getHouses)
      .then((res) => res.json())
      .then((data) => setApartments(data.slice(0, 6)));
  }, []); */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.houses);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch data: ${response.statusText}`
                    );
                }

                const data = await response.json();
                setApartments(data.slice(0, 6));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div id="featured" className="py-5">
            <div className="py-5">
                <h5 id="">Our Apartments</h5>
                <h3 className="fw-bold">
                    We've
                    <span> Exclusive </span>
                    <span className="brand text-success"> GREEN HOMES </span>
                </h3>
            </div>

            <Container className="apartment-bg">
                <Row xs={1} md={2} lg={3}>
                    {apartments.map((apartment) => (
                        <Apartment
                            key={apartment._id}
                            apartment={apartment}
                        ></Apartment>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default FeaturedApartments;
