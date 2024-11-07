import { reviews } from "./tourSingleContent";
import React from "react";
import Stars from "./Stars";
import img1 from "../Components/HotelsImages/profile.jpeg";
import img2 from "../Components/HotelsImages/reception.jpeg";

import img3 from "../Components/HotelsImages/review1.jpeg";
import img4 from "../Components/HotelsImages/review2.jpeg";



export default function Reviews() {
  return (
    <>
      {reviews.map((elm, i) => (
        <div key={i} className="pt-30">
          <div className="row justify-between">
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="size-40 rounded-full">
                  <img src={img1} alt="image" className="img-cover" />
                </div>

                <div className="text-16 fw-500 ml-20">{elm.name}</div>
              </div>
            </div>

            <div className="col-auto">
              <div className="text-14 text-light-2">{elm.date}</div>
            </div>
          </div>

          <div className="d-flex items-center mt-15">
            <div className="d-flex x-gap-5">
              <Stars star={elm.stars} />
            </div>
            <div className="text-16 fw-500 ml-10">{elm.reviewText}</div>
          </div>

          <p className="mt-10">{elm.desc}</p>

          <div className="row x-gap-20 y-gap-20 pt-20">
              {[
                img2,img3,img4
              ].map((image, index) => (
                <div key={index} className="col-auto">
                  <div className="size-130">
                    <img src={image} alt={`image ${index + 1}`} className="img-cover rounded-12" />
                  </div>
                </div>
              ))}
          </div>

          <div className="d-flex x-gap-30 items-center mt-20">
            <div>
              <a href="#" className="d-flex items-center">
                <i className="icon-like text-16 mr-10"></i>
                Helpful
              </a>
            </div>
            <div>
              <a href="#" className="d-flex items-center">
                <i className="icon-dislike text-16 mr-10"></i>
                Not helpful
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
