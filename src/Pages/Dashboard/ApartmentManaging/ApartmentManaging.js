import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { API_ENDPOINTS } from "../../../services/api";
import "./ApartmentManaging.css";

const ApartmentManaging = () => {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        fetch(API_ENDPOINTS.houses)
            .then((res) => res.json())
            .then((data) => setApartments(data));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`${API_ENDPOINTS.houses}/${id}`).then((res) => {
            if (res.data.deletedCount > 0) {
                alert("Are you sure to delete this Booking?");
                console.log(res.data.deletedCount);
                console.log(res.data);
                const remaining = apartments.filter(
                    (apartment) => apartment._id !== id
                );
                setApartments(remaining);
            }
        });
    };

    return (
        // Apartment Managing
        <div className="manage-apartments">
            <h2 className="py-5">Manage Apartments</h2>
            {apartments.map((apartment) => (
                <div key={apartment._id}>
                    <Row className="m-2 bg-secondary rounded-pill w-75 mx-auto p-3 text-white">
                        <Col>
                            <h4 className="text-start"> {apartment.name} </h4>
                        </Col>
                        <Col>
                            <Button
                                variant="outline-danger"
                                className="btn-dark"
                                onClick={() => {
                                    handleDelete(apartment._id);
                                }}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </div>
            ))}
        </div>
    );
};

export default ApartmentManaging;
