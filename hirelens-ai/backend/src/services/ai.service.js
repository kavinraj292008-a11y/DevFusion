import axios from 'axios';

export const analyzeResume = async (resumeData, jobData) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, {
      resume: resumeData,
      job: jobData
    }, { timeout: 15000 });
    return response.data;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    throw new Error('AI Service temporarily unavailable');
  }
};