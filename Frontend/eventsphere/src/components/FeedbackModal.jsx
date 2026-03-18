import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, Loader2 } from "lucide-react";
import axios from "axios";
import API_URL from "../api";

/**
 * FeedbackModal
 *
 * Props:
 *   event     - event object (must have _id, eventName)
 *   student   - student object from localStorage (must have _id)
 *   onClose   - called when the modal should close
 *   onSuccess - called after feedback is successfully saved
 */
export default function FeedbackModal({ event, student, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please select a star rating before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await axios.post(`${API_URL}/feedback`, {
        userId: student._id,
        eventId: event._id,
        rating,
        comment: comment.trim(),
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to submit feedback. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hovered || rating;

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
              <h3 className="text-lg font-extrabold text-deep-slate">Rate This Event</h3>
              <p className="text-sm text-deep-slate/50 mt-0.5 line-clamp-1">{event.eventName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-warm-cream transition-colors"
            >
              <X className="w-5 h-5 text-deep-slate/50" />
            </button>
          </div>

          {/* Stars */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
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

          {/* Comment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-deep-slate/70">
              Comment <span className="font-normal text-deep-slate/40">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Tell us what you liked, what could be improved…"
              className="w-full rounded-xl border border-soft-blush bg-warm-cream/40 px-4 py-3 text-sm text-deep-slate placeholder:text-deep-slate/30 resize-none focus:outline-none focus:ring-2 focus:ring-lavender/40"
            />
            <span className="self-end text-xs text-deep-slate/30">{comment.length}/500</span>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm font-medium text-red-500 bg-red-50 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-soft-blush text-deep-slate/60 text-sm font-bold hover:bg-warm-cream transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-lavender text-white text-sm font-bold hover:bg-lavender/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
