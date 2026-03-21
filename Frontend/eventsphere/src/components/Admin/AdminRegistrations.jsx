import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  QrCode,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import API_URL from '../../api';
import { getAdminRequestConfig } from '../../utils/adminAuth';

const ATTENDANCE_SYNC_INTERVAL_MS = 2000;

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [qrModal, setQrModal] = useState(null); // { student, event, reg }
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const fetchRegistrations = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError('');
      const res = await axios.get(
        `${API_URL}/attendance/registrations`,
        getAdminRequestConfig()
      );
      setRegistrations(Array.isArray(res.data) ? res.data : []);
      setLastSyncedAt(new Date());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load registrations.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
    const interval = setInterval(() => fetchRegistrations(true), ATTENDANCE_SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchRegistrations]);

  useEffect(() => {
    const refreshWhenActive = () => {
      if (document.visibilityState === 'visible') {
        fetchRegistrations(true);
      }
    };

    window.addEventListener('focus', refreshWhenActive);
    document.addEventListener('visibilitychange', refreshWhenActive);

    return () => {
      window.removeEventListener('focus', refreshWhenActive);
      document.removeEventListener('visibilitychange', refreshWhenActive);
    };
  }, [fetchRegistrations]);

  // Unique events for filter dropdown
  const uniqueEvents = Array.from(
    new Map(
      registrations
        .filter((r) => r.event)
        .map((r) => [String(r.event._id), r.event])
    ).values()
  );

  const filtered = registrations.filter((r) => {
    const studentName = r.student?.name?.toLowerCase() || '';
    const studentIdStr = r.student?.studentId?.toLowerCase() || '';
    const eventName = r.event?.eventName?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchesSearch = !q || studentName.includes(q) || studentIdStr.includes(q) || eventName.includes(q);
    const matchesEvent = eventFilter === 'all' || String(r.event?._id) === eventFilter;
    const matchesAttendance =
      attendanceFilter === 'all' ||
      (attendanceFilter === 'marked' && r.attendanceMarked) ||
      (attendanceFilter === 'unmarked' && !r.attendanceMarked);
    return matchesSearch && matchesEvent && matchesAttendance;
  });

  const markedCount = registrations.filter((r) => r.attendanceMarked).length;

  const formatTime = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-lavender" />
          <div>
            <h2 className="text-2xl font-extrabold text-deep-slate">Registrations</h2>
            <p className="text-sm text-deep-slate/50 mt-0.5">
              {registrations.length} total &nbsp;·&nbsp;
              <span className="text-deep-slate font-semibold">{markedCount} attended</span>
            </p>
            {lastSyncedAt && (
              <p className="text-xs text-deep-slate/35 mt-1">
                Synced at {lastSyncedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => fetchRegistrations()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-lavender/30 bg-lavender/10 text-lavender text-sm font-bold hover:bg-lavender hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-slate/35 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or event…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-soft-blush bg-white text-sm text-deep-slate placeholder-deep-slate/35 focus:outline-none focus:ring-2 focus:ring-lavender/30"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-soft-blush bg-white text-sm text-deep-slate focus:outline-none focus:ring-2 focus:ring-lavender/30"
        >
          <option value="all">All Events</option>
          {uniqueEvents.map((ev) => (
            <option key={ev._id} value={String(ev._id)}>{ev.eventName}</option>
          ))}
        </select>
        <select
          value={attendanceFilter}
          onChange={(e) => setAttendanceFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-soft-blush bg-white text-sm text-deep-slate focus:outline-none focus:ring-2 focus:ring-lavender/30"
        >
          <option value="all">All Attendance</option>
          <option value="marked">Marked</option>
          <option value="unmarked">Not Marked</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center text-deep-slate/40 text-sm font-medium">Loading registrations…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-deep-slate/40 text-sm font-medium">No registrations found.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-soft-blush shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-soft-blush bg-warm-cream">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-deep-slate/50">Student</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-deep-slate/50">Event</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-deep-slate/50">Registered At</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-deep-slate/50">QR Code</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-deep-slate/50">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr
                    key={r._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-soft-blush/50 hover:bg-warm-cream/60 transition-colors"
                  >
                    {/* Student */}
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-deep-slate">{r.student?.name || '—'}</p>
                      <p className="text-xs text-deep-slate/45 mt-0.5">{r.student?.email || ''}</p>
                      {r.student?.studentId && (
                        <p className="text-xs text-deep-slate/35 mt-0.5">{r.student.studentId}</p>
                      )}
                    </td>

                    {/* Event */}
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-deep-slate">{r.event?.eventName || '—'}</p>
                      <p className="text-xs text-deep-slate/45 mt-0.5">{r.event?.date || ''}</p>
                    </td>

                    {/* Registered At */}
                    <td className="px-5 py-3.5 text-deep-slate/60 whitespace-nowrap">
                      {formatTime(r.registeredAt)}
                    </td>

                    {/* QR Code */}
                    <td className="px-5 py-3.5">
                      {r.student && r.event ? (
                        <button
                          onClick={() => setQrModal(r)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-lavender/30 bg-lavender/10 text-lavender text-xs font-bold hover:bg-lavender hover:text-white transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          View QR
                        </button>
                      ) : (
                        <span className="text-deep-slate/30 text-xs">—</span>
                      )}
                    </td>

                    {/* Attendance */}
                    <td className="px-5 py-3.5">
                      {r.attendanceMarked ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-deep-slate shrink-0" />
                            <span className="text-xs font-bold text-deep-slate bg-pastel-green/30 px-2 py-0.5 rounded-full border border-pastel-green/50">
                              Marked
                            </span>
                          </div>
                          <p className="text-xs text-deep-slate/45 mt-1">{formatTime(r.attendanceTime)}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <CircleDashed className="w-4 h-4 text-deep-slate/30 shrink-0" />
                          <span className="text-xs font-medium text-deep-slate/40">Not Marked</span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setQrModal(null)}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-deep-slate">Entry QR Code</h3>
              <button
                onClick={() => setQrModal(null)}
                className="p-1.5 rounded-lg hover:bg-warm-cream transition-colors"
              >
                <X className="w-5 h-5 text-deep-slate/50" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-warm-cream border border-soft-blush">
              <QRCodeSVG
                value={JSON.stringify({
                  studentId: String(qrModal.student?._id || ''),
                  eventId: String(qrModal.event?._id || ''),
                })}
                size={180}
                fgColor="#3F3D56"
                bgColor="transparent"
                level="M"
              />
            </div>

            <div className="w-full text-center">
              <p className="font-extrabold text-deep-slate">{qrModal.event?.eventName}</p>
              <p className="text-sm text-deep-slate/50 mt-1">{qrModal.event?.date}</p>
            </div>

            <div className="w-full rounded-xl bg-lavender/10 border border-lavender/20 px-4 py-3 text-center">
              <p className="text-xs text-lavender font-semibold">{qrModal.student?.name}</p>
              <p className="text-xs text-deep-slate/40 mt-0.5">{qrModal.student?.email}</p>
            </div>

            {qrModal.attendanceMarked ? (
              <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-pastel-green/20 border border-pastel-green/40 px-4 py-2.5">
                <CheckCircle2 className="w-4 h-4 text-deep-slate shrink-0" />
                <div className="text-center">
                  <p className="text-xs font-bold text-deep-slate">Attendance Marked</p>
                  {qrModal.attendanceTime && (
                    <p className="text-xs text-deep-slate/55 mt-0.5">{formatTime(qrModal.attendanceTime)}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-soft-blush/60 border border-soft-blush px-4 py-2.5">
                <CircleDashed className="w-4 h-4 text-deep-slate/40 shrink-0" />
                <p className="text-xs text-deep-slate/50 font-medium">Not yet scanned</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
