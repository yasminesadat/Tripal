import React from 'react';
import badgeImage from '../../assets/images/badge.png'; 

const Badge = ({ totalPoints }) => {
  let badgeText = '';
  let badgeColor = '';

  if (totalPoints <= 100000) {
    //level 1
    badgeText = 'BRONZE';
    badgeColor = 'bronze'; 
  } else if (totalPoints <= 500000) {
    //level 2
    badgeText = 'SILVER';
    badgeColor = 'silver'; 
  } else {
    //level 3
    badgeText = 'GOLD';
    badgeColor = 'gold';
  }

  return (
    <div className={`tourist__badge ${badgeColor}`}>
        <img src={badgeImage} alt="Badge" className="badge-image" />
        <span className="badge-text">{badgeText}</span>
    </div>
  );
};

export default Badge;
