import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    const { email, name, password } = dto;
    return this.authService.signUp(email, name, password);
  }

  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    const { email, password } = dto;
    return this.authService.signIn(email, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: any) {
    return { userId: req.user.userId, email: req.user.email };
  }
}
