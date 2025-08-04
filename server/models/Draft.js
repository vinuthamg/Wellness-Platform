const mongoose = require('mongoose');

const DraftSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'yoga'
  },
  duration: {
    type: Number,
    default: 30
  },
  content: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastSaved: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Draft', DraftSchema);