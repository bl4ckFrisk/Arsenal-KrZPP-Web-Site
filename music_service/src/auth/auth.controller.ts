import { Body, Controller, Post, Get, HttpCode, Logger, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  // @Post('login')  // Login endpoint
  // async login(@Body() dto: { email: string; password: string }) {
  //   return this.authService.login(dto.email, dto.password);
  // }

  // @Post('register')
  // async register(@Body() dto: { email: string; password: string }) {
  //   return this.authService.register(dto.email, dto.password);
  // }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    this.logger.debug('Login attempt with data:', loginDto);
    const response = await this.authService.login(loginDto.email, loginDto.password);
    return { token: response.access_token, user: response.user };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.debug('Register attempt with data:', registerDto);
    
    // Register the user
    const user = await this.authService.register(
      registerDto.email, 
      registerDto.password, 
      registerDto.username,
      registerDto.nickname
    );

    // Get the token and user data
    const response = await this.authService.login(registerDto.email, registerDto.password);
    
    return { 
      token: response.access_token,
      user: response.user
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    this.logger.debug('Profile request for user:', req.user);
    const fullProfile = await this.authService.getFullProfile(req.user.id);
    return fullProfile;
  }
}