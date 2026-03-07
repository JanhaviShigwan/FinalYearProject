import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/AboutUs";
import Faq from "./pages/FAQ";
import ForgotPassword from "./pages/forgotpass";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>

      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* EVENTS */}
        <Route path="/events" element={<Events />} />

        {/* DYNAMIC EVENT PAGE */}
        <Route path="/events/:id" element={<EventDetails />} />

        {/* DASHBOARD PROTECTED ROUTE */}
        <Route
          path="/dashboard"
          element={
            localStorage.getItem("eventSphereStudent")
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* OTHER PAGES */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />

      </Routes>

    </Router>
  );
}

export default App;