import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactDOM } from 'react-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import React, { useState } from 'react';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}> </Route>
        <Route path="/signIn" element={<SignIn/>}> </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
