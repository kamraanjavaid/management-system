import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class HealthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getHealthStatus() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    
    return {
      status: 'OK',
      timestamp,
      uptime: `${Math.floor(uptime)}s`,
      service: 'Management System API',
      version: '1.0.0',
    };
  }

  async getDatabaseHealth() {
    const connectionTest = await this.supabaseService.testConnection();
    
    return {
      status: connectionTest.connected ? 'OK' : 'ERROR',
      database: 'Supabase',
      connected: connectionTest.connected,
      message: connectionTest.message,
      timestamp: new Date().toISOString(),
    };
  }
}