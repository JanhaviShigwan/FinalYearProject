import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';
import AdminNavbar from '../components/Admin/AdminNavbar';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminAnnouncements from '../components/Admin/AdminAnnouncments';
import AdminEvents from '../components/Admin/AdminEvents';
import AdminCreateEvent from '../components/Admin/AdminCreateEvent';
import AdminAnalytics from '../components/Admin/AdminAnalytics';
import AdminUsers from '../components/Admin/AdminUsers';
import { getAdminRequestConfig, getStoredStudent, isAdminStudent } from '../utils/adminAuth';

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminOverview, setAdminOverview] = useState({
    stats: {
      totalEvents: 0,
      totalStudents: 0,
      totalRegistrations: 0,
      totalAnnouncements: 0,
    },
    recentRegistrations: [],
  });
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('eventSphereStudent');
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const student = getStoredStudent();

    if (!isAdminStudent(student)) {
      localStorage.removeItem('eventSphereStudent');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const tabTitles = {
    dashboard: 'Dashboard',
    announcements: 'Announcements',
    events: 'Manage Events',
    'create-event': 'Create Event',
    analytics: 'Analytics',
    registrations: 'Registrations',
    users: 'Users',
    settings: 'Settings',
  };

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/announcements`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  }, []);

  // Fetch events (assuming there's an events endpoint)
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }, []);

  const fetchAdminOverview = useCallback(async () => {
    try {
      setIsDashboardLoading(true);
      const res = await axios.get(
        `${API_URL}/dashboard/admin/overview`,
        getAdminRequestConfig()
      );
      setAdminOverview(res.data);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setIsDashboardLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
    fetchAdminOverview();
  }, [fetchAnnouncements, fetchEvents, fetchAdminOverview]);

  useEffect(() => {
    if (["dashboard", "analytics", "registrations", "users", "settings"].includes(activeTab)) {
      fetchAdminOverview();
    }
  }, [activeTab, fetchAdminOverview]);

  // Handle posting announcement
  const handlePostAnnouncement = async (announcement) => {
    try {
      const res = await axios.post(
        `${API_URL}/announcements`,
        {
          title: announcement.title,
          message: announcement.message,
        },
        getAdminRequestConfig()
      );
      setAnnouncements((prev) => [res.data, ...prev]);
      await fetchAdminOverview();
    } catch (err) {
      console.error('Error posting announcement:', err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  };

  // Handle deleting announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/announcements/${id}`,
        getAdminRequestConfig()
      );
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
      await fetchAdminOverview();
    } catch (err) {
      console.error('Error deleting announcement:', err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      setIsCreatingEvent(true);
      const res = await axios.post(
        `${API_URL}/events/create`,
        eventData,
        getAdminRequestConfig()
      );
      await fetchEvents();
      await fetchAdminOverview();
      setActiveTab('events');
      return res.data;
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onNavigate={setActiveTab}
            statsData={adminOverview.stats}
            recentRegistrations={adminOverview.recentRegistrations}
            isLoading={isDashboardLoading}
          />
        );
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
      case 'analytics':
        return (
          <AdminAnalytics
            statsData={adminOverview.stats}
            events={events}
            announcements={announcements}
            recentRegistrations={adminOverview.recentRegistrations}
            isLoading={isDashboardLoading}
          />
        );
      case 'registrations':
        return (
          <AdminDashboard
            onNavigate={setActiveTab}
            statsData={adminOverview.stats}
            recentRegistrations={adminOverview.recentRegistrations}
            isLoading={isDashboardLoading}
          />
        );
      case 'users':
        return (
          <AdminUsers
            onDataChanged={fetchAdminOverview}
          />
        );
      case 'settings':
        return (
          <AdminDashboard
            onNavigate={setActiveTab}
            statsData={adminOverview.stats}
            recentRegistrations={adminOverview.recentRegistrations}
            isLoading={isDashboardLoading}
          />
        );
      default:
        return (
          <AdminDashboard
            onNavigate={setActiveTab}
            statsData={adminOverview.stats}
            recentRegistrations={adminOverview.recentRegistrations}
            isLoading={isDashboardLoading}
          />
        );
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