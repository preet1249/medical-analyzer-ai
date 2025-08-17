# Medical Report Analyzer - Deployment Guide

This project is now structured for separate deployment with backend on Render.com and frontend on Vercel.

## Project Structure

```
medical-report-analyzer/
├── backend/           # Express.js API server
├── frontend/          # Next.js web application
├── src/              # Original combined code (legacy)
└── public/           # Original public files (legacy)
```

## 🚀 Backend Deployment (Render.com)

### 1. Prerequisites
- MongoDB Atlas account and connection string
- OpenRouter API key
- GitHub repository access

### 2. Render.com Setup
1. **Sign up/Login** to [Render.com](https://render.com)
2. **Connect GitHub** repository: `https://github.com/preet1249/medical-report-analyzer`
3. **Create Web Service**:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Auto-Deploy**: `Yes`

### 3. Environment Variables (Render)
Set these in Render Dashboard → Environment:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-analyzer
OPENROUTER_API_KEY=your_openrouter_api_key_here
JWT_SECRET=your_jwt_secret_make_it_long_and_secure
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 4. Backend Health Check
- Health endpoint: `https://your-backend.onrender.com/api/health`
- Full diagnosis: `https://your-backend.onrender.com/api/full-diagnosis`

---

## 🚀 Frontend Deployment (Vercel)

### 1. Prerequisites
- Vercel account
- Backend deployed and URL ready

### 2. Vercel Setup
1. **Sign up/Login** to [Vercel](https://vercel.com)
2. **Import GitHub** repository: `https://github.com/preet1249/medical-report-analyzer`
3. **Configure Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Environment Variables (Vercel)
Set these in Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### 4. Frontend Health Check
- Main site: `https://your-frontend.vercel.app`
- Should connect to backend API automatically

---

## 🔧 Local Development

### Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Development
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with backend URL
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📋 Required API Keys & Services

### 1. MongoDB Atlas
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/medical-analyzer`

### 2. OpenRouter API
1. Sign up at [OpenRouter](https://openrouter.ai)
2. Get API key from dashboard
3. Ensure you have credits for GPT-4o-mini model

### 3. JWT Secret
Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔄 Deployment Steps (Complete Walkthrough)

### Step 1: Deploy Backend to Render
1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `medical-analyzer-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables (see Backend section above)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Note your backend URL: `https://medical-analyzer-backend.onrender.com`

### Step 2: Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: `Next.js` (auto-detected)
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend URL from Step 1
6. Click "Deploy"
7. Wait for deployment (2-5 minutes)
8. Your app is live: `https://your-project.vercel.app`

### Step 3: Test the Complete Setup
1. Visit your frontend URL
2. Try registering a new account
3. Upload a medical report image
4. Verify AI analysis works
5. Check that reports are saved and retrievable

---

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection**: Check connection string and IP whitelist
- **OpenRouter API**: Verify API key and credits
- **CORS Errors**: Ensure `FRONTEND_URL` is set correctly
- **Logs**: Check Render logs in dashboard

### Frontend Issues
- **API Connection**: Verify `NEXT_PUBLIC_API_URL` environment variable
- **Build Errors**: Check that all dependencies are in package.json
- **Authentication**: Clear localStorage and try fresh login

### Common Problems
1. **Environment Variables**: Double-check all are set correctly
2. **API Timeout**: Render free tier may have cold starts
3. **File Upload**: Ensure backend has proper CORS headers
4. **Database**: Check MongoDB Atlas network access settings

---

## 🔒 Security Notes

- Never commit `.env` files to git
- Use strong JWT secrets in production
- Enable MongoDB IP whitelisting
- Use HTTPS in production (handled by hosting platforms)
- Regularly rotate API keys

---

## 📊 Monitoring

### Backend Monitoring
- Health check: `GET /api/health`
- Render provides built-in monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)

### Frontend Monitoring
- Vercel Analytics (built-in)
- Check Core Web Vitals
- Monitor API response times

---

## 🚀 Production Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] All environment variables set
- [ ] MongoDB Atlas configured
- [ ] OpenRouter API key working
- [ ] User registration/login works
- [ ] File upload works
- [ ] AI analysis works
- [ ] Reports save and load correctly
- [ ] Health checks passing
- [ ] Custom domain configured (optional)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs in hosting platforms
3. Verify all environment variables are set
4. Test API endpoints directly

Your Medical Report Analyzer is now ready for production use! 🎉