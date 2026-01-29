import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService, UserProfile } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

export class LoginDto {
  email: string;
  password: string;
}

export class TokenLoginDto {
  access_token: string;
}

export class AuthResponseDto {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
  };
}

export class MeResponseDto {
  success: boolean;
  data?: UserProfile;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login endpoint - authenticate with email/password
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
      };
    }

    const session = await this.authService.signInWithPassword(email, password);

    if (!session) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: session.profile,
        token: session.token,
      },
    };
  }

  /**
   * Token login endpoint - exchange Supabase token for session
   * POST /auth/token-login
   */
  @Post('token-login')
  @HttpCode(HttpStatus.OK)
  async tokenLogin(@Body() tokenLoginDto: TokenLoginDto): Promise<AuthResponseDto> {
    const { access_token } = tokenLoginDto;

    if (!access_token) {
      return {
        success: false,
        message: 'Access token is required',
      };
    }

    const session = await this.authService.getSession(access_token);

    if (!session) {
      return {
        success: false,
        message: 'Invalid or expired token',
      };
    }

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: session.profile,
        token: session.token,
      },
    };
  }

  /**
   * Get current user profile
   * GET /auth/me
   * Protected endpoint - requires valid JWT
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any): Promise<MeResponseDto> {
    const user = req.user as UserProfile;

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Verify token endpoint
   * POST /auth/verify
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Request() req: any): Promise<{ valid: boolean; user?: UserProfile }> {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    const profile = await this.authService.verifyToken(token);

    if (!profile) {
      return { valid: false };
    }

    return {
      valid: true,
      user: profile,
    };
  }
}
