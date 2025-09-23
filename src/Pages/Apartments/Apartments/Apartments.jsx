import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../services/api";
import Apartment from "../Apartment/Apartment";

const Apartments = () => {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        fetch(API_ENDPOINTS.houses)
            .then((res) => res.json())
            .then((data) => setApartments(data));
    }, []);

    return (
        <div className="py-10 mt-10">
            <div className="py-5 text-center">
                <h3 className="font-bold text-2xl md:text-3xl leading-snug">
                    Exclusive <br />
                    <span className="text-green-600 brand">GREEN HOMES</span>
                </h3>
            </div>

            <div className="max-w-7xl overflow-hidden mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-sky-300 rounded-2xl">
                    {apartments.map((apartment) => (
                        <Apartment key={apartment._id} apartment={apartment} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Apartments;
