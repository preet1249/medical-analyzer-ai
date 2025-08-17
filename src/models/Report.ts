import mongoose, { Schema, Document } from 'mongoose';

interface Analysis {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  medicinesSuggested: string[];
  reportType: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  imageUrl: string;
  analysis: Analysis;
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema<Analysis>({
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

const ReportSchema = new Schema<IReport>({
  userId: {
    type: Schema.Types.ObjectId,
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

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);