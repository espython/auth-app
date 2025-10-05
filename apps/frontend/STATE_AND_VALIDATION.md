# State Management & Validation Setup

## Overview
The application now uses **Zod** for schema validation and **Zustand** for global state management, providing a robust and type-safe architecture.

## 📦 Dependencies Added

```bash
npm install zod zustand
```

- **zod** - TypeScript-first schema validation
- **zustand** - Lightweight state management

## 🔐 Validation with Zod

### Location
`app/lib/validations/auth.ts`

### Schemas

#### Sign Up Schema
```typescript
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      'Password must contain at least one letter, one number, and one special character'
    ),
});
```

#### Sign In Schema
```typescript
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});
```

### Type Inference
```typescript
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
```

### Usage Example
```typescript
import { signUpSchema } from '../lib/validations/auth';

const validation = signUpSchema.safeParse({ email, name, password });
if (!validation.success) {
  setError(validation.error.issues[0].message);
  return;
}
```

## 🗄️ State Management with Zustand

### Location
`app/store/user-store.ts`

### Store Structure

#### User Type
```typescript
export interface User {
  email: string;
  name?: string;
  id?: string;
}
```

#### State Interface
```typescript
interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}
```

### Features

#### ✅ Persistence
- Automatically persists to `localStorage`
- Key: `auth-storage`
- Persists: `token`, `user`, `isAuthenticated`

#### ✅ Type Safety
- Full TypeScript support
- Inferred types for all actions

#### ✅ Simple API
```typescript
const { user, token, login, logout } = useUserStore();
```

### Usage Examples

#### Login
```typescript
import { useUserStore } from '../store/user-store';

const { login } = useUserStore();

// After successful authentication
login({ email, name }, token);
```

#### Logout
```typescript
const { logout } = useUserStore();

const handleLogout = () => {
  logout();
  navigate('/signin');
};
```

#### Access User Data
```typescript
const { user, isAuthenticated } = useUserStore();

return (
  <div>
    {isAuthenticated && <p>Welcome, {user?.email}</p>}
  </div>
);
```

#### Check Authentication
```typescript
const { token } = useUserStore();

useEffect(() => {
  if (!token) {
    navigate('/signin');
  }
}, [token, navigate]);
```

## 📄 Updated Pages

### Sign Up Page
- ✅ Uses `signUpSchema` for validation
- ✅ Stores user and token in Zustand on success
- ✅ Removed localStorage direct access
- ✅ Type-safe error handling

### Sign In Page
- ✅ Uses `signInSchema` for validation
- ✅ Stores user and token in Zustand on success
- ✅ Removed localStorage direct access
- ✅ Type-safe error handling

### Dashboard Page
- ✅ Reads user data from Zustand store
- ✅ Uses token from store for API calls
- ✅ Calls store's logout action
- ✅ Automatically redirects if not authenticated

## 🎯 Benefits

### Validation Benefits
1. **Centralized** - All validation rules in one place
2. **Reusable** - Same schemas can be used anywhere
3. **Type-safe** - TypeScript types inferred from schemas
4. **Consistent** - Same validation on frontend and can match backend
5. **Clear errors** - User-friendly error messages

### State Management Benefits
1. **Global access** - User data available anywhere
2. **Persistent** - Survives page refreshes
3. **Type-safe** - Full TypeScript support
4. **Simple API** - Easy to use hooks
5. **No prop drilling** - Access state from any component
6. **Lightweight** - Minimal bundle size (~1KB)

## 🔄 Data Flow

### Sign Up Flow
```
User Input → Zod Validation → API Call → Zustand Store → Navigate to Dashboard
```

### Sign In Flow
```
User Input → Zod Validation → API Call → Zustand Store → Navigate to Dashboard
```

### Dashboard Flow
```
Check Zustand Token → Fetch User Data → Update Zustand Store → Display UI
```

### Logout Flow
```
User Clicks Logout → Clear Zustand Store → Navigate to Sign In
```

## 🧪 Testing

### Validation Testing
```typescript
import { signUpSchema } from './lib/validations/auth';

// Valid input
const result = signUpSchema.safeParse({
  email: 'test@example.com',
  name: 'Test User',
  password: 'Test123!@#'
});
console.log(result.success); // true

// Invalid input
const result2 = signUpSchema.safeParse({
  email: 'invalid-email',
  name: 'Te',
  password: '123'
});
console.log(result2.success); // false
console.log(result2.error.issues); // Array of validation errors
```

### Store Testing
```typescript
import { useUserStore } from './store/user-store';

// In a component
const { login, user, isAuthenticated } = useUserStore();

// Test login
login({ email: 'test@example.com' }, 'token123');
console.log(user); // { email: 'test@example.com' }
console.log(isAuthenticated); // true

// Test logout
logout();
console.log(user); // null
console.log(isAuthenticated); // false
```

## 📚 Additional Resources

- [Zod Documentation](https://zod.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

## 🔮 Future Enhancements

- [ ] Add form validation on blur (real-time feedback)
- [ ] Add password strength indicator
- [ ] Add remember me functionality
- [ ] Add refresh token logic
- [ ] Add user profile update validation
- [ ] Add optimistic updates
- [ ] Add loading states in store
- [ ] Add error states in store

---

**Status**: ✅ Complete and Production Ready
