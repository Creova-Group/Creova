import React from 'react';
import Header from './Header';
import ContactForm from './ContactForm';

function App() {
  return (
    <div>
      <Header />
      <ContactForm />
      <footer style={{ backgroundColor: '#333', color: '#fff', textAlign: 'center', padding: '10px 0' }}>
        Empowering Creators through Web3 Funding
      </footer>
    </div>
  );
}

export default App;