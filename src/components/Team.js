import React from 'react';
import './Team.css'; 

const Team = () => {
  return (
    <div className="founder-container">
      <h2 className="founder-title">Meet the Founder</h2>
      <div className="founder-card">
        <div className="founder-image">
          <img src="/team-member-1.png" alt="Adam Gough" />
        </div>
        <div className="founder-description">
          <h3>Adam Gough</h3>
          <p>Founder & CEO</p>
          <p className="founder-info">
            As the visionary behind CreatorFund DAO, Adam is dedicated to leading the project’s strategy, innovation, and growth. With a passion for empowering creators and disrupting traditional funding models, he is committed to driving the evolution of the Web3 ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Team;