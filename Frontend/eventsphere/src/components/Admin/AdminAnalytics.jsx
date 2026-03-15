import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  ClipboardList,
  Megaphone,
  Users,
} from 'lucide-react';
import API_URL from '../../api';
import { getAdminRequestConfig } from '../../utils/adminAuth';

export default function AdminAnalytics({
  statsData = {},
  events = [],
  announcements = [],
  recentRegistrations = [],
  isLoading = false,
}) {
  const filterOptions = [
    { id: '7', label: 'Last 7 Days' },
    { id: '30', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' },
  ];

  const [selectedRange, setSelectedRange] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    stats: statsData,
    trends: {},
    chartSeries: {
      events: [],
      students: [],
      registrations: [],
      announcements: [],
    },
    recentRegistrations,
    filterMeta: {
      trendDays: 30,
    },
  });
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsFetching(true);
        setFetchError('');

        const query = selectedRange === 'all' ? '' : `?rangeDays=${selectedRange}`;
        const res = await axios.get(
          `${API_URL}/dashboard/admin/overview${query}`,
          getAdminRequestConfig()
        );

        setAnalyticsData(res.data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setFetchError(err.response?.data?.message || 'Could not refresh analytics for the selected date range.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchAnalytics();
  }, [selectedRange]);

  const activeStats = analyticsData.stats || statsData;
  const activeTrends = analyticsData.trends || {};
  const activeSeries = analyticsData.chartSeries || {};
  const activeRecentRegistrations =
    analyticsData.recentRegistrations?.length > 0
      ? analyticsData.recentRegistrations
      : recentRegistrations;

  const categoryBreakdown = useMemo(() => {
    const counts = {};

    events.forEach((event) => {
      const category = event.category || 'Uncategorized';
      counts[category] = (counts[category] || 0) + 1;
    });

    const rows = Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const maxCount = rows.length > 0 ? rows[0].count : 1;

    return rows.map((row) => ({
      ...row,
      percent: Math.max(8, Math.round((row.count / maxCount) * 100)),
    }));
  }, [events]);

  const summaryCards = [
    {
      key: 'totalEvents',
      chartKey: 'events',
      label: 'Total Events',
      value: activeStats.totalEvents ?? 0,
      icon: Calendar,
      iconClass: 'bg-lavender/15 text-lavender',
    },
    {
      key: 'totalStudents',
      chartKey: 'students',
      label: 'Total Students',
      value: activeStats.totalStudents ?? 0,
      icon: Users,
      iconClass: 'bg-coral/15 text-coral',
    },
    {
      key: 'totalRegistrations',
      chartKey: 'registrations',
      label: 'Total Registrations',
      value: activeStats.totalRegistrations ?? 0,
      icon: ClipboardList,
      iconClass: 'bg-pastel-green/20 text-[#74A66A]',
    },
    {
      key: 'totalAnnouncements',
      chartKey: 'announcements',
      label: 'Announcements',
      value: activeStats.totalAnnouncements ?? announcements.length,
      icon: Megaphone,
      iconClass: 'bg-soft-blush text-[#B9786B]',
    },
  ];

  const renderTrendBadge = (trendItem) => {
    const trend = trendItem || { percent: 0, direction: 'neutral' };

    const iconByDirection = {
      up: ArrowUpRight,
      down: ArrowDownRight,
      neutral: ArrowRight,
    };

    const styleByDirection = {
      up: 'text-[#5CA76A] bg-[#5CA76A]/10',
      down: 'text-[#C3635D] bg-[#C3635D]/10',
      neutral: 'text-deep-slate/55 bg-deep-slate/10',
    };

    const TrendIcon = iconByDirection[trend.direction] || ArrowRight;

    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${styleByDirection[trend.direction] || styleByDirection.neutral}`}>
        <TrendIcon className="w-3.5 h-3.5" />
        {trend.percent > 0 ? '+' : ''}{trend.percent}%
      </span>
    );
  };

  const renderMiniBars = (series = []) => {
    const bars = series.slice(-10);

    if (bars.length === 0) {
      return <div className="h-10 rounded-lg bg-warm-cream/70" />;
    }

    const maxValue = Math.max(...bars.map((point) => point.value), 1);

    return (
      <div className="h-10 flex items-end gap-1 mt-4">
        {bars.map((point, index) => (
          <span
            key={`${point.key || point.label || 'point'}-${index}`}
            title={`${point.label}: ${point.value}`}
            className="flex-1 rounded-t-md bg-lavender/70 hover:bg-lavender transition-colors"
            style={{
              height: `${Math.max(14, Math.round((point.value / maxValue) * 100))}%`,
            }}
          />
        ))}
      </div>
    );
  };

  const trendDays = analyticsData.filterMeta?.trendDays || 30;
  const periodLabel = `vs previous ${trendDays} days`;

  if (isLoading || isFetching) {
    return (
      <div className="bg-white rounded-2xl border border-soft-blush p-7 shadow-sm text-deep-slate/60">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-soft-blush p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-lavender/15 text-lavender flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-deep-slate">Analytics Overview</h2>
              <p className="text-sm text-deep-slate/55">Live insights from your EventSphere database.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedRange(option.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedRange === option.id
                    ? 'bg-lavender text-white shadow-[0_8px_18px_rgba(143,138,217,0.35)]'
                    : 'bg-warm-cream text-deep-slate/70 hover:text-deep-slate'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {fetchError ? (
          <p className="mb-4 text-sm text-coral font-semibold">{fetchError}</p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const trend = activeTrends[card.key];

            return (
              <div key={card.label} className="rounded-2xl border border-soft-blush p-5 bg-warm-cream/35">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-deep-slate/65">{card.label}</span>
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconClass}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-deep-slate">{card.value}</p>
                <div className="mt-3 flex items-center justify-between">
                  {renderTrendBadge(trend)}
                  <span className="text-[11px] text-deep-slate/45 font-semibold">{periodLabel}</span>
                </div>
                {renderMiniBars(activeSeries[card.chartKey] || [])}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <section className="xl:col-span-3 bg-white rounded-2xl border border-soft-blush p-6 shadow-sm">
          <h3 className="text-lg font-bold text-deep-slate mb-5">Event Categories</h3>

          {categoryBreakdown.length > 0 ? (
            <div className="space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-deep-slate">{item.category}</span>
                    <span className="text-deep-slate/60">{item.count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-warm-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-lavender transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-deep-slate/55">No events found to generate category analytics.</p>
          )}
        </section>

        <section className="xl:col-span-2 bg-white rounded-2xl border border-soft-blush p-6 shadow-sm">
          <h3 className="text-lg font-bold text-deep-slate mb-5">Recent Registrations</h3>

          {activeRecentRegistrations.length > 0 ? (
            <div className="space-y-3.5">
              {activeRecentRegistrations.slice(0, 5).map((entry) => (
                <div key={entry._id} className="rounded-xl border border-soft-blush p-3.5 bg-warm-cream/30">
                  <p className="font-semibold text-deep-slate leading-tight">{entry.eventName}</p>
                  <p className="text-sm text-deep-slate/60 mt-1">{entry.studentName}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-deep-slate/55">No registration activity available.</p>
          )}
        </section>
      </div>
    </div>
  );
}
