import  { useEffect, useState } from "react";

import  {deleteHistoricalPlace} from "../../api/HistoricalPlaceService";
import { useNavigate } from "react-router-dom";
import {message} from "antd";
export default function MainInformation({historicalPlace, userRole}) {
  const navigate = useNavigate();

  const handleCopyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch((error) => {
        message.error("Failed to copy link");
      });
  };

  const handleShare = (link) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this historical place!",
          url: link,
        })
        .catch((error) => {
          message.error("Failed to share");
        });
    } else {
      window.location.href = `mailto:?subject=Check out this historical place!&body=Check out this link: ${link}`;
    }
  };
  const handleDelete = async () => {
    try {
      const response = await deleteHistoricalPlace(historicalPlace._id);
      if (response) {
        navigate(`/my-historical-places`);
        message.success("Deleted Successfully");
      }
    }
    catch (e) {
      message.error("Failed to Delete");
    }
  }

  
  return (
    <>
      <div className="row y-gap-20 justify-between items-end">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10 items-center">
            {historicalPlace?.tags?.map((tag,index)=>
            <div className="col-auto" key={`tag-${index}`}>
              <button className="button -accent-1 text-14 py-5 px-15 bg-light-1 rounded-200">
               {tag?.name}
              </button>
            </div>
            )}
             {historicalPlace?.historicalPeriod?.map((tag,index)=>
            <div className="col-auto" key={`historicalPeriod-${index}`}>
              <button className="button -accent-1 text-14 py-5 px-15 bg-light-1 rounded-200">
               {tag?.name}
              </button>
            </div>
            )}
            </div>
          <h2 className="text-40 sm:text-30 lh-14 mt-20">
            {historicalPlace?.name?.split(" ").slice(0, 7).join(" ")}

            <br />
            {historicalPlace?.name?.split(" ").slice(7).join(" ")}
          </h2>

          <div className="row x-gap-20 y-gap-20 items-center pt-20">
            {/* <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex x-gap-5 pr-10">
                  <Stars star={tour?.rating} font={12} />
                </div>
                {tour?.rating} ({tour.ratingCount})
              </div>
            </div> */}

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-pin text-16 mr-5"></i>
                {historicalPlace?.location?.address}
              </div>
            </div>

            {/* <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-reservation text-16 mr-5"></i>
                30K+ booked
              </div>
            </div>*/}
          </div>
        </div> 
          
        <div className="col-auto">
          <div className="d-flex x-gap-30 y-gap-10">
           {userRole==="Tourism Governor" &&<a  className="d-flex items-center"
            onClick={() => {
              console.log("before navigate",historicalPlace);
              navigate(`/update-historical-place/${historicalPlace._id}`,{state:{historicalPlace}});
           
            }}>
              <i className="icon-pencil flex-center text-16 mr-10"></i>
              Edit
            </a> }
            {userRole==="Tourism Governor" &&<a  className="d-flex items-center"
            onClick={() => {
              handleDelete();
             
            }}>
              <i className="icon-delete flex-center text-16 mr-10"></i>
              Delete
            </a> }
            {userRole==="Tourist" && <a  className="d-flex items-center" onClick={() =>
                  handleCopyLink(
                    `${window.location.origin}/historical-places/${historicalPlace._id}`
                  )
                }>
              <i className="icon-clipboard flex-center text-16 mr-10"></i>
              Copy
            </a> }
            {userRole==="Tourist" && <a  className="d-flex items-center" onClick={() =>
                  handleShare(
                    `${window.location.origin}/historical-places/${historicalPlace._id}`
                  )
                }>
              <i className="icon-share flex-center text-16 mr-10"></i>
              Share
            </a>}

            
            
          </div>
        </div>
      </div>
    </>
  );
}

