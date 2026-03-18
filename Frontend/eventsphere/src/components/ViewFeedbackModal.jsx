import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Loader2, Pencil, Send } from "lucide-react";
import axios from "axios";
import API_URL from "../api";

/**
 * ViewFeedbackModal — view and optionally edit a student's submitted feedback.
 *
 * Props:
 *   event      - event object (must have _id, eventName)
 *   student    - student object from localStorage (must have _id)
 *   onClose    - called when the modal should close
 *   onUpdated  - optional callback after a successful edit
 */
export default function ViewFeedbackModal({ event, student, onClose, onUpdated }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  // edit mode state
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/feedback/${event._id}/${student._id}`)
      .then((r) => {
        const f = r.data?.feedback || null;
        setFeedback(f);
        if (f) {
          setEditRating(f.rating);
          setEditComment(f.comment || "");
        }
      })
      .catch(() => setFeedback(null))
      .finally(() => setLoading(false));
  }, [event._id, student._id]);

  const handleSave = async () => {
    if (!editRating) {
      setError("Please select a star rating.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await axios.patch(
        `${API_URL}/feedback/${event._id}/${student._id}`,
        { rating: editRating, comment: editComment.trim() }
      );
      setFeedback(res.data);
      setEditing(false);
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const displayRating = hovered || editRating;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-deep-slate">
                {editing ? "Edit Feedback" : "Your Feedback"}
              </h3>
              <p className="text-sm text-deep-slate/50 mt-0.5 line-clamp-1">{event.eventName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-warm-cream transition-colors"
            >
              <X className="w-5 h-5 text-deep-slate/50" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-lavender" />
            </div>
          ) : !feedback ? (
            <p className="text-sm text-deep-slate/50 text-center py-6">
              No feedback found for this event.
            </p>
          ) : editing ? (
            /* ── Edit mode ── */
            <>
              <div className="flex justify-center">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onMouseEnter={() => setHovered(n)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setEditRating(n)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          n <= displayRating
                            ? "text-amber-400 fill-amber-400"
                            : "text-deep-slate/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-deep-slate/70">
                  Comment <span className="font-normal text-deep-slate/40">(optional)</span>
                </label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full rounded-xl border border-soft-blush bg-warm-cream/40 px-4 py-3 text-sm text-deep-slate placeholder:text-deep-slate/30 resize-none focus:outline-none focus:ring-2 focus:ring-lavender/40"
                />
                <span className="self-end text-xs text-deep-slate/30">{editComment.length}/500</span>
              </div>

              {error && (
                <p className="text-sm font-medium text-red-500 bg-red-50 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setEditing(false); setError(""); }}
                  className="flex-1 py-3 rounded-xl border border-soft-blush text-deep-slate/60 text-sm font-bold hover:bg-warm-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-lavender text-white text-sm font-bold hover:bg-lavender/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </>
          ) : (
            /* ── View mode ── */
            <>
              <div className="flex justify-center">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`w-9 h-9 ${
                        n <= feedback.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-deep-slate/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {feedback.comment ? (
                <div className="rounded-xl border border-soft-blush bg-warm-cream/40 px-4 py-3 text-sm text-deep-slate leading-relaxed">
                  {feedback.comment}
                </div>
              ) : (
                <p className="text-sm text-deep-slate/40 text-center italic">No comment provided.</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-soft-blush text-deep-slate/60 text-sm font-bold hover:bg-warm-cream transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-lavender/30 bg-lavender/10 text-lavender text-sm font-bold hover:bg-lavender hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
