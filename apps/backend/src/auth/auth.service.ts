import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, name: string, password: string) {
    const passwordHash = await this.hashPassword(password);
    const user = await this.usersService.create(email.toLowerCase(), name, passwordHash);
    return this.issueToken(user.id, user.email, user.name);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.verifyPassword(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user.id, user.email, user.name);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(':');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
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
