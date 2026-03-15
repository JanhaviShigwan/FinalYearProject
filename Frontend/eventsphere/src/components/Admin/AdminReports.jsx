import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Building2,
  CalendarClock,
  Download,
  FileText,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';
import API_URL from '../../api';
import { getAdminRequestConfig } from '../../utils/adminAuth';

const PAGE_SIZE = 8;
const AUTO_REFRESH_MS = 15000;

const formatBreakdown = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 'N/A';
  }

  return items
    .map((item) => `${item?.name || 'Unknown'} (${item?.count || 0})`)
    .join(' | ');
};

const getFilenameFromDisposition = (headerValue, fallbackName) => {
  if (!headerValue || typeof headerValue !== 'string') {
    return fallbackName;
  }

  const filenameStarMatch = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
  if (filenameStarMatch?.[1]) {
    return decodeURIComponent(filenameStarMatch[1]);
  }

  const filenameMatch = headerValue.match(/filename="?([^";]+)"?/i);
  return filenameMatch?.[1] || fallbackName;
};

export default function AdminReports({ onUnauthorized, refreshToken = 0 }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [activeExportKey, setActiveExportKey] = useState('');

  const fetchReports = useCallback(
    async (targetPage, searchQuery, options = {}) => {
      const shouldShowLoader = options.silent !== true;

      try {
        if (shouldShowLoader) {
          setIsLoading(true);
        }

        setError('');

        const res = await axios.get(`${API_URL}/dashboard/admin/reports`, {
          ...getAdminRequestConfig(),
          params: {
            page: targetPage,
            limit: PAGE_SIZE,
            q: searchQuery || undefined,
          },
        });

        setReports(res.data?.reports || []);
        setPagination({
          page: res.data?.pagination?.page || 1,
          total: res.data?.pagination?.total || 0,
          totalPages: res.data?.pagination?.totalPages || 1,
        });
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          if (onUnauthorized) onUnauthorized();
          return;
        }

        setError(err.response?.data?.message || 'Failed to fetch reports.');
      } finally {
        if (shouldShowLoader) {
          setIsLoading(false);
        }
      }
    },
    [onUnauthorized]
  );

  useEffect(() => {
    fetchReports(page, query);
  }, [fetchReports, page, query]);

  useEffect(() => {
    if (!refreshToken) {
      return;
    }

    fetchReports(page, query, { silent: true });
  }, [refreshToken, fetchReports, page, query]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchReports(page, query, { silent: true });
    }, AUTO_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [fetchReports, page, query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(inputValue.trim());
  };

  const handleRefresh = () => {
    fetchReports(page, query);
  };

  const handleExport = async (reportId, format) => {
    const exportKey = `${reportId}-${format}`;

    try {
      setActiveExportKey(exportKey);

      const response = await axios.get(
        `${API_URL}/dashboard/admin/reports/${reportId}/export/${format}`,
        {
          ...getAdminRequestConfig(),
          responseType: 'blob',
        }
      );

      const extension = format === 'pdf' ? 'pdf' : 'csv';
      const fallback = `event-report-${reportId}.${extension}`;
      const filename = getFilenameFromDisposition(
        response.headers['content-disposition'],
        fallback
      );

      const blobUrl = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        if (onUnauthorized) onUnauthorized();
        return;
      }

      setError(err.response?.data?.message || 'Failed to export report.');
    } finally {
      setActiveExportKey('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-soft-blush p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-deep-slate">Event Reports</h2>
            <p className="text-sm text-deep-slate/55 mt-1">
              Search completed events and export each report in one click.
            </p>
            <p className="text-xs text-deep-slate/45 mt-1">
              Auto-updates every 15 seconds and at event end-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-lavender/10 text-lavender">
              Total: {pagination.total}
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-soft-blush text-sm font-semibold text-deep-slate hover:bg-warm-cream transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-deep-slate/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by event name, category, or venue"
              className="w-full rounded-xl border border-soft-blush bg-warm-cream px-10 py-3 text-sm text-deep-slate placeholder:text-deep-slate/35 focus:outline-none focus:ring-2 focus:ring-lavender/40"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-lavender text-white px-5 py-3 text-sm font-bold hover:bg-lavender/90 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-soft-blush p-6 shadow-sm text-sm text-deep-slate/60">
          Loading reports...
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {reports.map((report) => {
            const totalParticipants = report?.participantStats?.totalParticipants || 0;
            const pdfKey = `${report._id}-pdf`;

            return (
              <article
                key={report._id}
                className="bg-white rounded-2xl border border-soft-blush p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-40 h-28 rounded-xl bg-warm-cream border border-soft-blush overflow-hidden flex items-center justify-center">
                    {report.eventImage ? (
                      <img
                        src={report.eventImage}
                        alt={report.eventName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-deep-slate/40 flex flex-col items-center gap-1 text-xs">
                        <ImageIcon className="w-4 h-4" />
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-deep-slate truncate">{report.eventName}</h3>
                    <p className="text-sm text-deep-slate/60 mt-1 line-clamp-2">
                      {report.shortDescription || report.longDescription || 'No description available.'}
                    </p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-deep-slate/75">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warm-cream border border-soft-blush">
                        <CalendarClock className="w-3.5 h-3.5" />
                        {report.date || 'N/A'} {report.time || ''}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warm-cream border border-soft-blush">
                        <MapPin className="w-3.5 h-3.5" />
                        {report.venue || 'N/A'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warm-cream border border-soft-blush">
                        <Building2 className="w-3.5 h-3.5" />
                        {report.category || 'N/A'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warm-cream border border-soft-blush">
                        <Users className="w-3.5 h-3.5" />
                        Participants: {totalParticipants}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-soft-blush text-deep-slate/80">
                    Capacity: {report.totalCapacity || 0}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-soft-blush text-deep-slate/80">
                    Registrations: {report.registrationCount || 0}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-soft-blush text-deep-slate/80">
                    Fill Rate: {report.fillRatePercent || 0}%
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-soft-blush text-deep-slate/80">
                    Top Dept: {report.topDepartment || 'N/A'}
                  </span>
                </div>

                <div className="mt-4 text-xs text-deep-slate/70 space-y-1">
                  <p><strong>Departments:</strong> {formatBreakdown(report?.participantStats?.departments)}</p>
                  <p><strong>Years:</strong> {formatBreakdown(report?.participantStats?.years)}</p>
                  <p><strong>Genders:</strong> {formatBreakdown(report?.participantStats?.genders)}</p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExport(report._id, 'pdf')}
                    disabled={activeExportKey === pdfKey}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-coral text-white text-sm font-bold hover:bg-coral/90 transition-colors disabled:opacity-60"
                  >
                    {activeExportKey === pdfKey ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    {activeExportKey === pdfKey ? 'Exporting...' : 'Export PDF'}
                  </button>

                  <span className="inline-flex items-center gap-1.5 text-xs text-deep-slate/55 ml-auto">
                    <Download className="w-3.5 h-3.5" />
                    One-click downloads
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-soft-blush p-6 shadow-sm text-sm text-deep-slate/60">
          No reports found for the selected search.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-soft-blush p-4 shadow-sm flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={pagination.page <= 1 || isLoading}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 rounded-lg border border-soft-blush text-sm font-semibold text-deep-slate disabled:opacity-50 hover:bg-warm-cream transition-colors"
        >
          Previous
        </button>

        <p className="text-sm font-semibold text-deep-slate/70">
          Page {pagination.page} of {pagination.totalPages}
        </p>

        <button
          type="button"
          disabled={pagination.page >= pagination.totalPages || isLoading}
          onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
          className="px-4 py-2 rounded-lg border border-soft-blush text-sm font-semibold text-deep-slate disabled:opacity-50 hover:bg-warm-cream transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
