import axios from 'axios';

/**
 * Build the ParsedResume payload that FastAPI expects.
 * Maps MongoDB CandidateProfile + User into AI schema string arrays.
 */
const buildResumePayload = (profile, candidateUser) => {
  const name  = candidateUser?.name  || '';
  const email = candidateUser?.email || '';
  const phone = profile?.phone || '';
  const skills = (profile?.skills || []);

  const experience = (profile?.experience || []).map((e) => {
    const parts = [];
    if (e.title)   parts.push(e.title);
    if (e.company) parts.push(`at ${e.company}`);
    if (e.years)   parts.push(`- ${e.years} year${e.years !== 1 ? 's' : ''}`);
    return parts.join(' ');
  }).filter(Boolean);

  const education = (profile?.education || []).map((e) => {
    const parts = [];
    if (e.degree)      parts.push(e.degree);
    if (e.institution) parts.push(`at ${e.institution}`);
    if (e.year)        parts.push(`- ${e.year}`);
    return parts.join(' ');
  }).filter(Boolean);

  return {
    name,
    email,
    phone,
    skills,
    experience,
    education,
    projects: [],
    certifications: [],
  };
};

/**
 * Build a rich job description string from the Job document.
 */
const buildJobDescription = (job) => {
  const parts = [];
  if (job.title)       parts.push(job.title);
  if (job.description) parts.push(job.description);
  if (job.skills && job.skills.length > 0) {
    parts.push(`Required skills: ${job.skills.join(', ')}`);
  }
  return parts.join('. ');
};

/**
 * Deterministic fallback — matches the real AI response schema exactly
 * so the rest of the application never sees a different field shape.
 */
const generateFallbackAnalysis = (profile, job) => {
  const profileSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const jobSkills     = (job.skills     || []).map((s) => s.toLowerCase());

  const matchedSkills = jobSkills.filter((s) => profileSkills.includes(s));
  const missingSkills = jobSkills.filter((s) => !profileSkills.includes(s));
  const experienceYears = (profile.experience || []).reduce(
    (sum, e) => sum + (e.years || 0), 0
  );

  const skillScore = jobSkills.length > 0
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 70;
  const expScore = Math.min(40 + experienceYears * 5, 100);
  const matchScore = Math.max(0, Math.min(100,
    Math.round(skillScore * 0.70 + expScore * 0.30)
  ));

  const strengths = matchedSkills.length > 0
    ? [`Strong alignment on ${matchedSkills.slice(0, 3).join(', ')}`]
    : ['Candidate has relevant general experience'];
  const weaknesses = missingSkills.length > 0
    ? [`Limited experience in ${missingSkills.slice(0, 3).join(', ')}`]
    : ['No major skill gaps identified'];

  let recommendation = 'LOW MATCH';
  if (matchScore >= 90)      recommendation = 'STRONGLY SHORTLIST';
  else if (matchScore >= 75) recommendation = 'SHORTLIST';
  else if (matchScore >= 60) recommendation = 'REVIEW';

  return {
    matchScore,
    scoreBreakdown: {
      skills:     skillScore,
      experience: expScore,
      education:  70,
      projects:   60,
    },
    matchedSkills,
    missingSkills,
    strengths,
    weaknesses,
    recommendation,
    source: 'fallback',
  };
};

/**
 * Analyze a candidate resume against a job using the Python AI service.
 * Falls back to deterministic scoring when the AI service is unavailable.
 *
 * @param {Object} profile        - MongoDB CandidateProfile document
 * @param {Object} job            - MongoDB Job document
 * @param {Object} candidateUser  - Populated User document (has .name, .email)
 */
export const analyzeResume = async (profile, job, candidateUser = null) => {
  const aiUrl = process.env.AI_SERVICE_URL;

  if (aiUrl) {
    try {
      const resumePayload  = buildResumePayload(profile, candidateUser);
      const jobDescription = buildJobDescription(job);

      const response = await axios.post(
        `${aiUrl}/api/ai/analyze-resume`,
        { jobDescription, resume: resumePayload },
        { timeout: 15000 }
      );

      console.log('[AI Service] Analysis successful via', aiUrl);
      return response.data;
    } catch (error) {
      console.warn(
        '[AI Service] Unavailable, using deterministic fallback:',
        error.message
      );
    }
  }

  console.log('[AI Service] No AI_SERVICE_URL configured — using fallback');
  return generateFallbackAnalysis(profile, job);
};
