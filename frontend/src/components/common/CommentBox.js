import React, { useState } from "react";
import { addActivityComment } from "../../api/ActivityService"; 

export default function CommentBox({ activityId, userId, onCommentPosted }) {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const comment = await addActivityComment(activityId, userId, commentText);
      setSuccess(true);
      setCommentText(""); 

      if (onCommentPosted) onCommentPosted(comment); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h2 className="text-30 pt-60">Leave a Comment</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Comment posted successfully!</p>}

      <div className="contactForm y-gap-30 pt-30">
        <div className="row">
          <div className="col-12">
            <div className="form-input">
              <textarea
                value={commentText}
                onChange={handleCommentChange}
                required
                rows="5"
                placeholder="Write your comment here..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button
              className="button -md -dark-1 bg-accent-1 text-white"
              onClick={handleSubmit}
            >
              Post Comment
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
