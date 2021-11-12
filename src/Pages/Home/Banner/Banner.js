import React from 'react';
import { Carousel } from 'react-bootstrap';
import './Banner.css';

const Banner = () => {
    return (
        <div id="banner">
            <>
                <Carousel fade>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://i.ibb.co/rmB3JSQ/image.png"
                            alt="First slide"
                        />

                        <Carousel.Caption>
                            <h1 className="banner-text">IT'S GOOD TO <br /> TOUCH THE GREEN</h1>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://i.ibb.co/Pr252nz/image.png"
                            alt="Second slide"
                        />

                        <Carousel.Caption>
                            <h1 className="banner-text">CHOOSE YOUR HOME <br /> IN NATURE </h1>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://i.ibb.co/xqL8X1M/image.png"
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h1 className="banner-text">BE GREEN <br /> BE HAPPY</h1>
                        </Carousel.Caption>
                    </Carousel.Item>


                </Carousel>
            </>
        </div>
    );
};

export default Banner;