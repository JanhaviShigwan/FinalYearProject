import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Mail, Search, ShieldCheck, Trash2, Users } from 'lucide-react';
import API_URL from '../../api';
import { getAdminRequestConfig } from '../../utils/adminAuth';

export default function AdminUsers({ onDataChanged }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [busyUserId, setBusyUserId] = useState('');

  const fetchUsers = useCallback(async (opts = {}) => {
    const targetPage = opts.page ?? 1;

    try {
      setLoading(true);
      setError('');

      const res = await axios.get(`${API_URL}/student/admin/users`, {
        ...getAdminRequestConfig(),
        params: {
          search,
          role: roleFilter,
          year: yearFilter,
          department: departmentFilter,
          page: targetPage,
          limit: 10,
        },
      });

      setUsers(res.data.users || []);
      setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [departmentFilter, roleFilter, search, yearFilter]);

  useEffect(() => {
    fetchUsers({ page: 1 });
  }, [fetchUsers, roleFilter, yearFilter, departmentFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers({ page: 1 });
    }, 350);

    return () => clearTimeout(timer);
  }, [fetchUsers, search]);

  const departments = useMemo(() => {
    const set = new Set(users.map((u) => u.department).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [users]);

  const years = ['all', 'FY', 'SY', 'TY', 'Final Year'];

  const patchUser = async (studentId, payload) => {
    try {
      setBusyUserId(studentId);
      await axios.patch(
        `${API_URL}/student/admin/users/${studentId}`,
        payload,
        getAdminRequestConfig()
      );
      await fetchUsers({ page });
      if (onDataChanged) await onDataChanged();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setBusyUserId('');
    }
  };

  const handleRoleChange = async (user, nextRole) => {
    await patchUser(user._id, { role: nextRole });
  };

  const handleNotificationToggle = async (user) => {
    await patchUser(user._id, { notificationsEnabled: !user.notificationsEnabled });
  };

  const handleDeleteUser = async (user) => {
    const ok = window.confirm(`Delete ${user.name} (${user.email})? This action cannot be undone.`);
    if (!ok) return;

    try {
      setBusyUserId(user._id);
      await axios.delete(
        `${API_URL}/student/admin/users/${user._id}`,
        getAdminRequestConfig()
      );
      await fetchUsers({ page });
      if (onDataChanged) await onDataChanged();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setBusyUserId('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-soft-blush p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold text-deep-slate">Users Management</h3>
            <p className="text-sm text-deep-slate/55 mt-1">Manage roles, notifications, and student accounts.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold bg-lavender/10 text-lavender px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4" />
            {pagination.total} Users
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <div className="xl:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-slate/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, student ID..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-warm-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-lavender/45"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-warm-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-lavender/45"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-warm-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-lavender/45"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year === 'all' ? 'All Years' : year}</option>
            ))}
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-warm-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-lavender/45"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-2xl border border-soft-blush shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-warm-cream/55 border-b border-soft-blush">
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-deep-slate/55">User</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-deep-slate/55">Role</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-deep-slate/55">Year</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-deep-slate/55">Profile</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-deep-slate/55">Notifications</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-deep-slate/55">Joined</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-deep-slate/55 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-blush">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-deep-slate/55">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-deep-slate/55">No users found for selected filters.</td>
                </tr>
              ) : (
                users.map((user) => {
                  const isBusy = busyUserId === user._id;
                  const isAdmin = user.role === 'admin';

                  return (
                    <tr key={user._id} className="hover:bg-warm-cream/25 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-deep-slate">{user.name}</p>
                        <p className="text-sm text-deep-slate/60 inline-flex items-center gap-1.5 mt-1">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </p>
                        {user.studentId ? (
                          <p className="text-xs text-deep-slate/45 mt-1">ID: {user.studentId}</p>
                        ) : null}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.role || 'student'}
                          disabled={isBusy}
                          onChange={(e) => handleRoleChange(user, e.target.value)}
                          className="rounded-lg px-3 py-2 bg-warm-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-lavender/45"
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-sm text-deep-slate/70">{user.year || '-'}</td>

                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isAdmin ? 'bg-deep-slate/10 text-deep-slate' : user.profileComplete ? 'bg-[#5CA76A]/15 text-[#4E8C5A]' : 'bg-soft-blush text-[#A9756A]'}`}>
                          {isAdmin ? 'Admin Account' : user.profileComplete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          disabled={isBusy}
                          onClick={() => handleNotificationToggle(user)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition ${user.notificationsEnabled ? 'bg-lavender/15 text-lavender hover:bg-lavender/25' : 'bg-deep-slate/10 text-deep-slate/70 hover:bg-deep-slate/20'}`}
                        >
                          {user.notificationsEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>

                      <td className="px-5 py-4 text-sm text-deep-slate/60">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          disabled={isBusy}
                          onClick={() => handleDeleteUser(user)}
                          className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-semibold"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-soft-blush bg-warm-cream/25 flex items-center justify-between">
          <p className="text-sm text-deep-slate/55">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
          </p>

          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() => {
                const next = Math.max(pagination.page - 1, 1);
                setPage(next);
                fetchUsers({ page: next });
              }}
              className="px-3 py-1.5 rounded-lg border border-soft-blush text-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => {
                const next = Math.min(pagination.page + 1, pagination.totalPages);
                setPage(next);
                fetchUsers({ page: next });
              }}
              className="px-3 py-1.5 rounded-lg border border-soft-blush text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="bg-lavender/10 border border-lavender/20 rounded-2xl p-5 text-sm text-deep-slate/75">
        <p className="font-bold text-lavender inline-flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Admin Tip
        </p>
        <p className="mt-2">Role and notification changes are saved directly to the database and reflected immediately across the platform.</p>
      </div>
    </div>
  );
}
