const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({

  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  
  eventName: {
    type: String,
    required: true
  },

  shortDescription: {
    type: String,
    required: true
  },

  longDescription: {
    type: String
  },

  category: {
    type: String,
    required: true
  },

  venue: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  endDate: {
    type: String,
    default: ""
  },

  endTime: {
    type: String,
    default: ""
  },

  eventImage: {
    type: String,
    required: true
  },

  registeredUsers: {
    type: Number,
    default: 0
  },

  totalCapacity: {
    type: Number,
    required: true
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  isTrending: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);