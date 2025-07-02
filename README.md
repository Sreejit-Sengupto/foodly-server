# Foodly Server

A Node.js/Express backend application for Foodly - a food booking platform - cut queues, enjoy your food!

## Features

- 🔐 Google OAuth 2.0 Authentication
- 👥 Role-based access control (Admin, Customer, Eatery)
- 📧 Email notifications using Resend
- 🗄️ PostgreSQL database with Prisma ORM
- 🔒 JWT-based authentication with refresh tokens
- 🚀 TypeScript for type safety
- ⚡ Hot reload development with Nodemon

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Google OAuth 2.0 + JWT
- **Email Service**: Resend
- **Development**: Nodemon, ts-node

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd foodly/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=14d

# Email Service
RESEND_API_KEY=your_resend_api_key
```

#### Required Environment Variables:

| Variable               | Description                  | Example                                        |
| ---------------------- | ---------------------------- | ---------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/foodly` |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       | Get from Google Cloud Console                  |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   | Get from Google Cloud Console                  |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret      | Generate a secure random string                |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret     | Generate a secure random string                |
| `RESEND_API_KEY`       | Resend email service API key | Get from Resend dashboard                      |

## Database Setup

### 1. PostgreSQL Installation

#### On macOS (using Homebrew):

```bash
brew install postgresql
brew services start postgresql
```

#### On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On Windows:

Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE foodly;

# Create user (optional)
CREATE USER foodly_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE foodly TO foodly_user;

# Exit
\q
```

### 3. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npm run migrate
```

## Alternatively, you can also use Docker to setup the database in few steps:

#### Pull the latest Postgres image

```bash
docker pull postgres:latest
```

#### Create and run the container

```bash
docker run --name<CONTAINER_NAME> -e POSTGRES_PASSWORD=your_secret -p 5432:5432 -d postgres
```

#### Connection string

`postgresql://postgres:<password>@localhost:5432/postgres`

#### Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npm run migrate
```

## External Service Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3001/api/v1/auth/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

### Resend Email Setup

1. Sign up at [Resend](https://resend.com/)
2. Go to API Keys section
3. Create a new API key
4. Copy the API key to your `.env` file

## Development

### Running the Application

```bash
# Development mode with hot reload
npm run dev
```

The server will start on `http://localhost:3001`

### Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run migrate` | Run Prisma database migrations           |

### Project Structure

```
src/
├── app.ts                      # Express app configuration
├── index.ts                    # Server entry point
├── constants/                  # Application constants
│   └── index.ts
├── controllers/                # Route controllers
│   └── auth/
│       └── google-oauth.controller.ts
├── db/                         # Database configuration
│   └── index.ts
├── generated/                  # Generated Prisma client
│   └── prisma/
├── resend/                     # Email service configuration
│   └── index.ts
├── routes/                     # API routes
│   └── auth/
│       └── oauth.route.ts
└── utils/                      # Utility functions
    ├── JWTTokens.ts
    └── email-templates/
        └── welcome-email.ts
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description                   | Body                                              | Protected |
| ------ | -------------------- | ----------------------------- | ------------------------------------------------- | --------- |
| `POST` | `/register`          | Register new user with email  | `{ firstname, lastname?, email, password, role }` | No        |
| `POST` | `/login`             | Login with email and password | `{ email, password }`                             | No        |
| `POST` | `/verify-token`      | Verify JWT/email token        | `{ token, setPassword }`                          | No        |
| `POST` | `/logout`            | Logout user (clear tokens)    | -                                                 | Yes       |
| `POST` | `/send-welcome-mail` | Send welcome mail to users    | `{ firstname, email }`                            | No        |

#### Google OAuth

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| `GET`  | `/api/v1/oauth/google/url`      | Get Google OAuth URL  |
| `GET`  | `/api/v1/oauth/google/callback` | Google OAuth callback |

### Test Endpoint

| Method | Endpoint | Description           |
| ------ | -------- | --------------------- |
| `GET`  | `/test`  | Health check endpoint |

## Database Schema

### User Model

```typescript
model User {
  id             String   @id @default(uuid())
  firstname      String
  lastname       String?
  isVerified     Boolean  @default(false)
  provider       String?
  providerId     String?
  role           Role     @default(CUSTOMER)
  profilePicture String?
  mobileNumber   String?  @unique
  username       String   @unique @default(nanoid())
  email          String   @unique
  password       String?
  refreshToken   String?
  loginCount     Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @default(now()) @updatedAt
}
```

### Roles

- `ADMIN` - Administrative access
- `CUSTOMER` - Regular customer
- `EATERY` - Restaurant/food provider

## Security Features

- **JWT Authentication**: Access and refresh token system
- **Secure Cookies**: HTTP-only, secure cookies for token storage
- **Environment Variables**: Sensitive data stored in environment variables
- **OAuth 2.0**: Secure Google authentication
- **Password Hashing**: User passwords are securely hashed (when applicable)

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```
Error: Can't reach database server
```

**Solution**:

- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

#### 2. Prisma Client Error

```
Error: Cannot find module '@prisma/client'
```

**Solution**:

```bash
npx prisma generate
```

#### 3. Google OAuth Error

```
Error: invalid_client
```

**Solution**:

- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check redirect URI in Google Cloud Console

#### 4. Email Sending Error

```
Error: Invalid API key
```

**Solution**:

- Verify RESEND_API_KEY in `.env`
- Check Resend dashboard for API key status

### Development Tips

1. **Database Reset**: If you need to reset the database:

   ```bash
   npx prisma migrate reset
   ```

2. **View Database**: Use Prisma Studio to view your data:

   ```bash
   npx prisma studio
   ```

3. **Environment Variables**: Always restart the server after changing `.env` file

4. **TypeScript Errors**: If you encounter TypeScript errors after database changes:
   ```bash
   npx prisma generate
   npm run dev
   ```

## Production Deployment

### Environment Considerations

1. Set `NODE_ENV=production`
2. Use production database URL
3. Set secure JWT secrets
4. Configure proper CORS settings
5. Use HTTPS for OAuth redirects

### Recommended Services

- **Database**: AWS RDS, Google Cloud SQL, or Heroku Postgres
- **Hosting**: Heroku, Railway, or DigitalOcean
- **Domain**: Configure custom domain for OAuth redirects

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the project documentation
3. Create an issue in the repository

---

**Note**: Remember to keep your environment variables secure and never commit them to version control. The `.env` file is already included in `.gitignore` for security.
