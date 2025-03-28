import React from 'react';
import './Header.css'; 

const Header = () => {
  return (
    <div>
     
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  );
};

export default Header;