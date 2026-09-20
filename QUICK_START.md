# Quick Start Guide - Tea Shop Billing System

## ⚡ 5-Minute Setup (Local)

### For Windows:
```bash
# 1. Double-click setup.bat
# 2. Wait for installation to complete
# 3. Run: npm run dev
```

### For macOS/Linux:
```bash
# 1. Run setup script
bash setup.sh

# 2. Start development servers
npm run dev
```

### For Manual Setup:
```bash
# Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Create .env file (copy from .env.example)
cp .env.example .env

# Start dev servers
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📝 First Time Setup

1. **Register a new account**
   - Click "Register" on login page
   - Fill in: Name, Email, Password
   - Submit

2. **Create products**
   - Go to Products tab
   - Click "Add Product"
   - Fill details (name, price, cost)
   - Save

3. **Create first bill**
   - Go to Billing tab
   - Click "New Bill"
   - Select products and quantities
   - Review total
   - Click "Create Bill"

4. **Check dashboard**
   - Go to Dashboard
   - See today's sales and analytics

## 🚀 Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Tea Shop Billing App"
git branch -M main
git remote add origin https://github.com/YOU/tea-shop-billing.git
git push -u origin main
```

2. **Create Vercel Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables** (in Vercel Dashboard)
   - Go to Settings → Environment Variables
   - Add:
     ```
     DATABASE_URL = file:./dev.db
     JWT_SECRET = your-random-secret-key
     FRONTEND_URL = your-vercel-app.vercel.app
     ```

4. **Redeploy**
   - Go to Deployments
   - Click "Redeploy" on latest build

5. **✅ Done!** 
   - Your app is live at `https://your-app.vercel.app`

## 🔒 Important Security Notes

⚠️ **Before going to production:**

1. **Change JWT_SECRET**
   - Use a strong, random key
   - Use an online generator: https://www.lastpass.com/features/password-generator

2. **Use PostgreSQL in production**
   - Update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   - Get a free PostgreSQL at:
     - [Supabase](https://supabase.com)
     - [Railway](https://railway.app)
     - [Vercel Postgres](https://vercel.com/storage/postgres)

3. **Set environment variables in Vercel**
   - Never commit `.env` file
   - Always use Vercel's environment variable panel

## 📱 Features Quick Tour

### Dashboard
- Real-time sales summary
- Weekly analytics
- Top products today
- Profit tracking

### Products
- Add/Edit/Delete products
- Track cost and selling price
- Organize by category

### Inventory
- Real-time stock tracking
- Low stock alerts
- Quick adjustments (+10, -5)
- Min/Max level settings

### Billing
- Multi-item bills
- Tax & Discount support
- Multiple payment methods
- Bill history

## 🐛 Troubleshooting

### "404 Error" on deployment
- Check `vercel.json` exists in root
- Check `api/index.js` exists
- Rebuild on Vercel dashboard

### API calls failing
- Check Backend URL is correct
- Check API is running (http://localhost:5000/api/health)
- Check CORS settings

### Database errors
- Check DATABASE_URL in environment
- Verify database file exists locally
- Run: `cd backend && npx prisma db push`

### Port already in use
- Change port in `backend/.env`
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`

## 📚 Useful Commands

```bash
# Start everything
npm run dev

# Just backend
cd backend && npm run dev

# Just frontend
cd frontend && npm run dev

# Reset database
cd backend && rm dev.db && npx prisma db push

# View Prisma Studio (database GUI)
cd backend && npx prisma studio

# Check API health
curl http://localhost:5000/api/health
```

## 🎯 Next Steps

1. ✅ Get it running locally
2. ✅ Test all features
3. ✅ Deploy to Vercel
4. ✅ Set up proper database (PostgreSQL)
5. ✅ Configure custom domain
6. ✅ Share with team

## 💡 Tips

- **Backup database**: Download `dev.db` regularly
- **Monitor dashboard**: Check daily sales trends
- **Bulk imports**: Use scripts to import products
- **Mobile access**: Works on any browser

## 🆘 Need Help?

1. Check [README.md](README.md) for detailed docs
2. Review troubleshooting section above
3. Check browser console for errors (F12)
4. Look at server logs in terminal

---

**Enjoy your Tea Shop Billing System! ☕🍵**
