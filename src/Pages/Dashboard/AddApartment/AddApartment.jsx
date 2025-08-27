import axios from "axios";
import { useForm } from "react-hook-form";
import { API_ENDPOINTS } from "../../../services/api";

const AddApartment = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(API_ENDPOINTS.houses, data);
            if (res.data.insertedId) {
                alert("House Added Successfully ✅");
                reset();
            }
        } catch (error) {
            alert("Something went wrong ❌");
            console.error(error);
        }
    };

    return (
        <div className="mt-16 bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-700 pb-6">Add New Apartment</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            {...register("name", { required: "Name is required", maxLength: 50 })}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                            {...register("address", { required: "Address is required" })}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Bed */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bed</label>
                        <input
                            {...register("bed", { required: "Bed is required" })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.bed && <p className="text-red-500 text-sm mt-1">{errors.bed.message}</p>}
                    </div>

                    {/* Bath */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bath</label>
                        <input
                            {...register("bath", { required: "Bath is required" })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.bath && <p className="text-red-500 text-sm mt-1">{errors.bath.message}</p>}
                    </div>

                    {/* Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft)</label>
                        <input
                            {...register("area", { required: "Area is required" })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                            {...register("price", { required: "Price is required" })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>

                    {/* Heading */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                        <input
                            {...register("heading", { required: "Heading is required" })}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows="4"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Image */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                            {...register("image", { required: "Image URL is required" })}
                            type="url"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
                        >
                            Add Apartment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddApartment;
