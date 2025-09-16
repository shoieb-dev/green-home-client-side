import { getAuth, sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CheckMail = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    // 👇 Poll for verification
    useEffect(() => {
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload(); // refresh user info
                if (auth.currentUser.emailVerified) {
                    clearInterval(interval);
                    navigate("/dashboard"); // or wherever you want
                }
            }
        }, 3000); // check every 3s

        return () => clearInterval(interval);
    }, [navigate]);

    const handleResend = async () => {
        try {
            if (!auth.currentUser) {
                setMessage({
                    type: "error",
                    text: "No user is signed in to resend verification.",
                });
                return;
            }

            setIsSending(true);
            await sendEmailVerification(auth.currentUser);
            setMessage({
                type: "success",
                text: "Verification email resent! Please check your inbox.",
            });
            setCooldown(30);
        } catch (error) {
            let msg = error.message || "Failed to resend verification email.";
            if (error.code === "auth/too-many-requests" || error.message.includes("TOO_MANY_ATTEMPTS")) {
                msg = "Too many attempts. Please wait a few minutes before trying again.";
            }
            setMessage({ type: "error", text: msg });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div
            className="relative flex items-center justify-center min-h-screen py-30 bg-cover bg-center"
            style={{ backgroundImage: "url('https://i.ibb.co/vsQh0F6/image.png')", backgroundAttachment: "fixed" }}
        >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative bg-white/95 shadow-green-500/30 shadow-xl rounded-3xl border-2 border-solid border-[#51e76a] p-8 w-full max-w-md">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-4 rounded-full">
                        <FaEnvelope className="text-green-600 text-4xl" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold mb-4">Check your email</h2>
                <p className="text-gray-600 text-sm pb-6">
                    We’ve sent a verification link to your email. Please open your inbox and click the link to verify
                    your account.
                </p>

                {/* Status messages */}
                {message && (
                    <div
                        className={`mb-4 text-sm text-center p-2 rounded ${
                            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Back to Login */}
                <Link
                    to="/login"
                    className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                >
                    Back to Login
                </Link>

                <p className="text-sm text-gray-500 mt-4">
                    Didn’t receive the email? <br /> Check your spam folder or{" "}
                    <button
                        onClick={handleResend}
                        disabled={isSending || cooldown > 0}
                        className={`inline font-semibold ${
                            isSending || cooldown > 0
                                ? "text-gray-400"
                                : "hover:underline text-green-600 hover:text-green-700"
                        }`}
                    >
                        {isSending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "click here to resend"}
                    </button>
                    .
                </p>
            </div>
        </div>
    );
};

export default CheckMail;

/* 
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

const VerifyEmail = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleResend = async () => {
        if (!user) return;
        setLoading(true);
        setMessage("");
        setError("");
        try {
            await sendEmailVerification(user);
            setMessage("Verification email resent. Please check your inbox.");
        } catch (err) {
            setError("Could not send verification email. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Verify Your Email</h2>
                <p className="text-gray-600 text-center mb-6">
                    A verification link has been sent to <span className="font-medium">{user?.email}</span>. Please
                    check your email and verify your account.
                </p>

                {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                <button
                    onClick={handleResend}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {loading ? "Sending..." : "Resend Verification Email"}
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;
*/
