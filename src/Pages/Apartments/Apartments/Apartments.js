import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Apartment from '../Apartment/Apartment';
import './Apartments.css';

const Apartments = () => {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        fetch('https://evening-plateau-00418.herokuapp.com/houses')
            .then(res => res.json())
            .then(data => setApartments(data));
    }, [])

    return (
        <div className="py-5">
            <div className="py-5">
                <h3 className="fw-bold">
                    Exclusive <br />
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

export default Apartments;