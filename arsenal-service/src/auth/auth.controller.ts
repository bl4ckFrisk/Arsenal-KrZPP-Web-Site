import { Body, Controller, Post, Get, HttpCode, Logger, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

interface CreateUserDto {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: string;
  department: string;
  employeeId: string;
}

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
    const response = await this.authService.login(loginDto.username, loginDto.password);
    return { token: response.access_token, user: response.user };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.debug('Register attempt with data:', registerDto);
    
    // Register the user
    const user = await this.authService.register(
      registerDto.email, 
      registerDto.password, 
      registerDto.username
    );

    // Get the token and user data
    const response = await this.authService.login(registerDto.username, registerDto.password);
    
    return { 
      token: response.access_token,
      user: response.user
    };
  }

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.debug('Create user attempt with data:', createUserDto);
    
    // Create the user with full data
    const user = await this.authService.createUser(createUserDto);
    
    return { 
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        position: user.position,
        department: user.department,
        employeeId: user.employeeId
      }
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