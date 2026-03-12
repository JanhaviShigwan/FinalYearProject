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

import CalendarPage from "./components/CalendarPage";

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

        {/* EVENT DETAILS */}
        <Route path="/events/:id" element={<EventDetails />} />



        {/* DASHBOARD LAYOUT ROUTES */}
        <Route element={<MainLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/my-registrations"
            element={<MyRegistrations />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* ✅ NEW CALENDAR ROUTE */}
          <Route
            path="/calendar"
            element={<CalendarPage />}
          />

        </Route>



        {/* OTHER PAGES */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />

      </Routes>

    </Router>

  );

}

export default App;