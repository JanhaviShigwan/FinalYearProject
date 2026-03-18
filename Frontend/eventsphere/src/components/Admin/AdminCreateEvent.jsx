import React, { useEffect, useMemo, useState } from 'react';
import { Image, MapPin, Tag, X, Save } from 'lucide-react';
import axios from 'axios';

const buildInitialForm = (defaults) => ({
  eventName: '',
  category: '',
  shortDescription: '',
  longDescription: '',
  venue: defaults.defaultVenue || '',
  eventImage: '',
  date: '',
  time: '',
  endDate: '',
  endTime: '',
  totalCapacity: '',
});

export default function AdminCreateEvent({
  onCreate,
  onCancel,
  isSubmitting,
  defaultCapacity = 200,
  defaultCategory = '',
  defaultVenue = '',
}) {
  const defaults = useMemo(
    () => ({
      defaultCapacity,
      defaultCategory,
      defaultVenue,
    }),
    [defaultCapacity, defaultCategory, defaultVenue]
  );

  const [form, setForm] = useState(() => buildInitialForm(defaults));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      venue: prev.venue || defaults.defaultVenue,
    }));
  }, [defaults]);

  const todayDate = new Date().toISOString().split('T')[0];

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm(buildInitialForm(defaults));
    setError('');
    setSuccess('');
    if (onCancel) onCancel();
  };

  const handleGenerateAI = async () => {
    setError('');
    setSuccess('');

    if (isGeneratingDescription) {
      return;
    }

    if (!form.eventName.trim()) {
      setError('Please enter event name before generating.');
      return;
    }

    if (!form.shortDescription.trim()) {
      setError('Please enter short description before generating.');
      return;
    }

    try {
      setIsGeneratingDescription(true);

      const res = await axios.post(
        'http://localhost:5000/api/ai/generate-description',
        {
          eventName: form.eventName.trim(),
          shortDescription: form.shortDescription.trim(),
        }
      );

      if (res.data?.description) {
        setForm((prev) => ({
          ...prev,
          longDescription: res.data.description,
        }));
      }
    } catch (err) {
      console.error('AI generation failed:', err);
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || 'Unable to generate description right now. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.category) {
      setError('Please select a category.');
      return;
    }

    if (!form.eventName || !form.shortDescription || !form.venue || !form.eventImage || !form.date || !form.time) {
      setError('Please fill all required fields.');
      return;
    }

    if (form.date < todayDate) {
      setError('Past dates cannot be selected.');
      return;
    }

    if (form.endDate && form.endDate < form.date) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    if (form.endDate) {
      const startDateTime = new Date(`${form.date}T00:00:00`);
      const endDateTime = new Date(`${form.endDate}T23:59:59`);

      const diffTime = Math.abs(endDateTime - startDateTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        setError('Event duration cannot exceed 7 days.');
        return;
      }
    }

    if (
      form.endDate
      && form.endTime
      && form.endDate === form.date
      && form.endTime <= form.time
    ) {
      setError('End time must be greater than start time.');
      return;
    }

    if (!Number.isFinite(Number(form.totalCapacity))) {
      setError('Total capacity must be a valid number.');
      return;
    }

    if (Number(form.totalCapacity) < 0) {
      setError('Total capacity cannot be negative.');
      return;
    }

    try {
      await onCreate({
        eventName: form.eventName,
        shortDescription: form.shortDescription,
        longDescription: form.longDescription,
        category: form.category,
        venue: form.venue,
        date: form.date,
        time: form.time,
        endDate: form.endDate,
        endTime: form.endTime,
        eventImage: form.eventImage,
        totalCapacity: Number(form.totalCapacity),
      });

      setSuccess('Event created successfully.');
      setForm(buildInitialForm(defaults));
    } catch (err) {
      setError(err.message || 'Failed to create event.');
    }
  };

  const inputClass =
    'w-full bg-warm-cream rounded-xl px-4 py-3 text-deep-slate placeholder:text-deep-slate/35 border border-transparent focus:outline-none focus:ring-2 focus:ring-lavender/40';

  const sectionTitleClass = 'text-sm font-extrabold tracking-[0.14em] uppercase text-deep-slate/35 mb-4 flex items-center gap-2';

  return (
    <div className="max-w-5xl animate-in fade-in duration-300">
      <form noValidate onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-soft-blush shadow-[0_12px_26px_rgba(63,61,86,0.09)] overflow-hidden">
        <div className="bg-lavender px-7 py-7 text-white">
          <h2 className="text-[36px] md:text-[40px] font-extrabold leading-none">Create New Event</h2>
          <p className="mt-2 text-white/80 text-base">Fill in the details below to host a new college event.</p>
        </div>

        <div className="p-7 space-y-8">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{success}</div>
          ) : null}

          <section>
            <h3 className={sectionTitleClass}>
              <Tag className="w-4 h-4" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Event Name</label>
                <input
                  type="text"
                  value={form.eventName}
                  onChange={(e) => updateField('eventName', e.target.value)}
                  placeholder="e.g. Annual Tech Fest 2026"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Competition">Competition</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Total Capacity</label>
                <input
                  type="number"
                  min="0"
                  value={form.totalCapacity}
                  onChange={(e) => updateField('totalCapacity', e.target.value)}
                  placeholder="e.g. 200"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-bold text-deep-slate mb-2">Short Description</label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                placeholder="A brief catchy summary of the event"
                className={inputClass}
                required
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-bold text-deep-slate">Long Description</label>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingDescription}
                  className="rounded-xl bg-lavender px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-lavender/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGeneratingDescription ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea
                rows={5}
                value={form.longDescription}
                onChange={(e) => updateField('longDescription', e.target.value)}
                placeholder="Detailed information about the event, rules, and schedule..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          <section>
            <h3 className={sectionTitleClass}>
              <MapPin className="w-4 h-4" />
              Location & Timing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Venue</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => updateField('venue', e.target.value)}
                  placeholder="e.g. Main Auditorium, Block C"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Image URL</label>
                <div className="relative">
                  <Image className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-deep-slate/35" />
                  <input
                    type="url"
                    value={form.eventImage}
                    onChange={(e) => updateField('eventImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Start Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  min={todayDate}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Start Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  min={form.date || todayDate}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => updateField('endTime', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-soft-blush p-6 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-deep-slate font-semibold hover:bg-warm-cream transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-coral text-white font-bold hover:bg-coral/90 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
