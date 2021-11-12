import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelopeOpen, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Col, Container, Row } from 'react-bootstrap';
import './Footer.css';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Footer = () => {
    return (
        <div className="bg-dark text-white py-3">
            <div className="text-start py-5">
                <Container>
                    <Row xs={1} md={2} lg={3} className="g-3">

                        <Col>
                            <div className="d-flex text-start py-3">
                                <div>
                                    <img
                                        src="https://i.ibb.co/pz3fBBX/B-GREEN.png"
                                        width="80"
                                        height="50"
                                        className="d-inline-block align-top me-2"
                                        alt="logo"
                                    />
                                </div>
                                <div>
                                    <h4 className="brand text-success"> GREEN HOME </h4> <h6 className="text-warning">Properties</h6>
                                </div>
                            </div>

                            <div>
                                {/* social media icons  */}
                                <div className="social-media py-4">
                                    <a href="https://www.facebook.com/shoieb.ctg"
                                        target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon className="me-4" icon={faFacebookF} size='2x' />
                                    </a>
                                    <a href="https://twitter.com/Shoieb5"
                                        target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon className="mx-4" icon={faTwitter} size='2x' />
                                    </a>
                                    <a href="https://www.linkedin.com/in/shoieb-alam/" target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon className="mx-4" icon={faLinkedin} size='2x' />
                                    </a>
                                    <a href="https://www.youtube.com/channel/UCCIDe_dIDwvX1rBK-Yz30VA" target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon className="mx-4" icon={faYoutube} size='2x' />
                                    </a>
                                </div>
                            </div>
                        </Col>

                        <Col>
                            <div>
                                <h4>Useful Links</h4>
                            </div>
                            <div className="mt-4">
                                <Link as={HashLink} className="text-decoration-none text-white" to="/home#banner">Home</Link> <br />
                                <Link as={HashLink} className="text-decoration-none text-white" to="/home#featured">Featured</Link> <br />
                                <Link className="text-decoration-none text-white" to="/appartments">Apartments</Link> <br />
                                <Link as={HashLink} className="text-decoration-none text-white" to="/home#reviews">Reviews</Link> <br />
                            </div>
                        </Col>

                        <Col>
                            <div>
                                <h4>Get In Touch</h4>
                            </div>
                            <div className="mt-4">
                                <p>
                                    <FontAwesomeIcon icon={faPhone} className="me-2" /> +88-031-656570
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faEnvelopeOpen} className="me-2" /> support.ghp@gmail.com
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faBuilding} className="me-2" /> Uttara, Dhaka-1230 Bangladesh
                                </p>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </div>
            <small>Copyright © 2021, All Rights Reserved.</small>
        </div>
    );
};

export default Footer;