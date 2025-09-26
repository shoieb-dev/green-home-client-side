import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../services/api";
import Apartment from "../../Apartments/Apartment/Apartment";
import Loader from "../../../components/Loader/Loader";

const FeaturedApartments = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.houses);

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const data = await response.json();
                setApartments(data.slice(0, 6));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div id="featured" className="py-12">
            {/* Section Heading */}
            <div className="text-center mb-12">
                <h5 className="text-lg font-semibold text-gray-500 mb-3">Our Apartments</h5>
                <h3 className="text-2xl md:text-3xl font-bold">
                    We've <span className="text-gray-700">Exclusive</span>{" "}
                    <span className="text-green-600 brand">GREEN HOMES</span>
                </h3>
            </div>

            {/* Content */}
            <div className="max-w-7xl overflow-hidden mx-auto p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-24">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow">
                            {error}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-sky-300 rounded-2xl">
                        {apartments.map((apartment) => (
                            <Apartment key={apartment._id} apartment={apartment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedApartments;
