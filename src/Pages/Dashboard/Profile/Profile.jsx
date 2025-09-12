import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CloudinaryUpload from "../../../components/uploads/CloudinaryUpload";
import { useSidebar } from "../../../contexts/SidebarContext";
import useAuth from "../../../hooks/useAuth";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import ChangePasswordModal from "./ChangePasswordModal";

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();
    const { userData, setUserData } = useSidebar();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const fetchUserData = async () => {
        try {
            const { data } = await axiosInstance.get(`${API_ENDPOINTS.users}/${user.email}`);
            setUserData(data?.data || {});
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user.email]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            displayName: "",
            email: "",
            images: "",
            password: "",
        },
    });

    useEffect(() => {
        if (userData?.email) {
            reset({
                displayName: userData?.displayName || userData?.googleName || "",
                email: userData?.email || "",
                images: userData?.photoURL || userData?.googlePhotoUrl || "",
                password: "",
            });
        }
    }, [userData, reset]);

    // Handle profile update
    const onSubmit = async (data) => {
        try {
            const payload = {
                displayName: data.displayName,
                email: data.email,
                photoURL: data.images || "",
            };
            await axiosInstance.put(`${API_ENDPOINTS.users}/profile`, payload);
            toast.success("Profile updated!");
            setTimeout(() => {
                fetchUserData();
                navigate("/dashboard");
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed!");
        }
    };

    // Handle password update

    return (
        <div className="bg-gray-100 flex items-center justify-center p-6">
            {/* Profile Info */}
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                    <div className="flex justify-center gap-4">
                        <div className="w-3/4 flex flex-col gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    {...register("displayName", { required: "Name is required" })}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.displayName && (
                                    <p className="text-red-500 text-sm">{errors.displayName.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                                    })}
                                    disabled
                                    className="w-full border p-2 rounded disabled:bg-gray-200"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="w-1/4">
                            <label className="block text-sm font-medium mb-2">Profile Picture</label>
                            <Controller
                                name="images"
                                control={control}
                                render={({ field }) => (
                                    <CloudinaryUpload
                                        onUploadSuccess={(urls) => field.onChange(urls)}
                                        isEditMode={true}
                                        multiple={false}
                                        folderName="user_images"
                                        existingImages={field.value || userData?.photoURL || ""}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 ">
                        <p
                            className="text-base font-bold text-green-500 cursor-pointer hover:text-green-700 transition"
                            onClick={() => setShowPasswordModal(true)}
                        >
                            Change Password
                        </p>

                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
            <ChangePasswordModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
    );
};

export default Profile;
