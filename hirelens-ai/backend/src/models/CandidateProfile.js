import mongoose from 'mongoose';

const candidateProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String },
  location: { type: String },
  headline: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  experience: [{ title: String, company: String, years: Number }],
  education: [{ degree: String, institution: String, year: Number }],
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  portfolioUrl: { type: String },
  resumeUrl: { type: String },
  resumeOriginalName: { type: String },
  resumeUploadedAt: { type: Date },
  profileCompletion: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('CandidateProfile', candidateProfileSchema);