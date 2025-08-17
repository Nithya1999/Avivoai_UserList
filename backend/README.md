# User Management API - Backend

A robust Node.js REST API built with Express.js and MySQL, serving user data that mimics the DummyJSON users structure. Features comprehensive error handling, security measures, and follows industry best practices.

## 🚀 Features

### Core Functionality
- **GET /api/users**: Fetch complete user list with filtering, searching, and pagination
- **GET /api/users/:id**: Fetch individual user by ID
- **Health Check**: Monitor API status and database connectivity
- **Database Seeding**: Populate database with DummyJSON user data

### Security & Best Practices
- **Rate Limiting**: Prevents API abuse with configurable limits
- **CORS Protection**: Secure cross-origin resource sharing
- **Helmet Security**: Security headers and XSS protection  
- **Input Validation**: Joi-based request validation and sanitization
- **SQL Injection Prevention**: Parameterized queries with mysql2
- **Environment Variables**: Secure configuration management
- **Error Handling**: Comprehensive error logging and user-friendly responses

### Advanced Features
- **Connection Pooling**: Optimized database performance
- **Graceful Shutdown**: Proper cleanup of resources
- **Request Logging**: Detailed error tracking and debugging
- **Data Masking**: Sensitive information protection (passwords, card numbers)
- **Flexible Filtering**: Search by name, company, country, and more
- **Pagination Support**: Efficient large dataset handling

## 🛠️ Technology Stack

- **Node.js** (v16+) - Runtime environment
- **Express.js** (v5+) - Web framework
- **MySQL** (v8+) - Database
- **mysql2** - MySQL client with Promise support
- **Joi** - Data validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **express-rate-limit** - API rate limiting

## 📋 Prerequisites

Before setting up the backend, ensure you have:

### Required Software
- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher)
- **MySQL** (version 8.0 or higher)
- **Git** (for cloning the repository)

### MySQL Setup
1. **Install MySQL Server** on your system
2. **Start MySQL service**
3. **Create a database user** (or use root)
4. **Note your MySQL credentials** (host, port, username, password)

## 🚀 Getting Started

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd Avivoai_Task/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=user_management

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key_here
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Setup

The API will automatically create the database and tables, but you need to ensure:

1. **MySQL is running** on your system
2. **Database user has proper permissions** to create databases and tables
3. **Connection details in .env are correct**

### 5. Seed the Database

```bash
# Populate database with sample data from DummyJSON
npm run seed
```

This will:
- Create the `user_management` database if it doesn't exist
- Create the `users` table with comprehensive schema
- Fetch and insert user data from DummyJSON API
- Add additional sample users for testing

### 6. Start the Development Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection and configuration
├── middleware/
│   ├── errorHandler.js      # Global error handling and async wrapper
│   └── validation.js        # Request validation and sanitization
├── routes/
│   └── users.js            # User API endpoints
├── scripts/
│   └── seedDatabase.js     # Database seeding utilities
├── .env                    # Environment variables (create from .env.example)
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── server.js             # Main application entry point
└── README.md             # This documentation
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Health Check
**GET** `/health`

Check API and database status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development"
}
```

### 2. Get All Users
**GET** `/api/users`

Fetch users with optional filtering, searching, and pagination.

**Query Parameters:**
- `limit` (number, 1-1000): Number of users to return
- `offset` (number, ≥0): Number of users to skip
- `search` (string): Search in names, email, company, role
- `country` (string): Filter by country
- `company` (string): Filter by company name

**Examples:**
```bash
# Get all users
GET /api/users

# Get first 10 users
GET /api/users?limit=10

# Search for users
GET /api/users?search=john&limit=5

# Filter by country
GET /api/users?country=United%20States

# Pagination
GET /api/users?limit=20&offset=40
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0123",
      "username": "johndoe",
      "password": "***",
      "birthDate": "1990-05-15",
      "image": "https://example.com/avatar.jpg",
      "bloodGroup": "O+",
      "height": 175.5,
      "weight": 70.2,
      "eyeColor": "Brown",
      "hair": {
        "color": "Black",
        "type": "Straight"
      },
      "address": {
        "address": "123 Main St",
        "city": "New York",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        },
        "postalCode": "10001",
        "state": "NY",
        "country": "United States"
      },
      "company": {
        "department": "Engineering",
        "name": "Tech Solutions Inc",
        "title": "Software Engineer",
        "address": {
          "address": "456 Business Ave",
          "city": "New York",
          "coordinates": {
            "lat": 40.7589,
            "lng": -73.9851
          },
          "postalCode": "10002",
          "state": "NY",
          "country": "United States"
        }
      },
      "bank": {
        "cardExpire": "12/25",
        "cardNumber": "****1234",
        "cardType": "Visa",
        "currency": "USD",
        "iban": "US64****0001"
      },
      "crypto": {
        "coin": "Bitcoin",
        "wallet": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        "network": "Ethereum"
      }
    }
  ],
  "total": 150,
  "skip": 0,
  "limit": 1,
  "hasMore": true,
  "page": 1,
  "totalPages": 150
}
```

### 3. Get User by ID
**GET** `/api/users/:id`

Fetch a specific user by their ID.

**Parameters:**
- `id` (number): User ID

**Example:**
```bash
GET /api/users/1
```

**Response:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  // ... complete user object
}
```

### 4. API Root
**GET** `/`

Get API information and available endpoints.

**Response:**
```json
{
  "message": "User Management API",
  "version": "1.0.0",
  "endpoints": {
    "users": "/api/users",
    "health": "/health"
  },
  "documentation": "See README.md for setup and usage instructions"
}
```

## 🗄️ Database Schema

The `users` table includes comprehensive fields matching the DummyJSON structure:

### Core Fields
- `id` - Auto-increment primary key
- `firstName`, `lastName` - User names
- `email` - Unique email address
- `phone`, `username` - Contact and login info
- `password` - Encrypted password (masked in responses)
- `birthDate` - Date of birth
- `image` - Profile image URL

### Physical Attributes
- `bloodGroup` - Blood type
- `height`, `weight` - Physical measurements
- `eyeColor` - Eye color
- `hair_color`, `hair_type` - Hair attributes

### Address Information
- `address_address` - Street address
- `address_city`, `address_state`, `address_country` - Location
- `address_coordinates_lat`, `address_coordinates_lng` - GPS coordinates
- `address_postalCode` - Postal/ZIP code

### Company Information
- `company_name`, `company_department`, `company_title` - Work details
- `company_address_*` - Company location fields

### Financial Information
- `bank_cardExpire`, `bank_cardNumber`, `bank_cardType` - Card details (masked)
- `bank_currency`, `bank_iban` - Banking information
- `crypto_coin`, `crypto_wallet`, `crypto_network` - Cryptocurrency info

### Technical Fields
- `domain`, `ip`, `macAddress` - Network information
- `university` - Educational background
- `created_at`, `updated_at` - Timestamps

### Indexes
- Primary key on `id`
- Unique indexes on `email` and `username`
- Performance indexes on `firstName`, `lastName`, `company_name`, `address_country`

## 🔒 Security Features

### Input Validation
- **Joi schemas** for all request parameters
- **Data sanitization** to prevent XSS attacks
- **Type checking** and format validation
- **Length limits** on all string fields

### SQL Injection Prevention
- **Parameterized queries** using mysql2 prepared statements
- **No dynamic SQL construction**
- **Input escaping** at the database layer

### Rate Limiting
- **Configurable limits** per IP address
- **Time window controls** (default: 15 minutes)
- **Graceful error responses** with retry information

### Security Headers
- **Helmet.js** for security headers
- **Content Security Policy** configuration
- **XSS protection** headers
- **CORS** with whitelist configuration

### Data Protection
- **Password masking** in all responses
- **Credit card number masking** (show only last 4 digits)
- **IBAN masking** (show only first and last 4 characters)
- **Environment variable** protection for sensitive data

## ⚡ Performance Optimizations

### Database
- **Connection pooling** for efficient resource usage
- **Prepared statements** for query optimization
- **Strategic indexes** on commonly queried fields
- **Pagination** to handle large datasets

### Application
- **Async/await** patterns throughout
- **Error boundaries** to prevent crashes
- **Memory-efficient** data processing
- **Graceful shutdown** handling

## 🐛 Error Handling

### Error Types
- **Validation errors** (400) - Invalid input data
- **Authentication errors** (401) - Invalid or missing tokens
- **Not found errors** (404) - Resource not found
- **Database errors** (500/503) - Connection or query issues
- **Rate limit errors** (429) - Too many requests

### Error Response Format
```json
{
  "success": false,
  "error": "User-friendly error message",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

### Development Mode
In development (`NODE_ENV=development`), errors include:
- **Full stack traces**
- **Request details** (headers, body, params)
- **Database query information**
- **Additional debugging context**

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Get all users
curl http://localhost:5000/api/users

# Search users
curl "http://localhost:5000/api/users?search=john&limit=5"

# Get specific user
curl http://localhost:5000/api/users/1

# Test rate limiting (run multiple times quickly)
for i in {1..10}; do curl http://localhost:5000/api/users; done
```

### Using Postman

1. **Import the collection** (create from endpoints above)
2. **Set base URL** to `http://localhost:5000`
3. **Test all endpoints** with various parameters
4. **Verify error handling** with invalid data

### Integration with Frontend

Update your frontend API base URL to point to the backend:

```javascript
// In your React app's userService.js
const API_BASE_URL = 'http://localhost:5000/api';

// The /users endpoint will now fetch from your MySQL database
export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data.users || [];
};
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**:
```env
NODE_ENV=production
PORT=80
DB_HOST=your-production-db-host
DB_PASSWORD=strong-production-password
JWT_SECRET=very-strong-production-secret
```

2. **Security Considerations**:
- Use **HTTPS** in production
- Set up **firewall rules** for database access
- Use **environment-specific** CORS origins
- Enable **database SSL** connections
- Set up **monitoring** and **logging**

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Process Management

```bash
# Using PM2 for production
npm install -g pm2
pm2 start server.js --name "user-api"
pm2 startup
pm2 save
```

## 📊 Monitoring & Logging

### Health Monitoring
- **GET /health** endpoint for uptime checks
- **Database connectivity** verification
- **Process uptime** tracking
- **Environment status** reporting

### Error Logging
- **Console logging** with timestamps
- **Error categorization** by type and severity
- **Request context** logging for debugging
- **Stack trace** capture in development

### Performance Metrics
- **Response time** tracking
- **Database query** performance
- **Memory usage** monitoring
- **Rate limit** statistics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL host | localhost | Yes |
| `DB_PORT` | MySQL port | 3306 | No |
| `DB_USER` | MySQL username | root | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | user_management | Yes |
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment | development | No |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `API_RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 | No |
| `API_RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | No |

### Database Configuration
- **Connection pooling**: 10 connections max
- **Timeout settings**: 60 seconds
- **Reconnection**: Automatic
- **Character set**: UTF8MB4 for full Unicode support

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```
   ❌ Database connection failed: ECONNREFUSED
   ```
   - **Check**: MySQL service is running
   - **Verify**: Connection credentials in `.env`
   - **Test**: Connect to MySQL manually

2. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::5000
   ```
   - **Solution**: Change `PORT` in `.env` or kill existing process
   - **Check**: `netstat -ano | findstr :5000` (Windows)

3. **Seeding Fails**
   ```
   ❌ Database seeding failed: ER_ACCESS_DENIED_ERROR
   ```
   - **Check**: Database user has CREATE/INSERT permissions
   - **Verify**: Database name exists or user can create it

4. **Rate Limit Errors**
   ```
   Too many requests from this IP
   ```
   - **Solution**: Wait for rate limit window to reset
   - **Adjust**: Rate limit settings in `.env`

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
DEBUG=*
```

### Database Issues

```bash
# Test MySQL connection
mysql -h localhost -u your_username -p

# Check database exists
SHOW DATABASES;

# Verify table structure
USE user_management;
DESCRIBE users;

# Check data
SELECT COUNT(*) FROM users;
```

## 📝 API Scripts

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Populate database with sample data
- `npm test` - Run tests (placeholder)

### Custom Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "seed:fresh": "npm run seed -- --fresh",
    "db:reset": "node scripts/resetDatabase.js",
    "logs": "pm2 logs user-api"
  }
}
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **ESLint** configuration for consistent code style
- **Prettier** for code formatting
- **JSDoc** comments for functions
- **Error handling** for all async operations
- **Security** best practices

## 📄 License

This project is part of the Avivoai Task assessment.

## 🆘 Support

For technical support:

1. **Check** this README for common solutions
2. **Review** error logs for specific issues
3. **Test** database connectivity independently
4. **Verify** environment configuration
5. **Check** Node.js and MySQL versions

---

## 🎯 Quick Start Checklist

- [ ] Node.js 16+ installed
- [ ] MySQL 8+ installed and running
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env` file)
- [ ] Database seeded (`npm run seed`)
- [ ] Server started (`npm run dev`)
- [ ] API tested (`curl http://localhost:5000/health`)

**🎉 Your User Management API is ready!**

**API Base URL**: `http://localhost:5000`  
**Users Endpoint**: `http://localhost:5000/api/users`  
**Health Check**: `http://localhost:5000/health`
