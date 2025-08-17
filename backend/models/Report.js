const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  summary: {
    type: String,
    required: true
  },
  keyFindings: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  medicinesSuggested: [{
    type: String
  }],
  reportType: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  analysis: {
    type: AnalysisSchema,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);