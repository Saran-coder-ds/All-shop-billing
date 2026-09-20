# ✅ Installation & Deployment Checklist

## Local Installation Checklist

### Prerequisites
- [ ] Node.js 16+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] Git installed (`git -v`)
- [ ] GitHub account created
- [ ] Vercel account created (free)

### Step 1: Setup
- [ ] Run `setup.sh` (macOS/Linux) or `setup.bat` (Windows)
- [ ] Wait for all installations to complete
- [ ] Check for any error messages

### Step 2: Create Environment File
- [ ] Copy `.env.example` to `.env`
- [ ] Update DATABASE_URL (default is fine for dev)
- [ ] Update JWT_SECRET (any random string)

### Step 3: Verify Installation
- [ ] Run `npm run dev`
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5000
- [ ] Can access http://localhost:5000/api/health

### Step 4: Test Features
- [ ] Register new account
- [ ] Login with email/password
- [ ] Create a product
- [ ] View products list
- [ ] Add item to bill
- [ ] Create a bill
- [ ] View dashboard
- [ ] Check low stock alerts
- [ ] Logout successfully

## GitHub Setup Checklist

### Step 1: Initialize Git
- [ ] Run `git init`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Initial commit"`
- [ ] Create repository on GitHub.com

### Step 2: Push Code
- [ ] Run `git remote add origin YOUR_GITHUB_URL`
- [ ] Run `git branch -M main`
- [ ] Run `git push -u origin main`
- [ ] Verify files on GitHub

### Step 3: Verify Repository
- [ ] Check all files are pushed
- [ ] Verify `vercel.json` exists
- [ ] Verify `api/index.js` exists
- [ ] Verify `package.json` files exist

## Vercel Deployment Checklist

### Step 1: Connect to Vercel
- [ ] Go to vercel.com
- [ ] Login/Register
- [ ] Click "New Project"
- [ ] Select "Import Git Repository"
- [ ] Choose your GitHub repository

### Step 2: Configure Project
- [ ] Framework Preset: Node.js (or auto-detected)
- [ ] Root Directory: ./
- [ ] Build Command: `npm run build`
- [ ] Output Directory: (leave blank)

### Step 3: Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add `DATABASE_URL` = `file:./dev.db`
- [ ] Add `JWT_SECRET` = (random key)
- [ ] Add `FRONTEND_URL` = `your-app.vercel.app`
- [ ] Save variables

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check for build errors in logs
- [ ] Click the deployed URL

### Step 5: Test Deployment
- [ ] Frontend loads without errors
- [ ] Can register account
- [ ] Can login
- [ ] Can create products
- [ ] API calls work (check Network tab)
- [ ] Dashboard shows data
- [ ] No 404 errors

## Troubleshooting Checklist

### If you see 404 Error:
- [ ] Check `vercel.json` exists in root
- [ ] Check `api/index.js` exists
- [ ] Clear Vercel cache and redeploy
- [ ] Check build logs for errors
- [ ] See DEPLOYMENT_HELP.md

### If you see Database Errors:
- [ ] Check DATABASE_URL in environment variables
- [ ] Verify .env file exists locally
- [ ] Run `cd backend && npx prisma db push`
- [ ] Check database file permissions

### If API calls fail:
- [ ] Check CORS settings in api/index.js
- [ ] Verify FRONTEND_URL is set
- [ ] Check browser Network tab for errors
- [ ] Review API response status codes

### If Build Fails:
- [ ] Check npm install works locally
- [ ] Test `npm run build` locally
- [ ] Check for syntax errors
- [ ] Review full build logs on Vercel
- [ ] See DEPLOYMENT_HELP.md for detailed solutions

## Production Checklist

### Security
- [ ] Change JWT_SECRET to strong random key
- [ ] Never commit .env file
- [ ] Use HTTPS (automatic on Vercel)
- [ ] Set environment variables in Vercel
- [ ] Review CORS origins

### Database
- [ ] Switch to PostgreSQL (not SQLite)
- [ ] Setup at Supabase.com or Railway.app
- [ ] Add PostgreSQL URL to Vercel environment
- [ ] Run `npx prisma db push`
- [ ] Test database connection

### Performance
- [ ] Enable Vercel Analytics
- [ ] Add database indexes
- [ ] Compress product images
- [ ] Monitor API response times
- [ ] Check for slow queries

### Monitoring
- [ ] Setup error tracking
- [ ] Monitor database usage
- [ ] Check API rate limits
- [ ] Monitor user activity
- [ ] Review security logs

## Post-Deployment Checklist

### Step 1: Verify Everything Works
- [ ] Test all features in production
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Verify all API endpoints
- [ ] Check error handling

### Step 2: Share Application
- [ ] Share URL with team/customers
- [ ] Document how to use it
- [ ] Create user accounts
- [ ] Setup initial data (products)
- [ ] Provide support documentation

### Step 3: Maintenance
- [ ] Monitor Vercel logs daily
- [ ] Check database size
- [ ] Review error logs
- [ ] Plan backups
- [ ] Update dependencies monthly

## Optional Enhancements

### Add Custom Domain
- [ ] Buy domain name
- [ ] Add to Vercel (Project Settings → Domains)
- [ ] Update DNS records
- [ ] Verify SSL certificate

### Upgrade Database
- [ ] Create PostgreSQL instance
- [ ] Update DATABASE_URL
- [ ] Run migrations
- [ ] Test all features

### Add More Features
- [ ] User roles/permissions
- [ ] Bulk product import
- [ ] Email notifications
- [ ] Export reports as PDF
- [ ] Mobile app

### Analytics
- [ ] Setup Vercel Analytics
- [ ] Monitor performance
- [ ] Track user behavior
- [ ] Review sales trends
- [ ] Optimize based on data

## Backup Checklist

### Local Development
- [ ] Backup .env file
- [ ] Backup dev.db (SQLite database)
- [ ] Keep git repository synced

### Production
- [ ] Backup database regularly
- [ ] Export data periodically
- [ ] Keep version history
- [ ] Document configuration
- [ ] Test recovery process

## Final Verification

- [ ] ✅ All files created successfully
- [ ] ✅ Installation completes without errors
- [ ] ✅ Local development works
- [ ] ✅ All features tested
- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Deployed to Vercel
- [ ] ✅ Production working
- [ ] ✅ Team can access
- [ ] ✅ Documentation available
- [ ] ✅ Backups in place

## Contact & Support

If you encounter issues:
1. Check QUICK_START.md
2. Review DEPLOYMENT_HELP.md
3. Check Vercel logs
4. See README.md troubleshooting
5. Check browser console (F12)

---

**You're all set! 🍵☕**

Your Tea Shop Billing System is now ready to use!
