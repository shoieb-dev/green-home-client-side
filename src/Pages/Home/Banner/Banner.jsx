import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
// import "./Banner.css";

import banner1Webp from "../../../assets/images/banner1.webp";
import banner1Jpg from "../../../assets/images/banner1.jpg";

import banner2Webp from "../../../assets/images/banner2.webp";
import banner2Jpg from "../../../assets/images/banner2.jpg";

import banner3Webp from "../../../assets/images/banner3.webp";
import banner3Jpg from "../../../assets/images/banner3.jpg";

const slides = [
  {
    srcWebp: banner1Webp,
    srcJpg: banner1Jpg,
    alt: "Touch the green nature",
    caption: ["IT'S GOOD TO", "TOUCH THE GREEN"],
  },
  {
    srcWebp: banner2Webp,
    srcJpg: banner2Jpg,
    alt: "Choose your home in nature",
    caption: ["CHOOSE YOUR HOME", "IN NATURE"],
  },
  {
    srcWebp: banner3Webp,
    srcJpg: banner3Jpg,
    alt: "Be green be happy",
    caption: ["BE GREEN", "BE HAPPY"],
  },
];

const Banner = () => {
  const [loaded, setLoaded] = useState(Array(slides.length).fill(false));

  // Preload all images on component mount
  useEffect(() => {
    const imagePromises = slides.map((slide, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          setLoaded((prevLoaded) => {
            const newLoaded = [...prevLoaded];
            newLoaded[index] = true;
            return newLoaded;
          });
          resolve();
        };
        img.src = slide.srcJpg; // Preload the jpg version
      });
    });

    Promise.all(imagePromises);
  }, []);

  return (
    <div id="banner" className="w-full relative">
      <Swiper
        modules={[EffectFade, Pagination, Autoplay]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-screen"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-screen">
              {/* Loader */}
              {!loaded[index] && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"></div>
              )}

              {/* Responsive Image with WebP fallback */}
              <picture>
                <source srcSet={slide.srcWebp} type="image/webp" />
                <img
                  src={slide.srcJpg}
                  alt={slide.alt}
                  className={`w-full h-screen transition-opacity duration-700 ${
                    loaded[index] ? "opacity-100" : "opacity-0"
                  }`}
                />
              </picture>

              {/* Caption */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                {slide.caption.map((line, i) => (
                  <h1
                    key={i}
                    className="font-handwritten relative text-green-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-widest uppercase"
                  >
                    <span className="absolute inset-0 blur-xl bg-green-500/30 rounded-lg"></span>
                    <span className="relative drop-shadow-[1px_10px_5px_rgba(0,0,0,0.9)]">{line}</span>
                  </h1>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
