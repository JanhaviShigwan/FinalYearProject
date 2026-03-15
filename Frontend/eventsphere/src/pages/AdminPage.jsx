import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import AdminNavbar from '../components/Admin/AdminNavbar';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminAnnouncements from '../components/Admin/AdminAnnouncments';
import AdminEvents from '../components/Admin/AdminEvents';
import AdminCreateEvent from '../components/Admin/AdminCreateEvent';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const tabTitles = {
    dashboard: 'Dashboard',
    announcements: 'Announcements',
    events: 'Manage Events',
    'create-event': 'Create Event',
    registrations: 'Registrations',
    users: 'Users',
    settings: 'Settings',
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_URL}/announcements`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  // Fetch events (assuming there's an events endpoint)
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
  }, []);

  // Handle posting announcement
  const handlePostAnnouncement = async (announcement) => {
    try {
      const res = await axios.post(`${API_URL}/announcements`, {
        title: announcement.title,
        message: announcement.message,
      });
      setAnnouncements((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Error posting announcement:', err);
    }
  };

  // Handle deleting announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${API_URL}/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      setIsCreatingEvent(true);
      const res = await axios.post(`${API_URL}/events/create`, eventData);
      await fetchEvents();
      setActiveTab('events');
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create event.';
      throw new Error(message);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Handle events
  const handleEditEvent = (event) => {
    console.log('Edit event:', event);
  };

  const handleDeleteEvent = (id) => {
    console.log('Delete event:', id);
  };

  const handleViewEvent = (event) => {
    console.log('View event:', event);
  };

  const handleLogout = () => {
    localStorage.removeItem('eventSphereStudent');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setActiveTab} />;
      case 'announcements':
        return (
          <AdminAnnouncements
            announcements={announcements}
            onPost={handlePostAnnouncement}
            onDelete={handleDeleteAnnouncement}
          />
        );
      case 'events':
        return (
          <AdminEvents
            events={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onView={handleViewEvent}
          />
        );
      case 'create-event':
        return (
          <AdminCreateEvent
            onCreate={handleCreateEvent}
            onCancel={() => setActiveTab('events')}
            isSubmitting={isCreatingEvent}
          />
        );
      case 'registrations':
        return <AdminDashboard />;
      case 'users':
        return <AdminDashboard />;
      case 'settings':
        return <AdminDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminNavbar title={tabTitles[activeTab] || 'Dashboard'} />

        <main className="flex-1 p-6 lg:p-8 bg-warm-cream">
          {renderContent()}
        </main>

        <footer className="px-6 py-4 text-center text-sm text-deep-slate/35 border-t border-soft-blush bg-warm-cream">
          © 2026 College Event Management System • Admin Control Panel
        </footer>
      </div>
    </div>
  );
}