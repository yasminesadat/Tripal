
import React from "react";

export default function Overview({Description}) {
  return (
    <>
      <h2 className="text-30">Description</h2>
      <p className="mt-20">
       {Description}
      </p>

      {/* <h3 className="text-20 fw-500 mt-20">Tour Highlights</h3>
      <ul className="ulList mt-20">
        <li>
          Experience the thrill of a speedboat to the stunning Phi Phi Islands
        </li>
        <li>Be amazed by the variety of marine life in the archepelago</li>
        <li>
          Enjoy relaxing in paradise with white sand beaches and azure turquoise
          water
        </li>
        <li>Feel the comfort of a tour limited to 35 passengers</li>
        <li>Catch a glimpse of the wild monkeys around Monkey Beach</li>
      </ul> */}
    </>
  );
}