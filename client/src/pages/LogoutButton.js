import React from 'react';

const LogoutButton = () => {
  const handleLogoutClick = () => {
    window.location = '/logout';
  };

  return (
    <button className="btn btn-danger btn-block" onClick={handleLogoutClick}>
      Log Out
    </button>
  );
};

export default LogoutButton;