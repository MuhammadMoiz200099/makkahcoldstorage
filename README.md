### makkahcoldstorage

A comprehensive warehouse management system built with Next.js, MongoDB, and modern UI components.

## Features

- **Authentication & Authorization**: JWT-based authentication with role management (Admin/Member)
- **Dashboard**: Real-time KPIs showing daily and monthly stock movements
- **Stock Management**: Complete CRUD operations for Stock In/Out with advanced filtering
- **Expense Tracking**: Monthly and weekly expense management
- **Reporting**: Comprehensive reports for stock movements and expenses
- **User Management**: Admin panel for user management with role-based access
- **Responsive Design**: Modern UI with collapsible navigation and mobile support

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT with bcryptjs
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React

## Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Deployment to Vercel

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing

3. **Deploy**: Vercel will automatically build and deploy your application

## Database Setup

After deployment, visit `/api/setup` to initialize the database with default users:
- Admin: admin@warehouse.com (password: 123456)
- Member: member@warehouse.com (password: 123456)

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Routes

- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `GET /api/dashboard` - Dashboard KPIs and recent transactions
- `POST /api/setup` - Initialize database (run once)

## Features Overview

### Dashboard
- Real-time KPIs for stock movements
- Recent transactions table with search and filtering
- Responsive design with modern UI

### Stock Management
- Stock In/Out with complete CRUD operations
- Advanced search, filtering, and pagination
- Modal-based forms for data entry

### User Management (Admin Only)
- User creation and management
- Role-based access control
- Complete user CRUD operations

### Reports
- Monthly and yearly reports
- Stock movement analytics
- Expense tracking and reporting

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Route protection with middleware
- Role-based access control
- Secure API endpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)