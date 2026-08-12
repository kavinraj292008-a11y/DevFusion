import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ['applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  appliedAt: { type: Date, default: Date.now },
  shortlistedAt: { type: Date },
  rejectedAt: { type: Date },
  notes: { type: String },
  aiScore: { type: Number },
  aiSummary: { type: Object }
}, { timestamps: true });

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true }); // Prevent double apply

export default mongoose.model('Application', applicationSchema);