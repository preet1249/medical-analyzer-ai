# Medical Report Analyzer - Setup Instructions

## Overview
This is a comprehensive Medical Report Analyzer built with Next.js, featuring AI-powered analysis of medical reports using GPT-4o through OpenRouter API, secure authentication, and real-time chat functionality.

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenRouter API (GPT-4o)
- **Authentication**: JWT tokens with HTTP-only cookies
- **File Upload**: Custom implementation with validation

## Features
✅ Landing page with feature showcase
✅ User authentication (login/signup)
✅ Secure file upload (up to 50MB, multiple images)
✅ AI-powered medical report analysis
✅ Interactive chat with AI about reports
✅ Report history and management
✅ Responsive design
✅ Real-time feedback and loading states

## Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- OpenRouter API account and key

## Setup Steps

### 1. Install Dependencies
```bash
cd medical-report-analyzer
npm install
```

### 2. Environment Configuration
Update the `.env.local` file with your actual values:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/medical-analyzer
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-analyzer

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Authentication
NEXTAUTH_SECRET=your_secure_random_string_here
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=another_secure_random_string_here

# File Upload Settings
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

### 3. Get OpenRouter API Key
1. Visit https://openrouter.ai/
2. Create an account
3. Go to API Keys section
4. Create a new API key
5. Add credits to your account (pay-per-use)
6. Copy the API key to your `.env.local` file

### 4. MongoDB Setup
**Option A: Local MongoDB**
1. Install MongoDB on your system
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/medical-analyzer`

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Replace `<username>`, `<password>`, and `<cluster-url>` in connection string

### 5. Run the Application
```bash
npm run dev
```

### 6. Access the Application
- Open http://localhost:3000
- Create an account or login
- Start uploading and analyzing medical reports!

## Project Structure
```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── upload/        # File upload endpoint
│   │   ├── analyze/       # AI analysis endpoint
│   │   ├── chat/          # Chat functionality
│   │   └── reports/       # Report management
│   ├── auth/              # Auth pages (login/register)
│   ├── dashboard/         # Main dashboard
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── Dashboard/        # Dashboard-specific components
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # Authentication utilities
│   ├── openrouter.ts     # AI integration
│   └── utils.ts          # General utilities
├── models/               # Database models
│   ├── User.ts           # User schema
│   └── Report.ts         # Report schema
└── types/                # TypeScript type definitions
```

## Usage Flow
1. **Landing Page**: Users see features and can signup/login
2. **Authentication**: Secure signup/login with JWT tokens
3. **Dashboard**: Main interface with upload and reports sections
4. **Upload**: Drag-and-drop or click to upload medical images
5. **Analysis**: AI analyzes reports and provides detailed insights
6. **Chat**: Interactive Q&A about specific reports
7. **History**: View and manage all analyzed reports

## Security Features
- JWT tokens with HTTP-only cookies
- Password hashing with bcrypt
- File type and size validation
- Request authentication middleware
- Input sanitization and validation

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/upload` - Upload medical report images
- `POST /api/analyze` - Analyze uploaded reports
- `POST /api/chat` - Chat with AI about reports
- `GET /api/reports` - Get user's reports
- `GET /api/reports/[id]` - Get specific report
- `DELETE /api/reports?id=[id]` - Delete report

## Important Notes
- This application is for educational purposes only
- Always consult healthcare professionals for medical decisions
- The AI provides analysis but not medical diagnosis
- Ensure compliance with healthcare data regulations in your region
- Keep your API keys secure and never commit them to version control

## Troubleshooting
1. **MongoDB Connection Issues**: Check connection string and network access
2. **OpenRouter API Errors**: Verify API key and account credits
3. **File Upload Failures**: Check file size/type and upload directory permissions
4. **Authentication Issues**: Verify JWT secrets are set correctly

## Production Deployment
For production deployment:
1. Set `NODE_ENV=production`
2. Use secure HTTPS URLs
3. Set strong JWT secrets
4. Configure proper MongoDB security
5. Set up file storage (AWS S3, Cloudinary, etc.)
6. Enable rate limiting and security headers

## Support
For issues or questions, please check the code comments and error messages for guidance.