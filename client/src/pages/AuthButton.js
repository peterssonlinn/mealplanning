import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const AuthButton = ({ isAuthenticated }) => {
  return (
    <div>
      {isAuthenticated ? (
        // Render LogoutButton component when isAuthenticated is true
        <LogoutButton />
      ) : (
        // Render LoginButton component when isAuthenticated is false
        <LoginButton />
      )}
    </div>
  );
};

export default AuthButton;