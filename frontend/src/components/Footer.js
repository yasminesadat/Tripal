import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h2>Contact Us</h2>
        <ul>
          <li>Phone: +204387332984</li>
          <li>Email: <a href="mailto:help@TriPal.com"> help@TriPal.com </a></li>
        </ul>
      </div>

      <div className="footer-section">


      </div>
      <p>All rights reserved © {new Date().getFullYear()} TriPal</p>
    </footer>
  );
};

export default Footer;