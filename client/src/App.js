import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactDOM } from 'react-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Calender from './pages/Calender';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Reset from './pages/Reset';


import React, { useState } from 'react';





function App() {
  return (
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}> </Route>
        <Route path="/register" element={<Register/>}> </Route>
        <Route path="/calender" element={<Calender/>}></Route>
        <Route path="/friends" element={<Friends/>}> </Route>
        <Route path="/profile" element={<Profile/>}> </Route>
        <Route path="/settings" element={<Settings/>}> </Route>
        <Route path="/login" element={<Login/>}> </Route>
        <Route path="/reset" element={<Reset/>}> </Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
