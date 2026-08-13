import api from './api';

export interface AIAnalysisResult {
  score: number;
  strengths: string[];
  gaps: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
  source?: string;
}

/**
 * Trigger AI analysis for a specific application (recruiter/admin only).
 * Calls Node backend → Python AI service — never calls Python directly.
 */
export const aiService = {
  async analyzeApplication(applicationId: string): Promise<AIAnalysisResult> {
    const response = await api.post(`/applications/${applicationId}/analyze`);
    const appData = response.data?.data ?? {};
    const ai = appData.aiSummary ?? {};

    return {
      score:           ai.matchScore   ?? appData.aiScore ?? 0,
      strengths:       ai.strengths    ?? [],
      gaps:            ai.weaknesses   ?? [],
      matchedSkills:   ai.matchedSkills ?? [],
      missingSkills:   ai.missingSkills ?? [],
      recommendation:  ai.recommendation ?? '',
      source:          ai.source,
    };
  },
};
