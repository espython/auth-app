import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'salt:hashedpassword',
  };

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user and return access token', async () => {
      const email = 'newuser@example.com';
      const name = 'New User';
      const password = 'Password123!';
      const accessToken = 'jwt.token.here';

      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.signUp(email, name, password);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        email.toLowerCase(),
        name,
        expect.any(String) // passwordHash
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        access_token: accessToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });

    it('should convert email to lowercase', async () => {
      const email = 'NewUser@EXAMPLE.COM';
      const name = 'New User';
      const password = 'Password123!';

      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.signUp(email, name, password);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        'newuser@example.com',
        name,
        expect.any(String)
      );
    });

    it('should hash the password before storing', async () => {
      const password = 'Password123!';
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.signUp('test@example.com', 'Test', password);

      const hashedPassword = mockUsersService.create.mock.calls[0][2];
      expect(hashedPassword).toContain(':'); // salt:hash format
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.split(':').length).toBe(2);
    });
  });

  describe('signIn', () => {
    it('should sign in user with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const accessToken = 'jwt.token.here';

      // First, create a properly hashed password
      await service.signUp(email, 'Test', password);
      const storedHash = mockUsersService.create.mock.calls[0][2];

      // Mock user with the actual hash
      const userWithHash = { ...mockUser, passwordHash: storedHash };
      mockUsersService.findByEmail.mockResolvedValue(userWithHash);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.signIn(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        email.toLowerCase()
      );
      expect(result).toEqual({
        access_token: accessToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.signIn('nonexistent@example.com', 'password')
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.signIn('nonexistent@example.com', 'password')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Create a hash for a different password
      const correctPassword = 'CorrectPassword123!';
      const wrongPassword = 'WrongPassword123!';

      await service.signUp('test@example.com', 'Test', correctPassword);
      const storedHash = mockUsersService.create.mock.calls[0][2];

      const userWithHash = { ...mockUser, passwordHash: storedHash };
      mockUsersService.findByEmail.mockResolvedValue(userWithHash);

      await expect(
        service.signIn('test@example.com', wrongPassword)
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.signIn('test@example.com', wrongPassword)
      ).rejects.toThrow('Invalid credentials');
    });

    it('should convert email to lowercase when signing in', async () => {
      const email = 'Test@EXAMPLE.COM';
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(email, 'password')).rejects.toThrow();

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });
  });

  describe('password hashing and verification', () => {
    it('should create different hashes for the same password (due to random salt)', async () => {
      const password = 'Password123!';
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.signUp('user1@example.com', 'User1', password);
      const hash1 = mockUsersService.create.mock.calls[0][2];

      await service.signUp('user2@example.com', 'User2', password);
      const hash2 = mockUsersService.create.mock.calls[1][2];

      expect(hash1).not.toBe(hash2);
    });

    it('should verify password correctly with stored hash', async () => {
      const password = 'TestPassword123!';
      const email = 'test@example.com';

      // Create hash
      await service.signUp(email, 'Test', password);
      const storedHash = mockUsersService.create.mock.calls[0][2];

      // Verify with correct password
      const userWithHash = { ...mockUser, passwordHash: storedHash };
      mockUsersService.findByEmail.mockResolvedValue(userWithHash);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.signIn(email, password);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('token generation', () => {
    it('should generate JWT token with correct payload', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const accessToken = 'generated.jwt.token';

      await service.signUp(email, 'Test', password);
      const storedHash = mockUsersService.create.mock.calls[0][2];

      const userWithHash = { ...mockUser, passwordHash: storedHash };
      mockUsersService.findByEmail.mockResolvedValue(userWithHash);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      await service.signIn(email, password);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should return user information along with token', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'Password123!';

      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.signUp(email, name, password);

      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });
});
