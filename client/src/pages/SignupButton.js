import React from 'react';

const SignupButton = () => {
  const handleSignupClick = () => {
    window.location = '/sign-up';
  };

  return (
    <button className="btn btn-primary btn-block" onClick={handleSignupClick}>
      Sign Up TEST
    </button>
  );
};

export default SignupButton;