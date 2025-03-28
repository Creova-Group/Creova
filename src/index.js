import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Roadmap from './components/Roadmap';
import Team from './components/Team'; 
import './components/Header.css';
import './components/Hero.css';
import './components/About.css';
import './components/Roadmap.css';
import './components/Team.css'; 

const AppWrapper = () => {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Roadmap />
      <Team /> 
      <App />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);