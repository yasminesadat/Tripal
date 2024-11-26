import React, { useState, useEffect } from "react";

export default function MainInformation({name}) {

  //   const [hotelDetails, setHotelDetails] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  //   // Fetch hotel data based on hotelID
  //   const fetchHotelData = async () => {
  //       try {

  //           const response = await getHotelDetails(hotelID);
  //           console.log("hiiiiiiiiiiiiiiiiiiiiii",response);

  //           setHotelDetails(response);
  //       } catch (error) {
  //           console.error("Error fetching hotel details:", error);
  //           setError("Failed to load hotel details.");
  //       } finally {
  //           setLoading(false);
  //       }
  //   };

  //   useEffect(() => {
  //       fetchHotelData();
  //   }, [hotelID]); // Fetch data when hotelID changes

  //   // Render loading state
  //   if (loading) {
  //       return <div>Loading hotel details...</div>;
  //   }

  //   // Render error state
  //   if (error) {
  //       return <div>{error}</div>;
  //   }

  //   // Handle case where hotel details might not be available
  //   if (!hotelDetails) {
  //       return <div> </div>; //No hotel details available.
  //   }

  //   const { name, overallRating, numberOfReviews, iataCode } = hotelDetails[0];
  //   console.log(hotelDetails[0])

    return (
        <>
            <div className="row y-gap-20 justify-between items-end">
                <div className="col-auto">
                    <div className="row x-gap-10 y-gap-10 items-center">
                        <div className="col-auto">
                            <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                                Bestseller
                            </button>
                        </div>
                        <div className="col-auto">
                            <button className="button -accent-1 text-14 py-5 px-15 bg-light-1 rounded-200">
                                Free cancellation
                            </button>
                        </div>
                    </div>

                    <h2 className="text-40 sm:text-30 lh-14 mt-20">
                        {name}
                    </h2>

                    <div className="row x-gap-20 y-gap-20 items-center pt-20">
                        {/* <div className="col-auto">
                            <div className="d-flex items-center">
                                <Stars star={overallRating} font={12} />
                                {overallRating} ({numberOfReviews})
                            </div>
                        </div>

                        <div className="col-auto">
                            <div className="d-flex items-center">
                                <i className="icon-pin text-16 mr-5"></i>
                                {iataCode}
                            </div>
                        </div> */}

                        <div className="col-auto">
                            <div className="d-flex items-center">
                                <i className="icon-reservation text-16 mr-5"></i>
                                30K+ booked
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-auto">
                    <div className="d-flex x-gap-30 y-gap-10">
                        <a href="#" className="d-flex items-center">
                            <i className="icon-share flex-center text-16 mr-10"></i>
                            Share
                        </a>
                        <a href="#" className="d-flex items-center">
                            <i className="icon-heart flex-center text-16 mr-10"></i>
                            Wishlist
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
