import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Apartment from '../../Apartments/Apartment/Apartment';

const FeaturedApartments = () => {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        fetch('https://evening-plateau-00418.herokuapp.com/houses')
            .then(res => res.json())
            .then(data => setApartments(data.slice(0, 6)));
    }, [])

    return (
        <div id="featured" className="py-5">
            <div className="py-5">
                <h5 id="">Our Apartments</h5>
                <h3 className="fw-bold">We've
                    <span> Exclusive </span>
                    <span className="brand text-success"> GREEN HOMES </span>
                </h3>
            </div>

            <Container className="apartment-bg">
                <Row xs={1} md={2} lg={3}>
                    {
                        apartments.map(apartment => <Apartment
                            key={apartment._id}
                            apartment={apartment}
                        ></Apartment>)
                    }
                </Row>
            </Container>
        </div>
    );
};

export default FeaturedApartments;