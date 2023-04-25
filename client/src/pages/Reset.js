import React, {useEffect, useState} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import {auth, sendPasswordReset} from "../firebase";
import "../App.css";

function Reset() {
    const [email, setEmail]= useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(loading) return;
        if(user) navigate("/profile");
    }, [user, loading]);

    return(
        <div className='App'>
            <div className='backgroundApp'> 
                <div className='topHome'> 
                    <div className='loginButton'>
                    </div>
                    <div className='header'>
                        <h1 >Mealplanner</h1>
                    </div>
                    <div className='navbar'>
                    </div>
                </div>
                <div className="reset">
                    <div className="reset__container">
                        <input type="text"
                        className="reset__textBox"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        placeholder="Email Address" 
                        />
                        <button className="reset__btn" onClick={() => sendPasswordReset(email)}>
                            Send password reset email
                        </button>
                        <div>
                            Don't have an account? <Link to="/register">Register</Link> now.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Reset;