import React from 'react';
import Banner from '../Banner/Banner';
import FeaturedApartments from '../FeaturedApartments/FeaturedApartments';
import Review from '../Review/Review';
import Success from '../Success/Success';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Success></Success>
            <FeaturedApartments></FeaturedApartments>
            <Review></Review>
        </div>
    );
};

export default Home;