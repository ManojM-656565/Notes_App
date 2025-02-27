import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Signup/SignUp";

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Fetch token from local storage

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return token ? element : null; // If token exists, show the component, else null (redirect happens)
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />} />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Default route to login */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
