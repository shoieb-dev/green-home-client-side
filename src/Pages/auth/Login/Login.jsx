import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const { user, loginUser, signInWithGoogle, isLoading, authError, setAuthError } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setAuthError("");
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setAuthError("");
        loginUser(loginData.email, loginData.password, location, navigate);
    };

    const handleGoogleSignIn = () => {
        setAuthError("");
        signInWithGoogle(location, navigate);
    };

    return (
        <div
            className="relative flex items-center justify-center min-h-screen py-30 px-10 sm:px-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://i.ibb.co/vsQh0F6/image.png')", backgroundAttachment: "fixed" }}
        >
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative bg-white/95 shadow-green-500/30 shadow-xl rounded-3xl border-2 border-solid border-[#51e76a] p-8 w-full max-w-md">
                <img src="https://i.ibb.co/pz3fBBX/B-GREEN.png" alt="logo" className="mx-auto h-12" />
                <p className="text-center text-gray-500 text-sm mt-3">Welcome back! Please log in.</p>
                <h2 className="text-2xl font-bold text-green-700 py-4">Login</h2>
                <p className="text-center text-gray-600 text-sm pb-6">
                    Enter your email and password to access your account.
                </p>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                    {/* Email */}
                    <div>
                        <label className="text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleOnChange}
                            placeholder="Enter email"
                            required
                            aria-label="Email"
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="text-gray-600 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={handleOnChange}
                            placeholder="Password"
                            required
                            aria-label="Password"
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        />
                        <span
                            className="absolute bottom-3 right-3 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                        </span>
                    </div>

                    {/* Error & Success messages */}
                    <div className="min-h-[1.25rem]">
                        {user?.email && <p className="text-green-600 text-sm">Login successful!</p>}
                        {authError && <p className="text-red-600 text-sm">{authError}</p>}
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
    );
};

export default Login;
