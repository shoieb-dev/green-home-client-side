import React from "react";
import { Card } from "react-bootstrap";
import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../../../../assets/images/avatar1.png";

const Review = ({ review }) => {
    const { name, reviewtext, img } = review;

    return (
        // Review Cards
        <div className="p-3">
            <Card className="card h-100 bg-light">
                <Card.Img
                    variant="top"
                    src={img || Avatar}
                    style={{ width: "100px", height: "100px" }}
                    className="rounded-circle mx-auto"
                />

                <Card.Body className="d-flex flex-column items-center">
                    <FontAwesomeIcon icon={faQuoteLeft} className="mb-2" />
                    <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                        <Card.Text className="px-3">{reviewtext}</Card.Text>
                    </div>

                    <div className="mt-auto py-3">
                        <div className="d-flex justify-content-center py-2">
                            {[...Array(5)].map((_, index) => (
                                <FontAwesomeIcon
                                    key={index}
                                    icon={faStar}
                                    className={index < (review.rating || 0) ? "text-warning" : "text-muted"}
                                />
                            ))}
                        </div>
                        <Card.Title className="mt-2">{name}</Card.Title>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};
export default Review;
