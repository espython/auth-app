import axios, { AxiosError } from 'axios';

describe('Authentication E2E Tests', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000/api';
  
  // Generate unique email for each test run to avoid conflicts
  const timestamp = Date.now();
  const testUser = {
    email: `test${timestamp}@example.com`,
    name: 'Test User',
    password: 'TestPassword123!',
  };

  let accessToken: string;

  describe('POST /auth/signup', () => {
    it('should successfully register a new user', async () => {
      const res = await axios.post(`${API_URL}/auth/signup`, testUser);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('access_token');
      expect(res.data).toHaveProperty('user');
      expect(res.data.user).toHaveProperty('id');
      expect(res.data.user.email).toBe(testUser.email);
      expect(res.data.user.name).toBe(testUser.name);
      expect(res.data.user).not.toHaveProperty('password');
      expect(res.data.user).not.toHaveProperty('passwordHash');

      // Store token for later tests
      accessToken = res.data.access_token;
    });

    it('should reject signup with duplicate email', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, testUser);
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(409);
        expect(err.response?.data).toHaveProperty('message');
      }
    });

    it('should reject signup with invalid email format', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, {
          email: 'invalid-email',
          name: 'Test User',
          password: 'TestPassword123!',
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });

    it('should reject signup with short name (less than 3 characters)', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, {
          email: `test${Date.now()}@example.com`,
          name: 'AB',
          password: 'TestPassword123!',
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });

    it('should reject signup with weak password (no special character)', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, {
          email: `test${Date.now()}@example.com`,
          name: 'Test User',
          password: 'TestPassword123',
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });

    it('should reject signup with weak password (no number)', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, {
          email: `test${Date.now()}@example.com`,
          name: 'Test User',
          password: 'TestPassword!',
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });

    it('should reject signup with weak password (no letter)', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, {
          email: `test${Date.now()}@example.com`,
          name: 'Test User',
          password: '12345678!',
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });

    it('should reject signup with short password (less than 8 characters)', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, {
          email: `test${Date.now()}@example.com`,
          name: 'Test User',
          password: 'Test1!',
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });

    it('should reject signup with missing required fields', async () => {
      try {
        await axios.post(`${API_URL}/auth/signup`, {
          email: `test${Date.now()}@example.com`,
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });
  });

  describe('POST /auth/signin', () => {
    it('should successfully sign in with valid credentials', async () => {
      const res = await axios.post(`${API_URL}/auth/signin`, {
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('access_token');
      expect(res.data).toHaveProperty('user');
      expect(res.data.user.email).toBe(testUser.email);
      expect(res.data.user).not.toHaveProperty('password');
      expect(res.data.user).not.toHaveProperty('passwordHash');
    });

    it('should sign in with case-insensitive email', async () => {
      const res = await axios.post(`${API_URL}/auth/signin`, {
        email: testUser.email.toUpperCase(),
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('access_token');
    });

    it('should reject signin with incorrect password', async () => {
      try {
        await axios.post(`${API_URL}/auth/signin`, {
          email: testUser.email,
          password: 'WrongPassword123!',
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(401);
        expect(err.response?.data).toHaveProperty('message', 'Invalid credentials');
      }
    });

    it('should reject signin with non-existent email', async () => {
      try {
        await axios.post(`${API_URL}/auth/signin`, {
          email: 'nonexistent@example.com',
          password: testUser.password,
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(401);
        expect(err.response?.data).toHaveProperty('message', 'Invalid credentials');
      }
    });

    it('should reject signin with missing credentials', async () => {
      try {
        await axios.post(`${API_URL}/auth/signin`, {
          email: testUser.email,
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });

    it('should reject signin with invalid email format', async () => {
      try {
        await axios.post(`${API_URL}/auth/signin`, {
          email: 'invalid-email',
          password: testUser.password,
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(400);
      }
    });
  });

  describe('GET /auth/me (Protected Endpoint)', () => {
    it('should return user info with valid token', async () => {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('userId');
      expect(res.data).toHaveProperty('email', testUser.email);
      expect(res.data).not.toHaveProperty('password');
      expect(res.data).not.toHaveProperty('passwordHash');
    });

    it('should reject request without token', async () => {
      try {
        await axios.get(`${API_URL}/auth/me`);
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(401);
      }
    });

    it('should reject request with invalid token', async () => {
      try {
        await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: 'Bearer invalid.token.here',
          },
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(401);
      }
    });

    it('should reject request with malformed authorization header', async () => {
      try {
        await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: accessToken, // Missing "Bearer" prefix
          },
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        expect(err.response?.status).toBe(401);
      }
    });
  });

  describe('Complete Auth Flow', () => {
    it('should complete full signup -> signin -> protected endpoint flow', async () => {
      const uniqueUser = {
        email: `flowtest${Date.now()}@example.com`,
        name: 'Flow Test User',
        password: 'FlowTest123!',
      };

      // Step 1: Sign up
      const signupRes = await axios.post(`${API_URL}/auth/signup`, uniqueUser);
      expect(signupRes.status).toBe(201);
      const signupToken = signupRes.data.access_token;

      // Step 2: Access protected endpoint with signup token
      const meRes1 = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${signupToken}` },
      });
      expect(meRes1.status).toBe(200);
      expect(meRes1.data.email).toBe(uniqueUser.email);

      // Step 3: Sign in with same credentials
      const signinRes = await axios.post(`${API_URL}/auth/signin`, {
        email: uniqueUser.email,
        password: uniqueUser.password,
      });
      expect(signinRes.status).toBe(200);
      const signinToken = signinRes.data.access_token;

      // Step 4: Access protected endpoint with signin token
      const meRes2 = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${signinToken}` },
      });
      expect(meRes2.status).toBe(200);
      expect(meRes2.data.email).toBe(uniqueUser.email);

      // Both tokens should work (they're different but both valid)
      expect(signupToken).toBeTruthy();
      expect(signinToken).toBeTruthy();
    });
  });

  describe('Security Tests', () => {
    it('should not expose password in any response', async () => {
      const uniqueUser = {
        email: `security${Date.now()}@example.com`,
        name: 'Security Test',
        password: 'SecurePass123!',
      };

      const signupRes = await axios.post(`${API_URL}/auth/signup`, uniqueUser);
      expect(signupRes.data.user).not.toHaveProperty('password');
      expect(signupRes.data.user).not.toHaveProperty('passwordHash');

      const signinRes = await axios.post(`${API_URL}/auth/signin`, {
        email: uniqueUser.email,
        password: uniqueUser.password,
      });
      expect(signinRes.data.user).not.toHaveProperty('password');
      expect(signinRes.data.user).not.toHaveProperty('passwordHash');

      const meRes = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${signupRes.data.access_token}` },
      });
      expect(meRes.data).not.toHaveProperty('password');
      expect(meRes.data).not.toHaveProperty('passwordHash');
    });

    it('should handle SQL injection attempts safely', async () => {
      try {
        await axios.post(`${API_URL}/auth/signin`, {
          email: "admin' OR '1'='1",
          password: "password' OR '1'='1",
        });
        fail('Should have thrown an error');
      } catch (error) {
        const err = error as AxiosError;
        // Should return 400 (validation error) or 401 (invalid credentials)
        expect([400, 401]).toContain(err.response?.status);
      }
    });
  });
});
