import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String },
  location: { type: String },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior', 'Executive'] },
  skills: [{ type: String }],
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  openings: { type: Number, default: 1 },
  status: { type: String, enum: ['draft', 'published', 'closed'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationDeadline: { type: Date },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);