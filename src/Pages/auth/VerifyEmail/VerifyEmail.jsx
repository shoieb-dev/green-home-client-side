import { applyActionCode, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const VerifyEmail = () => {
    const [status, setStatus] = useState("verifying"); // verifying | success | error
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const { setUser } = useAuth();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const oobCode = query.get("oobCode");
        const mode = query.get("mode");

        if (mode !== "verifyEmail" || !oobCode) {
            setStatus("error");
            setMessage("Invalid or missing verification code.");
            return;
        }

        applyActionCode(auth, oobCode)
            .then(async () => {
                // refresh current user
                await auth.currentUser?.reload();

                // set global user state
                setUser(auth.currentUser);

                setStatus("success");
                setMessage("✅ Your email has been verified successfully!");

                setTimeout(() => navigate("/dashboard"), 3000);
            })
            .catch(async (error) => {
                console.error("Email verification error:", error);

                await auth.currentUser?.reload();
                if (auth.currentUser?.emailVerified) {
                    setUser(auth.currentUser); // update global state
                    setStatus("success");
                    setMessage("✅ Your email is already verified!");
                    setTimeout(() => navigate("/dashboard"), 3000);
                } else {
                    setStatus("error");
                    setMessage(
                        error.code === "auth/invalid-action-code"
                            ? "This verification link is invalid, already used, or has expired. Please request a new verification email."
                            : "An error occurred while verifying your email."
                    );
                }
            });
    }, [auth, location, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>

                {status === "verifying" && <p className="text-gray-600">Please wait while we verify your email...</p>}

                {status === "success" && <p className="text-green-600 font-medium">{message}</p>}

                {status === "error" && <p className="text-red-600 font-medium">{message}</p>}

                {status === "success" && (
                    <>
                        <p className="mt-4 text-sm text-gray-500">Redirecting you to dashboard...</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mt-6 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}

                {status === "error" && (
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-6 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                    >
                        Go to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
