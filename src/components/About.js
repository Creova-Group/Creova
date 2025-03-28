import React from 'react';
import './About.css'; 

const About = () => {
  return (
    <section className="about">
      <div className="about-content">
        <h2>About CreatorFund DAO</h2>
        <p>
          CreatorFund DAO is a decentralised organisation that empowers creators,
          artists, and innovators to access funding through Web3 technology.
          We aim to provide a transparent and secure way for creators to raise
          capital and grow their projects.
        </p>
        <button className="cta-button">Learn More</button>
      </div>
    </section>
  );
};

export default About;