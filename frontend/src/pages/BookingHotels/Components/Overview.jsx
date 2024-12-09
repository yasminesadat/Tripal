import React from "react";

export default function Overview({name}) {
  return (
    <>
      <h2 className="text-30">Hotel Overview</h2>
      <p className="mt-20">
        {`Nestled in the heart of the city, ${name} offers a perfect blend of comfort, style, and convenience. With elegantly designed rooms equipped with modern amenities, guests can enjoy a peaceful retreat after a busy day of exploration. The hotel features a world-class restaurant serving gourmet meals, a relaxing spa, and a well-equipped fitness center to ensure a rejuvenating stay.  Just steps away from popular attractions, shopping centers, and vibrant nightlife, our hotel is the ideal choice for those seeking both relaxation and adventure.`}
      </p>

     
    </>
  );
}
