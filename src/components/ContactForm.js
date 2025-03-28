import React from 'react';
import './ContactForm.css';  

const ContactForm = () => {
  return (
    <div className="contact-form-container">
      <h2>Get In Touch</h2>
      <form>
        <div className="input-container">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
        </div>
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;