import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  /**
   * Verify Supabase session token and return user profile
   */
  async verifyToken(token: string): Promise<UserProfile | null> {
    try {
      // First try to verify as our JWT token
      try {
        const payload = this.jwtService.verify(token);
        return {
          id: payload.sub,
          email: payload.email,
          full_name: payload.full_name,
        };
      } catch (jwtError) {
        // If JWT verification fails, try Supabase token verification
        console.log('JWT verification failed, trying Supabase token');
      }

      // Verify the JWT with Supabase
      const { data: userData, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !userData?.user) {
        console.error('Token verification failed:', error?.message);
        return null;
      }

      const user = userData.user;
      const metadata = user.user_metadata || {};

      return {
        id: user.id,
        email: user.email || '',
        full_name: metadata.full_name || user.email?.split('@')[0] || 'User',
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  /**
   * Generate a session token for the frontend
   */
  generateSessionToken(userProfile: UserProfile): string {
    const payload = {
      sub: userProfile.id,
      email: userProfile.email,
      full_name: userProfile.full_name,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Verify Supabase session and return profile with token
   */
  async getSession(supabaseToken: string): Promise<{ profile: UserProfile; token: string } | null> {
    const profile = await this.verifyToken(supabaseToken);
    
    if (!profile) {
      return null;
    }

    const token = this.generateSessionToken(profile);
    
    return { profile, token };
  }
}
