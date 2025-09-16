import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { registerUser, isLoading, authError, setAuthError } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Handle input change
    const handleChange = (e) => {
        setAuthError("");
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setAuthError("Passwords do not match.");
            return;
        }
        registerUser(email, password, name, navigate, setAuthError);
    };

    return (
        <div
            className="relative flex items-center justify-center min-h-screen py-30 bg-cover bg-center"
            style={{ backgroundImage: "url('https://i.ibb.co/vsQh0F6/image.png')", backgroundAttachment: "fixed" }}
        >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative bg-white/95 shadow-green-500/30 shadow-xl rounded-3xl border-2 border-solid border-[#51e76a] p-8 w-full max-w-md">
                {/* Logo / Branding */}
                <div className="text-center mb-6">
                    <img src="https://i.ibb.co/pz3fBBX/B-GREEN.png" alt="Green Home Logo" className="mx-auto h-12" />
                    <h2 className="text-3xl font-bold text-green-700 mt-3">Create Account</h2>
                    <p className="text-gray-500 text-sm">Join Green Home and find your perfect property</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-600 text-sm mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        />
                        <span
                            className="absolute bottom-3 right-3 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                        </span>
                    </div>

                    <div className="relative">
                        <label className="block text-gray-600 text-sm mb-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        />
                        <span
                            className="absolute bottom-3 right-3 cursor-pointer text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                        </span>
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
    );
};

export default Register;
