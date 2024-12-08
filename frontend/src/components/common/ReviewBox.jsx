import {useState, useEffect } from "react";
import { Rate,message } from "antd"; 
import { addRating } from "../../api/RatingService"; 
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
            userID: userId, 
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
                        className="button -md purple-button"
                        onClick={handlePostReview}
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Post"}
                            <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
                <style>{`
            .purple-button {
                background-color: #8f5774;  /* Purple-600 */
                color: white;
                transition: background-color 0.3s ease;
            }

            .purple-button:hover {
                background-color: #5d384d;  /* Purple-700 */
            }
               .contactForm .form-input {
                            position: relative;
                            margin-bottom: 20px;
                          }
                          .contactForm .form-input label {
                            position: absolute;
                            left: 10px;
                            top: 15%;
                            transform: translateY(-15%);
                            transition: 0.3s ease;
                            color: #aaa;
                          }
                          .contactForm .form-input input:focus + label,
                          .contactForm .form-input textarea:focus + label,
                          .contactForm .form-input input:not(:placeholder-shown) + label,
                          .contactForm .form-input textarea:not(:placeholder-shown) + label,
                          .contactForm .form-input input.filled + label,
                          .contactForm .form-input textarea.filled + label {
                            transform: translateY(-29px);
                            font-size: 12px;
                            color: #333;
                          }
                            .password-toggle {
                              position: absolute;
                              right: 10px;
                              top: 50%;
                              transform: translateY(-50%);
                              background: none;
                              border: none;
                              cursor: pointer;
                              color: var(--color-stone);
                              z-index: 2;
                              padding: 5px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                            }
                            .password-toggle:hover {
                              color: var(--color-stone-light);
                            }
                          .contactForm .form-input input,
                          .contactForm .form-input textarea {
                            padding: 10px;
                            font-size: 16px;
                            width: 100%;
                            border: 1px solid #ccc;
                            outline: none;
                          }


                          .absoluteIcon1 {
                              position: absolute;
                              top: 10px;
                              right: 10px;
                              border-radius: 12px;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              background-color: white;
                              width: 37px;
                              height: 37px;
                            }
                              .absoluteIcon2 {
                              bottom:5px
                              border-radius: 12px;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              background-color: white;
                              width: 37px;
                              height: 37px;
                            }
            `}
            </style>
            </div>
        </>
    );
}