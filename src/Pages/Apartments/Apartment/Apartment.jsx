import { faBath, faBed, faThLarge, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Apartment.css';

const Apartment = ({ apartment }) => {
    const { _id, name, price, area, img1, bed, bath, address } = apartment;
    const [isLoading, setIsLoading] = useState(true); // State for image loading

    return (
        <div className="p-3">
            <Card className="card h-100">
                <div style={{ position: 'relative', height: '200px' }}>
                    {isLoading && (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            <Spinner animation="border" variant="success" />
                        </div>
                    )}
                    <Card.Img
                        variant="top"
                        src={img1}
                        className="h-100"
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                        style={{
                            display: isLoading ? 'none' : 'block',
                        }}
                    />
                </div>
                <Card.Body>
                    <Card.Title className="text-start">{name}</Card.Title>
                    <Card.Text>
                        <div className="d-flex justify-content-around">
                            <span>
                                <FontAwesomeIcon icon={faBed} /> {bed} Bed
                            </span>
                            <span className="ps-3">
                                <FontAwesomeIcon icon={faBath} /> {bath} Bath
                            </span>
                            <span className="ps-3">
                                <FontAwesomeIcon icon={faThLarge} /> {area} sft
                            </span>
                        </div>
                        <div className="d-flex justify-content-between py-3">
                            <div
                                style={{ fontSize: '20px', fontWeight: 'bolder' }}
                                className="text-secondary"
                            >
                                <FontAwesomeIcon icon={faMapMarkedAlt} /> {address}
                            </div>
                            <div
                                style={{ fontSize: '20px', fontWeight: 'bolder' }}
                                className="text-danger"
                            >
                                USD: ${price}
                            </div>
                        </div>
                        <Link to={`/booking/${_id}`}>
                            <Button variant="outline-success" className="px-5 rounded-pill">
                                Book Now
                            </Button>
                        </Link>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Apartment;
