import React, { useState } from 'react';
import { Calendar, Clock3, Image, MapPin, Tag, X, Save } from 'lucide-react';

const initialForm = {
  eventName: '',
  category: 'Workshop',
  shortDescription: '',
  longDescription: '',
  venue: '',
  eventImage: '',
  date: '',
  time: '',
  endDate: '',
  endTime: '',
};

export default function AdminCreateEvent({ onCreate, onCancel, isSubmitting }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    setError('');
    setSuccess('');
    if (onCancel) onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.eventName || !form.shortDescription || !form.venue || !form.eventImage || !form.date || !form.time) {
      setError('Please fill all required fields.');
      return;
    }

    const time24hPattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!time24hPattern.test(form.time)) {
      setError('Start time must be in HH:MM format (24-hour), e.g. 14:30.');
      return;
    }

    if (form.endTime && !time24hPattern.test(form.endTime)) {
      setError('End time must be in HH:MM format (24-hour), e.g. 16:00.');
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
        eventImage: form.eventImage,
        totalCapacity: 200,
      });

      setSuccess('Event created successfully.');
      setForm(initialForm);
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
                >
                  <option>Workshop</option>
                  <option>Hackathon</option>
                  <option>Seminar</option>
                  <option>Cultural</option>
                  <option>Sports</option>
                  <option>Competition</option>
                </select>
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
              <label className="block text-sm font-bold text-deep-slate mb-2">Long Description</label>
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
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-deep-slate/45" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className={`${inputClass} pr-10`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Start Time</label>
                <div className="relative">
                  <Clock3 className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-deep-slate/45" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.time}
                    onChange={(e) => updateField('time', e.target.value)}
                    placeholder="HH:MM"
                    className={`${inputClass} pr-10`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-deep-slate/45" />
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    className={`${inputClass} pr-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">End Time</label>
                <div className="relative">
                  <Clock3 className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-deep-slate/45" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    placeholder="HH:MM"
                    className={`${inputClass} pr-10`}
                  />
                </div>
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
