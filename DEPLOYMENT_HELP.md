# Vercel Deployment Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error: 404 Not Found

**What it means**: Vercel can't find your project's entry point

**Solutions:**

1. **Verify file structure:**
   ```bash
   # Check these files exist in root:
   - vercel.json (✓ configuration file)
   - api/index.js (✓ main API handler)
   - package.json (✓ dependencies)
   - public/ (✓ frontend files)
   ```

2. **Check vercel.json:**
   ```json
   {
     "version": 2,
     "buildCommand": "npm run build",
     "functions": {
       "api/index.js": {
         "memory": 1024,
         "maxDuration": 60
       }
     }
   }
   ```

3. **Verify api/index.js exists and imports correctly**

4. **Clear Vercel cache:**
   - Go to Vercel Dashboard
   - Project Settings → Git
   - Clear Git Cache
   - Redeploy

### ❌ Error: Cannot find module 'express'

**What it means**: Dependencies weren't installed during build

**Solutions:**

1. **Run npm install locally first:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. **Commit package-lock.json:**
   ```bash
   git add package-lock.json backend/package-lock.json
   git commit -m "Add package locks"
   git push
   ```

3. **Force rebuild on Vercel:**
   - Go to Deployments
   - Click the failed build
   - Click "Rebuild and Comments"

### ❌ Error: DATABASE_URL is undefined

**What it means**: Environment variables weren't set

**Solutions:**

1. **Add to Vercel:**
   - Go to Project Settings
   - Environment Variables
   - Add:
     ```
     DATABASE_URL = file:./dev.db
     JWT_SECRET = your-secret-key-here
     ```

2. **Verify variables are set:**
   - Go to Deployments
   - Click latest build
   - Check Environment Variables tab

3. **Redeploy after adding variables:**
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

### ❌ Error: 502 Bad Gateway

**What it means**: Server crashed or timed out

**Solutions:**

1. **Check server logs:**
   - Go to Vercel Dashboard
   - Click your deployment
   - Click "View Function Logs"
   - Look for error messages

2. **Check timeout:**
   - Your function might exceed 60-second timeout
   - Optimize database queries
   - Reduce processing time

3. **Check memory usage:**
   - Increase function memory in vercel.json:
   ```json
   "api/index.js": {
     "memory": 3008,
     "maxDuration": 60
   }
   ```

### ❌ Error: CORS error in browser console

**What it means**: Frontend can't reach API

**Solutions:**

1. **Update CORS in api/index.js:**
   ```javascript
   app.use(cors({
     origin: [
       'your-vercel-app.vercel.app',
       'your-custom-domain.com'
     ],
     credentials: true
   }));
   ```

2. **Update frontend API URL:**
   In `frontend/public/app.js`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || '/api';
   ```

3. **Add to Vercel environment variables:**
   ```
   FRONTEND_URL = your-vercel-app.vercel.app
   ```

### ❌ Error: Cannot read property 'db' of undefined

**What it means**: Prisma client not initialized

**Solutions:**

1. **Generate Prisma client:**
   ```bash
   cd backend
   npx prisma generate
   cd ..
   ```

2. **Commit generated files:**
   ```bash
   git add backend/.prisma
   git commit -m "Add Prisma client"
   git push
   ```

3. **Check schema.prisma:**
   - Make sure DATABASE_URL is in env
   - Verify provider is correct

### ❌ Error: Port 5000 already in use

**What it means**: Your app can't start (local only, shouldn't happen on Vercel)

**Solutions (local):**
```bash
# macOS/Linux: Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ Error: Build fails silently

**What it means**: Error during npm run build

**Solutions:**

1. **Check build logs:**
   - Click failed deployment
   - Scroll through the build log
   - Look for the actual error

2. **Test build locally:**
   ```bash
   npm run build
   ```

3. **Common issues:**
   - Missing files
   - Permission denied
   - Syntax errors in code

### ❌ Error: Timeout error on billing creation

**What it means**: Request takes too long (>60s)

**Solutions:**

1. **Optimize database queries:**
   - Add indexes to frequently queried fields
   - Cache product list
   - Use pagination

2. **Increase timeout** in vercel.json:
   ```json
   "functions": {
     "api/index.js": {
       "maxDuration": 60
     }
   }
   ```
   (Max is 60 seconds for free tier)

3. **Use better-sqlite3 connection pooling:**
   ```javascript
   // Add to Prisma schema
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

## Debugging Steps

### Step 1: Check Vercel Logs
```
Vercel Dashboard → Deployments → Your Build → Logs
```

### Step 2: Test API locally
```bash
npm run dev
curl http://localhost:5000/api/health
```

### Step 3: Check environment variables
```
Vercel Dashboard → Settings → Environment Variables
```

### Step 4: Review browser console
```
F12 → Console tab → Check for errors
```

### Step 5: Check browser network tab
```
F12 → Network tab → Check API responses
```

## Performance Optimization

### Before Production

1. **Database:**
   - Switch to PostgreSQL (not SQLite)
   - Add database indexes
   - Use connection pooling

2. **API:**
   - Add response caching
   - Implement pagination
   - Optimize queries

3. **Frontend:**
   - Compress images
   - Minify CSS/JS
   - Enable browser caching

### Add Indexes to Database

In `backend/prisma/schema.prisma`:
```prisma
model Product {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  // ... other fields
  
  @@index([category])
  @@index([name])
}
```

Then run:
```bash
cd backend
npx prisma db push
```

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use PostgreSQL database (not SQLite)
- [ ] Set all environment variables in Vercel
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Test all features after deployment
- [ ] Set up monitoring/alerts
- [ ] Document database backups
- [ ] Review security settings
- [ ] Configure custom domain (optional)

## Getting Help

### Where to look:

1. **Vercel Docs**: https://vercel.com/docs
2. **Error Message**: Copy entire error into Google
3. **Project Logs**: Check Vercel deployment logs
4. **Browser Console**: F12 → Console
5. **Terminal Output**: Check build terminal

### If stuck:

1. Check all logs (Vercel + Browser + Terminal)
2. Test locally first
3. Rebuild and redeploy
4. Check GitHub for issues

## Quick Fixes (Try in Order)

```bash
# 1. Reinstall dependencies
npm install
npm ci --prefer-offline

# 2. Clear cache and rebuild
# (In Vercel Dashboard: Settings → Git → Clear Build Cache)

# 3. Commit empty change to trigger rebuild
git commit --allow-empty -m "Trigger rebuild"
git push

# 4. Revert to last working version
git revert HEAD
git push

# 5. Nuclear option: delete and redeploy
# Delete project in Vercel Dashboard
# Go to vercel.com/new and deploy again
```

## Emergency Contacts

- Vercel Support: https://vercel.com/help
- GitHub Issues: https://github.com/YOUR_REPO/issues
- npm Issues: https://www.npmjs.com/

---

**Remember**: Most deployment issues are related to missing environment variables or incorrect file structure. Always check those first!
