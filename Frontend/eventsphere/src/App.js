import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/AboutUs";
import Faq from "./pages/FAQ";
import ForgotPassword from "./pages/forgotpass";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import MyRegistrations from "./components/MyRegistrations";
import MainLayout from "./pages/Layout";

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
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* OTHER PAGES */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />

      </Routes>

    </Router>
  );
}

export default App;