import { delay } from './api';
import { mockApplications } from '../mocks/data';
import { Application, ApplicationStage } from '../types/application';

export const applicationService = {
  async getApplications(): Promise<Application[]> {
    await delay(300);
    return mockApplications;
  },
  async updateStage(id: string, stage: ApplicationStage): Promise<Application> {
    await delay(200);
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.stage = stage;
    return app;
  },
};