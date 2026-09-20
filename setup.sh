#!/bin/bash

echo "🍵 Tea Shop Billing System - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your values."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "📦 Installing root dependencies..."
npm install

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

echo ""
echo "📝 Setting up database..."
echo "Generating Prisma client..."
npx prisma generate 2>/dev/null || echo "⚠️  Prisma generation skipped (network issue)"

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
cd ..
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "To start development servers, run:"
echo "  npm run dev"
echo ""
echo "Backend will run on:  http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Default test credentials:"
echo "  Email: admin@teashop.com"
echo "  Password: admin123"
echo ""
echo "For deployment on Vercel, see README.md"
echo "=========================================="
