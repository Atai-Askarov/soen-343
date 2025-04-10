import React, { useState } from 'react';
import axios from "axios";

const StarRating = ({ event, user }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(""); // State to store the comment

  const handleClick = async (value, comment) => {
    setRating(value);

    try {
      console.log(comment);
      console.log(value);
      const response = await axios.post('http://localhost:5000/create-review', {
        event_id: event,
        user_id: user,
        rating: value || 1,
        comment: comment || "incredible! ... " // Send the selected rating
      });
      console.log('Review submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const value = index + 1; // Calculate the value for each star
        return (
          <span
            key={value}
            className={`star ${value <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => handleClick(value, comment)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            style={{
              cursor: 'pointer',
              fontSize: '2rem',
              color: value <= (hover || rating) ? '#ffc107' : '#e4e5e9',
            }}
          >
            ★
          </span>
        );
      })}
      <div style={{ marginTop: '10px' }}>
        <textarea
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'none',
          }}
        />
      </div>
      <button
        onClick={() => handleClick(rating, comment)}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Submit Review
      </button>
    </div>
  );
};

export default StarRating;