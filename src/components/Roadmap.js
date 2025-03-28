import React from 'react';
import './Roadmap.css'; 

const Roadmap = () => {
  return (
    <section className="roadmap">
      <div className="roadmap-content">
        <h2>Our Roadmap</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h3>Phase 1</h3>
            <p>Launch the platform and onboard early creators. Initial funding rounds.</p>
          </div>
          <div className="timeline-item">
            <h3>Phase 2</h3>
            <p>Introduce DAO governance and expand partnerships with creators.</p>
          </div>
          <div className="timeline-item">
            <h3>Phase 3</h3>
            <p>Scale up the platform globally and introduce tokenised ownership.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;