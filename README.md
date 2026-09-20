# 🍵 Tea Shop Billing System

A complete billing and inventory management system for tea shops, built with React, Node.js, Express, PostgreSQL/SQLite, and Prisma.

## Features

✅ **Authentication**
- JWT-based login system
- User registration and profile management
- Role-based access control

✅ **Product Management**
- Create, Read, Update, Delete products
- Product categorization (tea, snacks, beverages)
- Price and cost tracking

✅ **Inventory Tracking**
- Real-time inventory management
- Low stock alerts
- Min/Max level settings
- Quantity adjustments

✅ **Billing System**
- Create bills with multiple items
- Automatic inventory deduction
- Tax and discount support
- Multiple payment methods (cash, card, UPI)
- Bill history and tracking

✅ **Dashboard**
- Daily sales summary
- Weekly analytics
- Top products today
- Payment method statistics
- Profit tracking

✅ **Responsive UI**
- Mobile-friendly design
- Modern gradient interface
- Real-time updates

## Project Structure

```
tea-shop-billing/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── app.js (React app)
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   └── package.json
├── api/
│   └── index.js (Vercel serverless function)
├── vercel.json
├── package.json
└── .env
```

## Local Development

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Setup

1. **Clone or Extract the project**
```bash
cd tea-shop-billing
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and update:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secure-key-here"
REACT_APP_API_URL="http://localhost:5000"
```

4. **Setup database**
```bash
cd backend
npx prisma db push
npx prisma generate
cd ..
```

5. **Start development servers**
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Deployment on Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/tea-shop-billing.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Node.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`

### Step 3: Add Environment Variables

In Vercel project settings, add:

```
DATABASE_URL = your-database-url (PostgreSQL or SQLite)
JWT_SECRET = your-secure-random-key
FRONTEND_URL = your-vercel-domain.vercel.app
```

**⚠️ For production, use PostgreSQL instead of SQLite:**

Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 4: Deploy

- Click "Deploy"
- Wait for build to complete
- Your app will be live at `https://your-project.vercel.app`

## Database Setup

### SQLite (Local Development - Default)
No additional setup needed. Database file will be created automatically.

### PostgreSQL (Production - Recommended)

1. Create PostgreSQL database on [Railway](https://railway.app), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres)

2. Get your DATABASE_URL connection string

3. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. Run migrations:
```bash
cd backend
npx prisma db push
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory` - List inventory
- `GET /api/inventory/:productId` - Get inventory item
- `POST /api/inventory/:productId/update` - Update quantity
- `PUT /api/inventory/:productId/levels` - Set min/max levels
- `GET /api/inventory/alerts/low-stock` - Get low stock items

### Bills
- `POST /api/bills` - Create bill
- `GET /api/bills` - List bills
- `GET /api/bills/:id` - Get bill details
- `PUT /api/bills/:id/status` - Update bill status
- `DELETE /api/bills/:id` - Delete bill

### Dashboard
- `GET /api/dashboard/sales-summary` - Sales summary (days parameter)
- `GET /api/dashboard/todays-summary` - Today's summary
- `GET /api/dashboard/product-analytics` - Product analytics
- `GET /api/dashboard/payment-stats` - Payment method stats

## Demo Credentials

After first deployment, you'll need to create a user. Use:
```
Email: admin@teashop.com
Password: admin123
Name: Admin User
```

## Testing Locally

### Create a Test Bill
1. Login with your credentials
2. Go to Billing section
3. Click "New Bill"
4. Select products
5. Add tax/discount if needed
6. Choose payment method
7. Click "Create Bill"

### Check Inventory
1. Go to Inventory Management
2. View product quantities
3. Use +10 or -5 buttons to adjust stock
4. Check low stock alerts

### View Dashboard
1. Dashboard shows today's sales
2. Weekly sales analytics
3. Top products
4. Profit tracking

## Troubleshooting

### 404 Error on Vercel
- Make sure `vercel.json` is in the root directory
- Check that `api/index.js` exists
- Verify build command is correct

### Database Connection Error
- Check DATABASE_URL in Vercel environment variables
- Ensure database is accessible
- For PostgreSQL, whitelist Vercel IPs in firewall

### API Calls Returning 401
- Ensure JWT_SECRET is set correctly in environment
- Check token is being sent in Authorization header
- Verify token hasn't expired

### Low Stock Alerts Not Showing
- Check inventory min level is set correctly
- Ensure stock quantity is below min level
- Refresh the page

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | Database connection string | `postgresql://...` |
| JWT_SECRET | Secret key for JWT tokens | `your-random-secret` |
| PORT | Server port (local only) | `5000` |
| NODE_ENV | Environment | `production` or `development` |
| REACT_APP_API_URL | API URL for frontend | `/api` or `http://localhost:5000` |
| FRONTEND_URL | Frontend URL for CORS | `https://app.vercel.app` |

## Technology Stack

- **Frontend**: React 18, Vanilla JS, CSS3
- **Backend**: Node.js, Express.js
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Auth**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Deployment**: Vercel

## Performance Tips

1. **Optimize Images**: Compress product images before uploading
2. **Database Indexing**: Add indexes to frequently queried fields
3. **Caching**: Implement caching for product list
4. **API Rate Limiting**: Add rate limiting for production

## Security Best Practices

1. ✅ Use strong JWT_SECRET
2. ✅ Enable HTTPS (Vercel does this automatically)
3. ✅ Hash passwords with bcryptjs
4. ✅ Validate all inputs on backend
5. ✅ Use environment variables for secrets
6. ✅ Implement CORS properly
7. ✅ Add rate limiting middleware
8. ✅ Use PostgreSQL for production

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License

## Support

For issues or questions:
1. Check troubleshooting section
2. Review error logs
3. Create an issue in the repository

---

**Made with ☕ for tea shop owners**
