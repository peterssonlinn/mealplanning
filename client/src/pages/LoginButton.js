import React from 'react';

// Define a functional component for the login button
const LoginButton = () => {
  // Define the click event handler
  const handleLoginClick = () => {
    window.location = '/login';
  };

  // Render the login button with the defined attributes and click event handler
  return (
    <button className="btn btn-primary btn-block" onClick={handleLoginClick}>
      Log In TEST
    </button>
  );
};

export default LoginButton;