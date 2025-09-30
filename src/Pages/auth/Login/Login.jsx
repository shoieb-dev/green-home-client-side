import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/images/B-GREEN.png";
import LoginBg from "../../../assets/images/loginBg.jpg";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
    const { user, loginUser, signInWithGoogle, isLoading, authError, setAuthError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setAuthError("");
        loginUser(data.email, data.password, location, navigate);
    };

    const handleGoogleSignIn = () => {
        setAuthError("");
        signInWithGoogle(location, navigate);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-lime-200 to-white px-5 sm:px-10 py-30">
            <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-green-500/30 shadow-xl border-2 border-[#51e76a] overflow-hidden">
                {/* Left side image */}
                <div className="hidden md:block w-full md:w-1/2">
                    <img src={LoginBg} alt="Authentication background" className="h-full w-full object-cover" />
                </div>

                {/* Right side card */}
                <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
                    {/* Logo */}
                    <img src={logoImage} alt="logo" className="mx-auto h-12" />

                    <p className="text-center text-gray-500 text-sm mt-3">Welcome back! Please log in.</p>

                    <h2 className="text-2xl font-bold text-green-700 py-4 text-center">Login</h2>

                    <p className="text-center text-gray-600 text-sm pb-6">
                        Enter your email and password to access your account.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "At least 6 characters" },
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
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Error & Success messages */}
                        <div className="min-h-[1.25rem]">
                            {user?.email && <p className="text-green-600 text-sm">Login successful!</p>}
                            {authError && <p className="text-red-500 text-sm">{authError}</p>}
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition disabled:bg-gray-400"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google Sign-in */}
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full py-2 px-4 border-2 border-gray-300 rounded flex items-center justify-center gap-2 text-gray-700 hover:bg-green-700 hover:text-white transition"
                    >
                        <FcGoogle size={20} /> Continue with Google
                    </button>

                    {/* Register redirect */}
                    <p className="text-center mt-5 text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            onClick={() => setAuthError("")}
                            className="text-green-600 font-medium hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
