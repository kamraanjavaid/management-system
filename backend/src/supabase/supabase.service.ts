import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private adminSupabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('PROJECT_URL');
    const anonKey = this.configService.get<string>('ANON_KEY');
    const serviceKey = this.configService.get<string>('SERVICE_ROLE');

    if (!supabaseUrl || !anonKey || !serviceKey) {
      throw new Error('Supabase Config is missing! Check PROJECT_URL, ANON_KEY, and SERVICE_ROLE in .env');
    }
    
    // Client for user operations (uses anon key)
    this.supabase = createClient(supabaseUrl, anonKey);
    
    // Admin client for server operations (uses service role key)
    this.adminSupabase = createClient(supabaseUrl, serviceKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAdminClient(): SupabaseClient {
    return this.adminSupabase;
  }

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      // Test with a simple query
      const { error } = await this.adminSupabase
        .from('auth.users')
        .select('id')
        .limit(1);

      if (error) {
        // If that fails, try a basic connection test
        const { error: healthError } = await this.adminSupabase
          .rpc('version');

        if (healthError) {
          return {
            connected: false,
            message: `Connection failed: ${healthError.message}`,
          };
        }
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