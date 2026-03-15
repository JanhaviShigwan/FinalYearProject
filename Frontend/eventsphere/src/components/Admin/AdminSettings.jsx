import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Bell, CalendarCog, Lock, Mail, Save, Send, Shield, User } from 'lucide-react';
import API_URL from '../../api';
import { getAdminRequestConfig, getStoredStudent } from '../../utils/adminAuth';

const defaultSettingsState = {
  eventDefaults: {
    defaultCapacity: 200,
    registrationOpenDaysBefore: 14,
    defaultCategory: 'Workshop',
    defaultVenue: '',
    autoCloseWhenFull: true,
  },
  announcementSettings: {
    enableAnnouncementEmails: true,
    defaultEmailSubject: 'EventSphere Announcement',
    defaultEmailSignature: 'EventSphere Admin Team',
  },
  notificationPreferences: {
    notifyOnNewRegistration: true,
    eventFullThresholdPercent: 90,
    dailySummaryEmail: false,
  },
  securitySettings: {
    sessionTimeoutMinutes: 60,
    failedLoginLockoutAttempts: 5,
  },
};

const mergeSettings = (incoming = {}) => ({
  eventDefaults: {
    ...defaultSettingsState.eventDefaults,
    ...(incoming.eventDefaults || {}),
  },
  announcementSettings: {
    ...defaultSettingsState.announcementSettings,
    ...(incoming.announcementSettings || {}),
  },
  notificationPreferences: {
    ...defaultSettingsState.notificationPreferences,
    ...(incoming.notificationPreferences || {}),
  },
  securitySettings: {
    ...defaultSettingsState.securitySettings,
    ...(incoming.securitySettings || {}),
  },
});

export default function AdminSettings({ onSettingsUpdated }) {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  const [settingsForm, setSettingsForm] = useState(defaultSettingsState);
  const [accountForm, setAccountForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categoryOptions = useMemo(
    () => ['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Competition'],
    []
  );

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.get(
        `${API_URL}/admin/settings`,
        getAdminRequestConfig()
      );

      setSettingsForm(mergeSettings(res.data.settings));
      setAccountForm({
        name: res.data.account?.name || '',
        email: res.data.account?.email || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const patchSettings = (section, field, value) => {
    setSettingsForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const savePlatformSettings = async () => {
    try {
      setSavingSettings(true);
      setError('');
      setSuccess('');

      const res = await axios.put(
        `${API_URL}/admin/settings`,
        settingsForm,
        getAdminRequestConfig()
      );

      const merged = mergeSettings(res.data.settings);
      setSettingsForm(merged);
      setSuccess('Settings saved successfully.');

      if (onSettingsUpdated) {
        onSettingsUpdated(merged);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const saveAdminAccount = async () => {
    try {
      setSavingAccount(true);
      setError('');
      setSuccess('');

      const res = await axios.patch(
        `${API_URL}/admin/settings/account`,
        accountForm,
        getAdminRequestConfig()
      );

      const stored = getStoredStudent();
      if (stored) {
        localStorage.setItem(
          'eventSphereStudent',
          JSON.stringify({
            ...stored,
            name: res.data.account?.name || stored.name,
            email: res.data.account?.email || stored.email,
          })
        );
      }

      setSuccess('Admin account updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account.');
    } finally {
      setSavingAccount(false);
    }
  };

  const savePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Please fill all password fields.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      setError('');
      setSuccess('');

      const payload = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };

      const res = await axios.patch(
        `${API_URL}/admin/settings/password`,
        payload,
        getAdminRequestConfig()
      );

      setSuccess(res.data.message || 'Password updated successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      setSendingTestEmail(true);
      setError('');
      setSuccess('');

      const res = await axios.post(
        `${API_URL}/admin/settings/test-email`,
        {},
        getAdminRequestConfig()
      );

      setSuccess(res.data.message || 'Test email sent successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send test email.');
    } finally {
      setSendingTestEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-soft-blush shadow-sm p-8 text-deep-slate/60">
        Loading admin settings...
      </div>
    );
  }

  const cardClass = 'bg-white rounded-2xl border border-soft-blush shadow-sm p-6 space-y-5';
  const labelClass = 'text-sm font-semibold text-deep-slate';
  const inputClass =
    'w-full bg-warm-cream rounded-xl px-4 py-2.5 text-deep-slate border border-transparent focus:outline-none focus:ring-2 focus:ring-lavender/40';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      ) : null}

      <div className={cardClass}>
        <h3 className="text-xl font-bold text-deep-slate inline-flex items-center gap-2">
          <User className="w-5 h-5 text-lavender" />
          Admin Account
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={accountForm.name}
              onChange={(e) => setAccountForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Admin name"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              value={accountForm.email}
              onChange={(e) => setAccountForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="admin@somaiya.edu"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveAdminAccount}
            disabled={savingAccount}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral text-white font-bold hover:bg-coral/90 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {savingAccount ? 'Saving...' : 'Save Account'}
          </button>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-xl font-bold text-deep-slate inline-flex items-center gap-2">
          <Lock className="w-5 h-5 text-coral" />
          Security Basics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              className={inputClass}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              className={inputClass}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              className={inputClass}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Session Timeout (minutes)</label>
            <input
              type="number"
              min="5"
              max="1440"
              className={inputClass}
              value={settingsForm.securitySettings.sessionTimeoutMinutes}
              onChange={(e) => patchSettings('securitySettings', 'sessionTimeoutMinutes', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Lockout Attempts</label>
            <input
              type="number"
              min="3"
              max="20"
              className={inputClass}
              value={settingsForm.securitySettings.failedLoginLockoutAttempts}
              onChange={(e) => patchSettings('securitySettings', 'failedLoginLockoutAttempts', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={savePassword}
            disabled={savingPassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lavender text-white font-bold hover:bg-lavender/90 disabled:opacity-60"
          >
            <Shield className="w-4 h-4" />
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-xl font-bold text-deep-slate inline-flex items-center gap-2">
          <CalendarCog className="w-5 h-5 text-pastel-green" />
          Event Defaults
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Default Capacity</label>
            <input
              type="number"
              min="1"
              className={inputClass}
              value={settingsForm.eventDefaults.defaultCapacity}
              onChange={(e) => patchSettings('eventDefaults', 'defaultCapacity', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Registration Opens (days before)</label>
            <input
              type="number"
              min="0"
              max="60"
              className={inputClass}
              value={settingsForm.eventDefaults.registrationOpenDaysBefore}
              onChange={(e) => patchSettings('eventDefaults', 'registrationOpenDaysBefore', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Default Category</label>
            <select
              className={inputClass}
              value={settingsForm.eventDefaults.defaultCategory}
              onChange={(e) => patchSettings('eventDefaults', 'defaultCategory', e.target.value)}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <label className={labelClass}>Default Venue</label>
            <input
              className={inputClass}
              value={settingsForm.eventDefaults.defaultVenue}
              onChange={(e) => patchSettings('eventDefaults', 'defaultVenue', e.target.value)}
              placeholder="e.g. Main Auditorium"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-deep-slate">
              <input
                type="checkbox"
                checked={settingsForm.eventDefaults.autoCloseWhenFull}
                onChange={(e) => patchSettings('eventDefaults', 'autoCloseWhenFull', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Auto-close when full
            </label>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-xl font-bold text-deep-slate inline-flex items-center gap-2">
          <Mail className="w-5 h-5 text-coral" />
          Announcement Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-deep-slate">
              <input
                type="checkbox"
                checked={settingsForm.announcementSettings.enableAnnouncementEmails}
                onChange={(e) => patchSettings('announcementSettings', 'enableAnnouncementEmails', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Enable announcement emails
            </label>
          </div>
          <div>
            <label className={labelClass}>Default Email Subject</label>
            <input
              className={inputClass}
              value={settingsForm.announcementSettings.defaultEmailSubject}
              onChange={(e) => patchSettings('announcementSettings', 'defaultEmailSubject', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Default Signature</label>
            <input
              className={inputClass}
              value={settingsForm.announcementSettings.defaultEmailSignature}
              onChange={(e) => patchSettings('announcementSettings', 'defaultEmailSignature', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={sendTestEmail}
            disabled={sendingTestEmail}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-warm-cream text-deep-slate font-bold hover:bg-soft-blush disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {sendingTestEmail ? 'Sending...' : 'Send Test Email'}
          </button>
          <button
            onClick={savePlatformSettings}
            disabled={savingSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral text-white font-bold hover:bg-coral/90 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-xl font-bold text-deep-slate inline-flex items-center gap-2">
          <Bell className="w-5 h-5 text-lavender" />
          Notification Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-deep-slate">
            <input
              type="checkbox"
              checked={settingsForm.notificationPreferences.notifyOnNewRegistration}
              onChange={(e) => patchSettings('notificationPreferences', 'notifyOnNewRegistration', e.target.checked)}
              className="w-4 h-4 rounded"
            />
            Alert admin on new registration
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-semibold text-deep-slate">
            <input
              type="checkbox"
              checked={settingsForm.notificationPreferences.dailySummaryEmail}
              onChange={(e) => patchSettings('notificationPreferences', 'dailySummaryEmail', e.target.checked)}
              className="w-4 h-4 rounded"
            />
            Send daily summary email
          </label>

          <div>
            <label className={labelClass}>Event Full Warning (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              className={inputClass}
              value={settingsForm.notificationPreferences.eventFullThresholdPercent}
              onChange={(e) => patchSettings('notificationPreferences', 'eventFullThresholdPercent', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={savePlatformSettings}
            disabled={savingSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral text-white font-bold hover:bg-coral/90 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}