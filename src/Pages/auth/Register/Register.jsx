import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/images/B-GREEN.png";
import RegisterBg from "../../../assets/images/registerBg.jpg";
import useAuth from "../../../hooks/useAuth";

const Register = () => {
    const navigate = useNavigate();
    const { registerUser, isLoading, authError, setAuthError } = useAuth();
    const [strength, setStrength] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const checkStrength = (value) => {
        if (!value) {
            setStrength("");
            return;
        }

        // Simple strength check
        if (value.length < 6) {
            setStrength("weak");
        } else if (/[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) {
            setStrength("strong");
        } else {
            setStrength("medium");
        }
    };

    const getStrengthColor = () => {
        switch (strength) {
            case "weak":
                return "bg-red-500 w-1/3";
            case "medium":
                return "bg-yellow-500 w-2/3";
            case "strong":
                return "bg-green-500 w-full";
            default:
                return "bg-gray-200 w-0";
        }
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setAuthError("");
        registerUser(data.email, data.password, data.name, navigate, setAuthError);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-lime-200 to-white px-5 sm:px-10 py-30">
            <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-green-500/30 shadow-xl border-2 border-[#51e76a] overflow-hidden">
                {/* Left side image */}
                <div className="hidden md:block w-full md:w-1/2">
                    <img src={RegisterBg} alt="Authentication background" className="h-full w-full object-cover" />
                </div>

                {/* Right side card */}
                <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
                    {/* Logo / Branding */}
                    <div className="text-center mb-6">
                        <img src={logoImage} alt="Green Home Logo" className="mx-auto h-12" />
                        <h2 className="text-2xl font-bold text-green-700 py-4">Create Account</h2>
                        <p className="text-gray-500 text-sm">Join Green Home and find your perfect property</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Full Name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email Address</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" },
                                })}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "At least 6 characters" },
                                        onChange: (e) => checkStrength(e.target.value),
                                    })}
                                    className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="Enter your password"
                                />

                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                >
                                    {showPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                                </span>
                            </div>
                            {/* Strength meter */}
                            <div className="h-1 bg-gray-200 rounded-full mt-1">
                                <div className={`h-2 rounded-full transition-all ${getStrengthColor()}`}></div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="flex items-center">
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    {strength && (
                                        <p
                                            className={`text-xs ${
                                                strength === "weak"
                                                    ? "text-red-500"
                                                    : strength === "medium"
                                                    ? "text-yellow-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {strength.charAt(0).toUpperCase() + strength.slice(1)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required",
                                        validate: (value) => value === watch("password") || "Passwords do not match",
                                    })}
                                    className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="Re-enter password"
                                />
                                <span
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle password visibility"
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                >
                                    {showConfirmPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                                </span>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Error message */}
                        <div className="min-h-[1.25rem]">
                            {authError && <p className="text-red-600 text-sm">{authError}</p>}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition disabled:bg-gray-400"
                        >
                            {isLoading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    {/* Login redirect */}
                    <p className="text-center mt-5 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            onClick={() => setAuthError("")}
                            className="text-green-600 font-medium hover:underline no-underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
