import React from 'react';
import AuthButton from './AuthButton';

const AuthNav = ({ isAuthenticated }) => {
  return (
    <div className="navbar-nav ml-auto">
      {/* Render the AuthenticationButton component with the isAuthenticated prop */}
      <AuthButton isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default AuthNav;