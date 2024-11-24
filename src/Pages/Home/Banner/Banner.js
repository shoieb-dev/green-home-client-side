import React, { useState } from 'react';
import { Carousel, Spinner } from 'react-bootstrap';
import './Banner.css';

const slides = [
    {
        src: "https://i.ibb.co/rmB3JSQ/image.png",
        alt: "First slide",
        caption: "IT'S GOOD TO <br /> TOUCH THE GREEN",
    },
    {
        src: "https://i.ibb.co/Pr252nz/image.png",
        alt: "Second slide",
        caption: "CHOOSE YOUR HOME <br /> IN NATURE",
    },
    {
        src: "https://i.ibb.co/xqL8X1M/image.png",
        alt: "Third slide",
        caption: "BE GREEN <br /> BE HAPPY",
    },
];

const Banner = () => {
    const [loadedImages, setLoadedImages] = useState(Array(slides.length).fill(false));

    const handleImageLoad = (index) => {
        const updatedLoadedImages = [...loadedImages];
        updatedLoadedImages[index] = true;
        setLoadedImages(updatedLoadedImages);
    };

    return (
        <div id="banner">
            <Carousel fade>
                {slides.map((slide, index) => (
                    <Carousel.Item key={index}>
                        <div style={{ position: "relative", height: "600px", width: "100%" }}>
                            {/* Loader */}
                            {!loadedImages[index] && (
                                <div className='spinner-container'>
                                    <Spinner
                                        animation="border"
                                        variant="success"
                                        style={{ height: "100px", width: "100px" }}
                                    />
                                </div>
                            )}

                            {/* Image */}
                            <img
                                className="d-block w-100"
                                src={slide.src}
                                alt={slide.alt}
                                style={{ height: "600px", display: loadedImages[index] ? "block" : "none", }}
                                onLoad={() => handleImageLoad(index)}
                            />
                        </div>

                        {/* Caption */}
                        <Carousel.Caption>
                            <h1
                                className="banner-text"
                                style={{ display: loadedImages[index] ? "block" : "none" }}
                                dangerouslySetInnerHTML={{ __html: slide.caption }}
                            />
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;
