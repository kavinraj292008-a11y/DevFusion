import axios from 'axios';

// Fallback mock analysis when AI service is unavailable
const generateMockAnalysis = (profile, job) => {
  const profileSkills = (profile.skills || []).map(s => s.toLowerCase());
  const jobSkills = (job.skills || []).map(s => s.toLowerCase());

  const matchedSkills = jobSkills.filter(s => profileSkills.includes(s));
  const missingSkills = jobSkills.filter(s => !profileSkills.includes(s));

  const experienceYears = profile.experience?.reduce((sum, e) => sum + (e.years || 0), 0) || 0;
  const baseScore = Math.min(
    Math.round((matchedSkills.length / Math.max(jobSkills.length, 1)) * 70 + Math.min(experienceYears * 3, 30)),
    100
  );

  return {
    score: baseScore,
    strengths: matchedSkills.length > 0
      ? [`Proficient in ${matchedSkills.slice(0, 3).join(', ')} — key requirements for this role.`]
      : ['Candidate has general experience relevant to this role.'],
    gaps: missingSkills.length > 0
      ? [`May need to demonstrate proficiency in: ${missingSkills.slice(0, 3).join(', ')}.`]
      : ['No major skill gaps identified.'],
    summary: `Candidate scored ${baseScore}% match based on skill overlap and experience.`,
    source: 'mock',
  };
};

export const analyzeResume = async (profile, job) => {
  // Try real AI service first
  if (process.env.AI_SERVICE_URL && process.env.AI_SERVICE_URL !== 'http://localhost:8000') {
    try {
      const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, {
        resume: profile,
        job: job,
      }, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.warn('[AI Service] External service unavailable, using fallback:', error.message);
    }
  }

  // Fallback: local skill-matching analysis
  return generateMockAnalysis(profile, job);
};
