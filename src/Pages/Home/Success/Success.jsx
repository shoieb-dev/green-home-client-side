import { faFutbol } from '@fortawesome/free-regular-svg-icons';
import { faHome, faPaintRoller, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import './Success.css'

const Success = () => {
    return (
        <div id="success" className="pt-5 success-bg">
            <div className="py-5">
                <h2>
                    <div className="py-3">
                        <span className="brand text-success px-2 rounded-3"> GREEN HOME</span>
                        <span className="text-warning px-2 rounded-3">Properties </span>
                    </div>
                </h2>
                <h3>Features</h3>
            </div>
            <div className="pb-5">
                <Container>

                    <Row xs={1} md={2} lg={4}>
                        <Col>
                            <Card className="success-card p-3 h-100">
                                <Card.Body>
                                    <FontAwesomeIcon className="my-3" icon={faHome} size='4x' />
                                    <Card.Title> Duplex Layout
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card className="success-card p-3 h-100">
                                <Card.Body>
                                    <FontAwesomeIcon className="my-3" icon={faShieldAlt} size='4x' />
                                    <Card.Title> High-Level Security
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card className="success-card p-3 h-100">
                                <Card.Body>
                                    <FontAwesomeIcon className="my-3" icon={faPaintRoller} size='4x' />
                                    <Card.Title> Royal Touch Paint
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card className="success-card p-3 h-100">
                                <Card.Body>
                                    <FontAwesomeIcon className="my-3" icon={faFutbol} size='4x' />
                                    <Card.Title> Large Playground
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Success;