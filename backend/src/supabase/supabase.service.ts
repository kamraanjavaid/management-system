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
      // Test with a simple query on inventory table
      const { error } = await this.adminSupabase
        .from('inventory')
        .select('id')
        .limit(1);

      if (error) {
        // If inventory table doesn't exist, try a different approach
        // Check if we can at least get auth metadata
        const { data: authData, error: authError } = await this.adminSupabase.auth.getUser();
        
        if (authError) {
          return {
            connected: false,
            message: `Connection failed: ${authError.message}`,
          };
        }
        
        // Auth works, database might not have inventory table yet
        return {
          connected: true,
          message: 'Supabase connected (inventory table not created yet)',
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