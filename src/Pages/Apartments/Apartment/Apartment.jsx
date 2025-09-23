import { Bath, Bed, Grid2x2, MapPinned } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Apartment = ({ apartment }) => {
    const { _id, name, price, area, images, bed, bath, address } = apartment;
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="p-3">
            <div className="bg-white rounded-2xl p-2 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <div className="relative h-52 w-full">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
                            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <img
                        src={images[0]}
                        alt={name}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                        className={`h-full w-full object-cover rounded-2xl transition-opacity duration-300 ${
                            isLoading ? "opacity-0" : "opacity-100"
                        }`}
                    />
                </div>

                <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 text-left">{name}</h4>

                    <div className="flex justify-between mt-3 text-gray-600 text-sm">
                        <span className="flex items-center gap-1">
                            <Bed size={16} /> {bed} Bed
                        </span>
                        <span className="flex items-center gap-1">
                            <Bath size={16} /> {bath} Bath
                        </span>
                        <span className="flex items-center gap-1">
                            <Grid2x2 size={16} /> {area} sft
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                        <div className="text-gray-600 font-bold text-base flex items-center gap-1">
                            <MapPinned size={18} className="mr-1 text-green-600" /> {address}
                        </div>
                        <div className="text-red-600 font-bold text-lg">USD: ${price}</div>
                    </div>

                    <Link to={`/booking/${_id}`}>
                        <button className="w-full px-5 py-2 rounded-full border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300">
                            Book Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Apartment;
