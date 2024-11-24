import { React, useState } from "react";
import { Rate } from "antd"; 
import { addRating } from "../../api/RatingService"; 
// import "../style.css";
// import { touristId } from "../../IDs";
import { getUserData } from "@/api/UserService";

export default function ReviewBox({ id, type }) {
    const [rating, setRating] = useState(0); 
    const [review, setReview] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [userRole, setUserRole] = useState(null); 
    const [userId, setUserId] = useState(null); 
    
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await getUserData();
            if (response.data.status === "success") {
              setUserRole(response.data.role);
              setUserId(response.data.id); 
            } else {
              message.error(response.data.message); 
            }
          } catch (error) {
            message.error("Failed to fetch user data.");
          }
        };
        fetchUserData();
      }, []);
    
    const handlePostReview = async () => {
        setLoading(true);
        setError(null); 

        const ratingData = {
            rating,
            review, 
            userId, 
        };

        try {
            const response = await addRating(id, type, ratingData);
            console.log("Review submitted:", response);
            setRating(0);
            setReview(""); 
            window.location.reload(); 
        } catch (error) {
            console.error("Failed to post review", error);
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to post review. Please try again later.");
            }} 
            finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-30 pt-60" style={{ marginTop: "-5%" }}>{type==="tourGuide"?"Comment on Tourguide":type==="itinerary"?"Comment on Itinerary" : type==="products"?"Review Product" : "Comment on Event"}</h2>
            <div className="contactForm y-gap-30 pt-30">
                <div className="review-rating">
                    <span style={{ marginRight: "2%", marginLeft: "0.5%" }}> Rating: </span>
                    <Rate value={rating} onChange={setRating} />
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="form-input">
                            <textarea rows="5" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                            <label className="lh-1 text-16 text-light-1">{type==="products"?"Review":"Comment"}</label>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <button
                            className="button -md -dark-1 bg-blue-500 text-white"
                            onClick={handlePostReview}
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Post"}
                            <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}