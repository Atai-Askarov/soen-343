import React, { useState } from 'react';

const StarRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value); // Notify parent component of the rating
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <span
            key={value}
            className={`star ${value <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => handleClick(value)}
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
    </div>
  );
};

export default StarRating;