import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, name: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email.toLowerCase(), name, passwordHash);
    return this.issueToken(user.id, user.email, user.name);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user.id, user.email, user.name);
  }

  private async issueToken(userId: string, email: string, name: string) {
    const payload = { sub: userId, email };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      user: { id: userId, email, name },
    };
  }
}
