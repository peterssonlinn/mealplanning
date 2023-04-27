import "../App.css";
import React, {useEffect, useState} from "react";
import {Link, useNavigate } from "react-router-dom";
import {auth, signInWithEmailAndPassword, signInWithGoogle} from "../firebase";
import { useAuthState} from "react-firebase-hooks/auth";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login() {
    const [email, setEmai] = useState(""); 
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if(loading) {
            return;
        }
        if (user) navigate("/");

    }, [user, loading]);

    const theme = createTheme({
        palette: {
          primary: {
            // Purple and green play nicely together.
            main: '#307672',
          },
          secondary: {
            // This is green.A700 as hex.
            main: '#1a3c40',
          },
          
    
        },
      });

    return (
        <div className='App'>
            <div className='backgroundApp'> 
                <div className='topHome'> 
                    <div className='loginButton'>
                    </div>
                    <div className='header'>
                        <Link to="/">
                        <h1>Mealplanner</h1>
                        </Link>
                    </div>
                    <div className='navbar'>
                    </div>
                </div>
                <div className="login">
                    <div className="login__container">
                        <input
                            type="textbox"
                            className="login__textBox"
                            value={email}
                            onChange={(e) => setEmai(e.target.value)}
                            placeholder="Email Address"
                        />
                        <input
                            type="password"
                            className="login__textBox"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        
                        <button className="login__btn" onClick={() => signInWithEmailAndPassword(email, password)}>
                                Login
                        </button>
                        
                        <button className="login__btn login__google" onClick={signInWithGoogle}>
                                Login with Google
                        </button>
                        <div>
                            <Link to ="/reset">Forgot Password</Link>
                        </div>
                        <div>
                            Don't have an account? <Link to="/register">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    );
}
export default Login;