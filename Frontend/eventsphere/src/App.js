import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

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

import AdminPage from "./pages/AdminPage";
import ConfirmPopup from "./components/popup";
import {
  BLOCKED_EVENT,
  BLOCKED_POPUP_MESSAGE,
  consumeBlockedNotice,
  isBlockedPayload,
  triggerBlockedLogout,
} from "./utils/blockedUser";

function App() {
  const [blockedPopupOpen, setBlockedPopupOpen] = useState(false);

  useEffect(() => {
    if (consumeBlockedNotice()) {
      setBlockedPopupOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleBlockedEvent = () => {
      setBlockedPopupOpen(true);
    };

    window.addEventListener(BLOCKED_EVENT, handleBlockedEvent);

    return () => {
      window.removeEventListener(BLOCKED_EVENT, handleBlockedEvent);
    };
  }, []);

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isBlockedPayload(error?.response?.data)) {
          triggerBlockedLogout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

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

        {/* ADMIN */}
        <Route path="/admin" element={<AdminPage />} />

      </Routes>

      <ConfirmPopup
        open={blockedPopupOpen}
        onClose={() => setBlockedPopupOpen(false)}
        onConfirm={() => setBlockedPopupOpen(false)}
        title="Account Blocked"
        description={BLOCKED_POPUP_MESSAGE}
        confirmText="OK"
        cancelText="Close"
      />

    </Router>

  );

}

export default App;