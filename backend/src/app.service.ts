import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Management System API',
      version: '1.0.0',
      description: 'Backend API for Orby MobileHub Management System',
      endpoints: {
        health: '/api/health',
        database: '/api/health/database',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
