import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
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
import AdminReports from '../components/Admin/AdminReports';
import { getAdminRequestConfig, getStoredStudent, isAdminStudent } from '../utils/adminAuth';

const REPORT_REFRESH_MS = 5000;

const parseEventTime = (rawTime) => {
  if (!rawTime || typeof rawTime !== 'string') {
    return null;
  }

  const value = rawTime.trim();

  const twelveHourMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    const hour12 = Number(twelveHourMatch[1]);
    const minute = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3].toUpperCase();

    if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) {
      return null;
    }

    let hour24 = hour12 % 12;
    if (period === 'PM') {
      hour24 += 12;
    }

    return { hours: hour24, minutes: minute };
  }

  const twentyFourHourMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    return { hours: hour, minutes: minute };
  }

  return null;
};

const getEventEndTimestamp = (event) => {
  if (!event?.date) {
    return null;
  }

  const parsedDate = new Date(`${event.date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const parsedTime = parseEventTime(event.time);

  if (parsedTime) {
    parsedDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  } else {
    parsedDate.setHours(23, 59, 59, 999);
  }

  parsedDate.setHours(parsedDate.getHours() + 3);

  return parsedDate.getTime();
};

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
    eventReports: [],
    reportSyncMeta: {
      totalGeneratedReports: 0,
      syncedReportsCount: 0,
    },
  });
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [reportRefreshToken, setReportRefreshToken] = useState(0);
  const [adminSettings, setAdminSettings] = useState({
    eventDefaults: {
      defaultCapacity: 200,
      registrationOpenDaysBefore: 14,
      defaultCategory: 'Workshop',
      defaultVenue: '',
      autoCloseWhenFull: true,
    },
  });

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
    reports: 'Reports',
    users: 'Users',
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

  const fetchAdminOverview = useCallback(async (options = {}) => {
    const isSilent = options.silent === true;

    try {
      if (!isSilent) {
        setIsDashboardLoading(true);
      }

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
      if (!isSilent) {
        setIsDashboardLoading(false);
      }
    }
  }, [handleLogout]);

  const fetchAdminSettings = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/settings`,
        getAdminRequestConfig()
      );

      if (res.data?.settings) {
        setAdminSettings(res.data.settings);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  }, [handleLogout]);

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
    fetchAdminOverview();
    fetchAdminSettings();
  }, [fetchAnnouncements, fetchEvents, fetchAdminOverview, fetchAdminSettings]);

  useEffect(() => {
    if (["dashboard", "analytics", "reports", "users"].includes(activeTab)) {
      fetchAdminOverview();
    }
  }, [activeTab, fetchAdminOverview]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAnnouncements();
      fetchEvents();
      fetchAdminOverview({ silent: true });
      setReportRefreshToken((prev) => prev + 1);
    }, REPORT_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [fetchAnnouncements, fetchEvents, fetchAdminOverview]);

  useEffect(() => {
    if (!["dashboard", "reports"].includes(activeTab)) {
      return undefined;
    }

    if (!events.length) {
      return undefined;
    }

    const now = Date.now();
    const nextEventEnd = events
      .map(getEventEndTimestamp)
      .filter((value) => Number.isFinite(value) && value > now)
      .sort((a, b) => a - b)[0];

    if (!nextEventEnd) {
      return undefined;
    }

    const delay = Math.min(
      Math.max(1500, nextEventEnd - now + 1200),
      15 * 60 * 1000
    );

    const timeoutId = setTimeout(() => {
      fetchAdminOverview();
      fetchEvents();
      setReportRefreshToken((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [activeTab, events, fetchAdminOverview, fetchEvents]);

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
      const resolvedCapacity =
        Number.isFinite(Number(eventData.totalCapacity)) && Number(eventData.totalCapacity) > 0
          ? Number(eventData.totalCapacity)
          : Number(adminSettings?.eventDefaults?.defaultCapacity) || 200;

      const payload = {
        ...eventData,
        totalCapacity: resolvedCapacity,
      };

      const res = await axios.post(
        `${API_URL}/events/create`,
        payload,
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

      const message = err.response?.data?.message
        || (err.code === 'ERR_NETWORK' ? 'Backend server is not reachable. Please start the backend and try again.' : '')
        || (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : '')
        || err.message
        || 'Failed to create event.';
      throw new Error(message);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Handle events
  const handleEditEvent = async (eventId, updates) => {
    try {
      const res = await axios.patch(
        `${API_URL}/events/${eventId}`,
        updates,
        getAdminRequestConfig()
      );

      setEvents((prev) =>
        prev.map((event) =>
          (event._id || event.id) === eventId ? res.data : event
        )
      );

      await fetchAdminOverview();
      return res.data;
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }

      const message = err.response?.data?.message || 'Failed to update event.';
      throw new Error(message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/events/${id}`,
        getAdminRequestConfig()
      );

      setEvents((prev) =>
        prev.filter((event) => (event._id || event.id) !== id)
      );

      await fetchAdminOverview();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }

      const message = err.response?.data?.message || 'Failed to delete event.';
      throw new Error(message);
    }
  };

  const handleViewEvent = (event) => {
    return event;
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
            defaultCapacity={Number(adminSettings?.eventDefaults?.defaultCapacity) || 200}
            defaultCategory={adminSettings?.eventDefaults?.defaultCategory || 'Workshop'}
            defaultVenue={adminSettings?.eventDefaults?.defaultVenue || ''}
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
      case 'users':
        return (
          <AdminUsers
            onDataChanged={fetchAdminOverview}
          />
        );
      case 'reports':
        return (
          <AdminReports
            onUnauthorized={handleLogout}
            refreshToken={reportRefreshToken}
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

  const contentTransition = {
    initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      filter: 'blur(4px)',
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-6 py-4 text-center text-sm text-deep-slate/35 border-t border-soft-blush bg-warm-cream">
          © 2026 College Event Management System • Admin Control Panel
        </footer>
      </div>
    </div>
  );
}