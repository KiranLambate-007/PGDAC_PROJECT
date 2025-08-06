import React from 'react';

export const AboutUs = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">About Us</h1>
    <p className="text-gray-700 leading-relaxed">
  Welcome to the PMPML Bus Ticket Booking System. Our platform is designed to make your travel planning simple and efficient. 
  You can search for bus routes, book tickets, manage your bookings, and more.
  <br /><br />
  We aim to provide a hassle-free commuting experience for everyone using modern technologies and user-friendly tools.
  <br /><br />

  <strong>Contact Us:</strong><br />
  📧 Email: <a href="mailto:support@pmpml.com" className="text-blue-600 underline">support@pmpml.com</a><br />
  ☎️ Phone: +91-12345-67890<br />
  📍 Address: PMPML Head Office, Swargate, Pune, Maharashtra, India
  <br /><br />

</p>
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
      <p className="text-gray-600">
        To provide a seamless and efficient bus ticket booking experience for all commuters in Pune.
      </p>
    </div>
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
      <p className="text-gray-600">
        To be the leading platform for public transport solutions in Pune, enhancing mobility and connectivity.
      </p>
      
    </div>
    <br/>
    <br/>
  <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} PMPML Ticket Booking System. All rights reserved.</span>

  </div>
  
);
