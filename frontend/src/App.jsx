/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './signin';
import CreateEmployee from './CreateEmployee';
import EditEmployee from './EditEmployee';
import Signup from './Signup';
import ShowEmployee from './ShowEmployee';
import {Toaster} from "react-hot-toast"

// Import the AppProvider

const App = () => {
  return (
  <>
   <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/edit-employee" element={<EditEmployee />} /> 
          <Route path="/show-employees" element={<ShowEmployee />} />          
        </Routes>
      </BrowserRouter>
      </>
  );
};

export default App;
