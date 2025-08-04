import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { API_ENDPOINTS } from "../../services/api";

const MyApartments = () => {
    const { user } = useAuth();
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        fetch(`${API_ENDPOINTS.bookings}/${user?.email}`)
            .then((res) => res.json())
            .then((data) => setApartments(data));
    }, [user.email]);

    const handleDelete = (email) => {
        axios.delete(`${API_ENDPOINTS.bookings}/${user?.email}`).then((res) => {
            console.log(res.data.deletedCount);
            if (res.data.deletedCount > 0) {
                alert("Are you sure to delete this Booking?");
                console.log(res.data);
            }
        });
    };

    return (
        <div className="manage-apartments">
            <h2 className="py-5">Manage Booked Apartments</h2>
            {apartments.map((apartment) => (
                <div key={apartment._id}>
                    <Row className="m-2 bg-secondary rounded-pill w-75 mx-auto p-3 text-white">
                        <Col>
                            <h4 className="text-start"> {apartment.house} </h4>
                        </Col>
                        <Col>
                            <Button
                                variant="outline-danger"
                                className="btn-light"
                                onClick={() => {
                                    handleDelete(apartment.email);
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

export default MyApartments;
