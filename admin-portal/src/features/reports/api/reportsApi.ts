import { BaseApiService } from '../../../shared/api/BaseApiService';
import type { ReportsDashboardData } from '../types';

export class ReportsApiService extends BaseApiService {
  constructor() {
    super('/reports');
  }

  async getDashboardData() {
    return this.get<ReportsDashboardData>('/dashboard');
  }

  async exportReport(reportType: string, params?: {
    startDate?: string;
    endDate?: string;
    format?: 'pdf' | 'excel' | 'csv';
  }) {
    const filename = `${reportType}-report.${params?.format || 'pdf'}`;
    return this.downloadFile(`/export/${reportType}`, filename, params);
  }
}

export const reportsApi = new ReportsApiService();
