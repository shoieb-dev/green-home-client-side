import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { API_ENDPOINTS } from "../../../services/api";

const Booking = () => {
    const { houseId } = useParams();
    const [house, setHouse] = useState({});
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const { user } = useAuth();

    useEffect(() => {
        fetch(`${API_ENDPOINTS.houses}/${houseId}`)
            .then((res) => res.json())
            .then((data) => setHouse(data));
    }, [houseId]);

    const onSubmit = (data) => {
        console.log(data);
        axios.post(API_ENDPOINTS.bookings, data).then((res) => {
            if (res.data.insertedId) {
                alert("House Booked Successfully");
                reset();
            }
        });
    };

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
                        <img
                            className="w-100 pb-3 rounded-3"
                            src={house.img1}
                            alt=""
                        />
                        <div>
                            <h4 className="text-success">{house.heading}</h4>
                            <p>{house.description}</p>
                        </div>
                    </Col>

                    <Col xs={1} md={6} lg={4}>
                        {/* Booking form  */}
                        <div className="add-house py-5 mb-5 text-center text-white h-100">
                            <h4>Book This Apartment</h4>
                            <form
                                className=""
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <input
                                    defaultValue={user.displayName}
                                    {...register("name")}
                                />

                                <input
                                    defaultValue={user.email}
                                    {...register("email", { required: true })}
                                />
                                {errors.email && (
                                    <span className="error">
                                        This field is required
                                    </span>
                                )}

                                <input
                                    defaultValue={house.name}
                                    {...register("house", { required: true })}
                                />

                                <input
                                    defaultValue={house.price}
                                    {...register("price", { required: true })}
                                />

                                <input
                                    placeholder="Phone Number"
                                    defaultValue=""
                                    {...register("phone", { required: true })}
                                />

                                <input
                                    type="submit"
                                    value="Book This Apartment"
                                    className="btn-outline-success"
                                />
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Booking;
