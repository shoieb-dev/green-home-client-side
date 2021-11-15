import React from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import './ApartmentAdding.css';

const ApartmentAdding = () => {
    const { register, handleSubmit, reset } = useForm();
    const onSubmit = data => {
        console.log(data);
        axios.post('https://evening-plateau-00418.herokuapp.com/houses', data)
            .then(res => {
                if (res.data.insertedId) {
                    alert('House Added Successfully');
                    reset();
                }
            })
    };

    return (
        // New Apartment adding form
        <div className="add-house">
            <div className="bg-add-house mx-auto">
                <h2>Add a House</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <input {...register("name", { required: true, maxLength: 50 })} placeholder="Name" />

                    <input {...register("address", { required: true, maxLength: 50 })} placeholder="Address" />

                    <input type="number" {...register("price", { required: true })} placeholder="Price" />

                    <input type="number" {...register("bed", { required: true })} placeholder="Bed" />

                    <input type="number" {...register("bath", { required: true })} placeholder="Bath" />

                    <input type="number" {...register("area", { required: true })} placeholder="Area" />

                    <textarea {...register("heading")} placeholder="Heading" />

                    <textarea {...register("description")} placeholder="Description" />

                    <input {...register("img1")} placeholder="Image 1 URL" />
                    <input {...register("img2")} placeholder="Image 2 URL" />
                    <input {...register("img3")} placeholder="Image 3 URL" />

                    <input type="submit" value="Add" className="btn-outline-success" />
                </form>

            </div>
        </div>
    );
};

export default ApartmentAdding;