import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

constructor(private configService: ConfigService) {
  const supabaseUrl = this.configService.get<string>('PROJECT_URL');
  const supabaseKey = this.configService.get<string>('SERVICE_ROLE');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase Config is missing! Check PROJECT_URL and SERVICE_ROLE in .env');
  }
  
  this.supabase = createClient(supabaseUrl, supabaseKey);
}

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const { data, error } = await this.supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1);

      if (error) {
        return {
          connected: false,
          message: `Connection failed: ${error.message}`,
        };
      }

      return {
        connected: true,
        message: 'Successfully connected to Supabase',
      };
    } catch (error) {
      return {
        connected: false,
        message: `Connection error: ${error.message}`,
      };
    }
  }
}