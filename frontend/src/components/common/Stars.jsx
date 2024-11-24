import React, { useEffect, useState } from "react";

export default function Stars({ star, font }) {
  const [rating, setRating] = useState([]);

  useEffect(() => {
    const totalStars = 5;
    const filledStars = Math.round(star); 
    const newRating = [];

    for (let i = 0; i < totalStars; i++) {
      newRating.push(i < filledStars ? "filled" : "empty");
    }

    setRating(newRating);
  }, [star]); 

  return (
    <>
      {rating.map((elm, i) => (
        <div key={i}>
          <i
            className="icon-star"
            style={{
              color: elm === "filled" ? "gold" : "lightgray", 
              fontSize: font ? `${font}px` : "10px", 
            }}
          ></i>
        </div>
      ))}
    </>
  );
}