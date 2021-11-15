import React from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";

const ReviewAdding = () => {
    const { register, handleSubmit, reset } = useForm();
    const onSubmit = data => {
        console.log(data);
        axios.post('http://localhost:5000/reviews', data)
            .then(res => {
                if (res.data.insertedId) {
                    alert('Review Added Successfully');
                    reset();
                }
            })
    };

    return (
        // Review adding form 
        <div className="add-house">
            <div className="bg-add-house mx-auto">
                <h2>Add a Review</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <input {...register("name", { required: true, maxLength: 20 })} placeholder="Name" />

                    <textarea {...register("reviewtext", { required: true })} placeholder="Write A Review" />

                    <input {...register("img", { required: true })} placeholder="Image URL" />

                    <input type="submit" value="Add" className="btn-outline-success" />
                </form>

            </div>
        </div>
    );
};

export default ReviewAdding;