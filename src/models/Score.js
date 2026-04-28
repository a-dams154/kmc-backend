const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  eventType: {
    type: String,
    enum: ['group', 'individual'],
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  point: {
    type: Number,
    required: true,
  },
  prize: {
    type: String,
    required: true,
    trim: true,
  },
  batch: {
    type: String,
    required: true,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
