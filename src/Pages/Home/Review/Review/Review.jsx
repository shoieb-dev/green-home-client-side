import React from "react";
import { Card } from "react-bootstrap";
import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Review = ({ review }) => {
    const { name, reviewtext, img } = review;

    return (
        // Review Cards
        <div className="p-3">
            <Card className="card h-100 bg-light">
                <Card.Img variant="top" src={img} className="w-25 rounded-circle mx-auto" />

                <Card.Body>
                    <FontAwesomeIcon icon={faQuoteLeft} className="" />
                    <Card.Text>
                        {reviewtext}
                        <div className="py-3">
                            <FontAwesomeIcon icon={faStar} className="" />
                            <FontAwesomeIcon icon={faStar} className="" />
                            <FontAwesomeIcon icon={faStar} className="" />
                            <FontAwesomeIcon icon={faStar} className="" />
                            <FontAwesomeIcon icon={faStar} className="" />
                        </div>
                    </Card.Text>
                    <Card.Title>{name}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};
export default Review;
