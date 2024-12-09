import React, { useState } from "react";
import ImageLightBox from "./ImageLightBox";
import img1 from "../Components/HotelsImages/hotel7.jpeg";
import img2 from "../Components/HotelsImages/beach.jpeg";
import img3 from "../Components/HotelsImages/pool.jpeg";
import img4 from "../Components/HotelsImages/room.jpeg";


const images = [
  {
    id: 1,
    image: img1,
  },
  {
    id: 1,
    image: img3,
  },
  {
    id: 1,
    image: img2,
  },
  {
    id: 1,
    image: img4,
  },
];
export default function Gallery1({onSeeAllPhotosClick}) {
  const [activeLightBox, setActiveLightBox] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  
  return (
    <>
      <div className="tourSingleGrid -type-1 mt-30">
        <div className="tourSingleGrid__grid mobile-css-slider-2">
          <img src={img1} alt="image" />
          <img src={img2} alt="image" />
          <img src={img3} alt="image" />
          <img src={img4} alt="image" />
        </div>

        <div className="tourSingleGrid__button">
          <div
            style={{ cursor: "pointer" }}
            className="js-gallery"
            data-gallery="gallery1"
          >
            <span
              onClick={() => {setActiveLightBox(true); onSeeAllPhotosClick()}}
              className="button -accent-Hotelsss py-10 px-20 rounded-200 bg-dark-1 lh-16 text-white"
            
            >
              See all photos
            </span>
          </div>
          {/* <a
            href="/img/tourSingle/1/2.png"
            className="js-gallery"
            data-gallery="gallery1"
          ></a>
          <a
            href="/img/tourSingle/1/3.png"
            className="js-gallery"
            data-gallery="gallery1"
          ></a>
          <a
            href="/img/tourSingle/1/4.png"
            className="js-gallery"
            data-gallery="gallery1"
          ></a> */}
        </div>
      </div>
      <ImageLightBox
        images={images}
        activeLightBox={activeLightBox}
        setActiveLightBox={setActiveLightBox}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
        onSeeAllPhotosClick={onSeeAllPhotosClick}
      />
    </>
  );
}
