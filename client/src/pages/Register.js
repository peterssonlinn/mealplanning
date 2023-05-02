import React, {useEffect, useState} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {Link, useNavigate} from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle} from "../firebase";
import "../App.css";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    if(!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email,password);
  };
  useEffect(() => {
    if(loading) return;
    if(user) navigate("/profile");
  }, [user, loading]);
  return (
    <div className='App'>
      <div className='backgroundApp'> 
          <div className='topHome'> 
              <div className='loginButton'>
              </div>
              <div className='header'>
                  <h1 >MealMate</h1>
              </div>
              <div className='navbar'>
              </div>
          </div>
        <div className="register">
          <div className="register__container">
            <input
              type="text"
              className="register__textBox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
            <input
              type="email"
              className="register__textBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />  
              <input
              type="password"
              className="register__textBox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            /> 
            <button className="register__btn" onClick={register}>
              Register
            </button>
            <button className="register__btn register__google" onClick={signInWithGoogle}>
              Register with Google
            </button>
            <div>
              Already have an account? <Link to="/login">Login</Link> now.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;