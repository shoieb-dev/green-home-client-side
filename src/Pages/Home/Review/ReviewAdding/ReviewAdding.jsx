import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { API_ENDPOINTS } from "../../../../services/api";
import useAuth from "../../../../hooks/useAuth";
import { Form, Button, Alert } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { useAxiosInstance } from "../../../../hooks/useAxiosInstance";

const ReviewAdding = () => {
    const { user } = useAuth();
    const { axiosInstance } = useAxiosInstance();
    const { register, handleSubmit, reset } = useForm();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [message, setMessage] = useState("");

    const onSubmit = async (data) => {
        try {
            if (!rating || rating < 1) {
                setMessage("⚠️ Please select a rating before submitting.");
                return;
            }

            const reviewData = {
                name: user?.displayName || data.name,
                email: user?.email,
                img: user?.photoURL || data.img,
                reviewtext: data.reviewtext,
                rating,
                createdAt: new Date().toISOString(),
            };

            const res = await axiosInstance.post(API_ENDPOINTS.reviews, reviewData);

            if (res.data?.insertedId) {
                setMessage("✅ Review added successfully!");
                reset();
                setRating(0);
            } else {
                setMessage("❌ Failed to add review. Please try again.");
            }
        } catch (error) {
            console.error("Error adding review:", error);
            setMessage("❌ Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container mt-20">
            <div className="p-4 shadow rounded bg-white mx-auto" /* style={{ maxWidth: "600px" }} */>
                <h2 className="text-center mb-4">Add a Review</h2>

                {message && <Alert variant={message.includes("✅") ? "success" : "danger"}>{message}</Alert>}

                <Form className="text-start" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    {!user?.displayName && (
                        <Form.Group className="mb-3">
                            <Form.Label className="ml-2">Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                {...register("name", { required: true, maxLength: 40 })}
                            />
                        </Form.Group>
                    )}

                    {/* Review text */}
                    <Form.Group className="mb-3">
                        <Form.Label className="ml-2">Review</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Write your review here..."
                            {...register("reviewtext", { required: true })}
                        />
                    </Form.Group>

                    {/* Rating */}
                    <Form.Group className="mb-4">
                        <Form.Label className="ml-2">Rating</Form.Label>
                        <div className="d-flex gap-2 ml-2">
                            {[...Array(5)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={currentRating}
                                            onClick={() => setRating(currentRating)}
                                            className="d-none"
                                        />
                                        <FaStar
                                            size={28}
                                            className="cursor-pointer"
                                            color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </Form.Group>

                    {/* Submit button */}
                    <Button variant="success" type="submit" className="w-100">
                        Submit Review
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ReviewAdding;
