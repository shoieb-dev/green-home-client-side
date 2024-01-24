import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { API_ENDPOINTS } from "../../../../services/api";

const ReviewAdding = () => {
    const { register, handleSubmit, reset } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        axios.post(API_ENDPOINTS.reviews, data).then((res) => {
            if (res.data.insertedId) {
                alert("Review Added Successfully");
                reset();
            }
        });
    };

    return (
        // Review adding form
        <div className="add-house">
            <div className="bg-add-house mx-auto">
                <h2>Add a Review</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("name", { required: true, maxLength: 20 })}
                        placeholder="Name"
                    />

                    <textarea
                        {...register("reviewtext", { required: true })}
                        placeholder="Write A Review"
                    />

                    <input
                        {...register("img", { required: true })}
                        placeholder="Image URL"
                    />

                    <input
                        type="submit"
                        value="Add"
                        className="btn-outline-success"
                    />
                </form>
            </div>
        </div>
    );
};

export default ReviewAdding;
