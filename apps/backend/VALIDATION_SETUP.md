# Backend Validation Setup

## Overview
The backend now has comprehensive validation using **class-validator** and **class-transformer** with DTOs (Data Transfer Objects), matching the frontend Zod validation rules.

## 📦 Dependencies

Already included in NestJS:
- **class-validator** - Decorator-based validation
- **class-transformer** - Transform plain objects to class instances
- **@nestjs/swagger** - API documentation

## 🔐 Validation DTOs

### Location
`src/auth/dto/`

### Sign Up DTO
**File:** `sign-up.dto.ts`

```typescript
export class SignUpDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string;

  @ApiProperty({ description: 'User full name', example: 'John Doe', minLength: 3, maxLength: 50 })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  name!: string;

  @ApiProperty({ description: 'User password', example: 'Password123!', minLength: 8 })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password!: string;
}
```

**Validation Rules:**
- ✅ **Email**: Required, valid email format
- ✅ **Name**: Required, 3-50 characters, trimmed
- ✅ **Password**: Required, min 8 chars, must include letter, number, and special character

### Sign In DTO
**File:** `sign-in.dto.ts`

```typescript
export class SignInDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string;

  @ApiProperty({ description: 'User password', example: 'Password123!', minLength: 8 })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;
}
```

**Validation Rules:**
- ✅ **Email**: Required, valid email format
- ✅ **Password**: Required, min 8 characters

## ⚙️ Global Validation Configuration

### Location
`src/main.ts`

### Configuration
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,                    // Strip properties not in DTO
    transform: true,                    // Auto-transform payloads to DTO instances
    forbidNonWhitelisted: true,         // Throw error for extra properties
    transformOptions: {
      enableImplicitConversion: true,   // Auto-convert types
    },
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => ({
        field: error.property,
        message: Object.values(error.constraints || {})[0],
      }));
      return {
        statusCode: 400,
        message: messages[0]?.message || 'Validation failed',
        errors: messages,
      };
    },
  })
);
```

### Features
- ✅ **Whitelist**: Removes unknown properties
- ✅ **Transform**: Converts plain objects to DTO instances
- ✅ **Forbid Non-Whitelisted**: Rejects extra properties
- ✅ **Custom Error Format**: Returns user-friendly error messages

## 📝 Validation Decorators Used

### Common Decorators
| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@IsNotEmpty()` | Field must not be empty | Email, password, name |
| `@IsString()` | Must be a string | Name, password |
| `@IsEmail()` | Must be valid email | Email field |
| `@MinLength(n)` | Minimum string length | Password (8), Name (3) |
| `@MaxLength(n)` | Maximum string length | Name (50) |
| `@Matches(regex)` | Must match regex pattern | Password complexity |
| `@Transform()` | Transform value | Trim whitespace |

### Swagger Decorators
| Decorator | Purpose |
|-----------|---------|
| `@ApiProperty()` | Document DTO property |
| `@ApiTags()` | Group endpoints |
| `@ApiOperation()` | Describe endpoint |
| `@ApiResponse()` | Document response |
| `@ApiBody()` | Document request body |
| `@ApiBearerAuth()` | Require JWT token |

## 🌐 API Documentation

### Swagger UI
Access at: `http://localhost:3000/api/docs`

### Features
- ✅ Interactive API testing
- ✅ Request/response examples
- ✅ Validation error examples
- ✅ Authentication support
- ✅ Auto-generated from decorators

## 🔄 Error Response Format

### Validation Error
```json
{
  "statusCode": 400,
  "message": "Email is required",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Multiple Errors
```json
{
  "statusCode": 400,
  "message": "Email is required",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

## 🎯 Validation Flow

### Request Flow
```
Client Request → ValidationPipe → DTO Validation → Controller → Service
```

### Validation Steps
1. **Transform**: Plain object → DTO instance
2. **Validate**: Check all decorators
3. **Whitelist**: Remove unknown properties
4. **Error**: Return formatted error if validation fails
5. **Success**: Pass validated DTO to controller

## 🔒 CORS Configuration

### Allowed Origins
```typescript
app.enableCors({
  origin: ['http://localhost:4200', 'http://localhost:5173'],
  credentials: false,
});
```

- ✅ Angular dev server (4200)
- ✅ Vite dev server (5173)

## 📊 Validation Examples

### Valid Sign Up Request
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Password123!"
}
```

### Invalid Sign Up Requests

**Missing Email:**
```json
{
  "name": "John Doe",
  "password": "Password123!"
}
```
**Response:** `Email is required`

**Invalid Email:**
```json
{
  "email": "invalid-email",
  "name": "John Doe",
  "password": "Password123!"
}
```
**Response:** `Please enter a valid email address`

**Short Name:**
```json
{
  "email": "user@example.com",
  "name": "Jo",
  "password": "Password123!"
}
```
**Response:** `Name must be at least 3 characters`

**Weak Password:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password"
}
```
**Response:** `Password must contain at least one letter, one number, and one special character`

## 🧪 Testing Validation

### Using cURL
```bash
# Valid request
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "Password123!"
  }'

# Invalid request (missing email)
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "password": "Password123!"
  }'
```

### Using Swagger UI
1. Navigate to `http://localhost:3000/api/docs`
2. Find the `/auth/signup` endpoint
3. Click "Try it out"
4. Enter test data
5. Click "Execute"
6. View response

## 🎨 Frontend-Backend Validation Sync

### Matching Rules

| Field | Frontend (Zod) | Backend (class-validator) |
|-------|----------------|---------------------------|
| Email | `.email()` | `@IsEmail()` |
| Name Min | `.min(3)` | `@MinLength(3)` |
| Name Max | `.max(50)` | `@MaxLength(50)` |
| Name Trim | `.trim()` | `@Transform(trim)` |
| Password Min | `.min(8)` | `@MinLength(8)` |
| Password Pattern | `.regex()` | `@Matches()` |
| Required | `.nonempty()` | `@IsNotEmpty()` |

### Benefits
- ✅ **Consistent validation** on both sides
- ✅ **Same error messages** for users
- ✅ **Type safety** with TypeScript
- ✅ **Security** - backend validation prevents bypass

## 🔮 Future Enhancements

- [ ] Add custom validation decorators
- [ ] Add rate limiting validation
- [ ] Add file upload validation
- [ ] Add query parameter validation
- [ ] Add custom error messages per locale
- [ ] Add validation groups
- [ ] Add conditional validation

---

**Status**: ✅ Complete and Production Ready

**API Documentation**: http://localhost:3000/api/docs
