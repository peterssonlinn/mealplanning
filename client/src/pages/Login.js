import "../App.css";
import "./LogIn.css";
import React, {useEffect, useState} from "react";
import {Link, useNavigate } from "react-router-dom";
import {auth, signInWithGoogle, logInWithEmailAndPassword} from "../firebase";
import { useAuthState} from "react-firebase-hooks/auth";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login() {
    const [email, setEmai] = useState(""); 
    const [password, setPassword] = useState("");
    const [user, loading, errorTuple] = useAuthState(auth);
    const [error, setError] = useState(null);
  
    const navigate = useNavigate();

    useEffect(() => {
        if(loading) {
            return;
        }
        if (user) navigate("/");
    }, [user, loading]);

    const handleLogin = async () => {
        try {
          await logInWithEmailAndPassword(email, password);
        } catch (error) {
          console.log("Error:", error.message);
          setError(error.message);
        }
      };
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
                        <h1>MealMate</h1>
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
                          {error && <div className="error-message">{"Wrong password or email"}</div>}
                        <button className="login__btn" onClick={handleLogin}>
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