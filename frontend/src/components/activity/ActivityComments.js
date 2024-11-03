import React, { useEffect, useState } from "react";
import { getActivityComments } from "../../api/ActivityService"

const ActivityComments = ({ activityId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getActivityComments(activityId); 
        setComments(data);
        console.log(data)
      } catch (err) {
        console.log(err)
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (activityId) {
      fetchComments();
    }
  }, [activityId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-30">Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.userId}:</strong> {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityComments;
