import React from 'react';
import Banner from '../Banner/Banner';
import FeaturedApartments from '../FeaturedApartments/FeaturedApartments';
import Reviews from '../Review/Reviews/Reviews';
import Success from '../Success/Success';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Success></Success>
            <FeaturedApartments></FeaturedApartments>
            <Reviews></Reviews>
        </div>
    );
};

export default Home;