import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
            {/* Title */}
            <h1 className="text-7xl font-extrabold text-green-700">404</h1>
            <p className="text-xl font-semibold text-gray-700 mt-2">Page Not Found</p>
            <p className="text-base text-gray-500 mt-2 text-center max-w-md">
                Oops! The page you’re looking for doesn’t exist. Try going back home or explore homes.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate("/")}
                    aria-label="Go back to home page"
                    className="px-6 py-3 rounded bg-green-600 text-white font-medium shadow hover:bg-green-700 transition"
                >
                    Back to Home
                </button>
                <button
                    onClick={() => navigate("/apartments")}
                    className="px-6 py-3 rounded border-2 border-green-600 text-green-700 font-medium hover:bg-green-50 transition"
                >
                    Browse Homes
                </button>
            </div>
        </div>
    );
};

export default NotFound;
