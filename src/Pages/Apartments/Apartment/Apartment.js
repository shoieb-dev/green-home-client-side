import { faBath, faBed, faThLarge, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Apartment.css';

const Apartment = ({ apartment }) => {
    const { _id, name, price, area, img1, bed, bath, address } = apartment;

    return (
        <div className="p-3">

            <Card className="card h-100">
                <Card.Img variant="top" src={img1} className="h-100" />

                <Card.Body>
                    <Card.Title className="text-start">{name}</Card.Title>
                    <Card.Text>
                        <div className="d-flex justify-content-around">
                            <p>
                                <FontAwesomeIcon icon={faBed} className="" /> {bed} Bed
                            </p>
                            <p className="ps-3">
                                <FontAwesomeIcon icon={faBath} className="" /> {bath} Bath
                            </p>
                            <p className="ps-3">
                                <FontAwesomeIcon icon={faThLarge} className="" /> {area} sft
                            </p>
                        </div>
                        <div className="d-flex justify-content-between py-3">
                            <h5 className="text-secondary">
                                <FontAwesomeIcon icon={faMapMarkedAlt} className="" /> {address}
                            </h5>
                            <h5 className="text-danger">USD: ${price}</h5>
                        </div>
                        <Link to={`/booking/${_id}`}>
                            <Button variant="outline-success" className="px-5 rounded-pill">Book Now</Button>
                        </Link>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Apartment;