# ⭐ Store Rating Platform

A full-stack web application that allows users to discover, manage, and rate stores. The platform provides role-based functionality for **System Administrators**, **Normal Users**, and **Store Owners**.

Built as part of a **Full Stack Intern Coding Challenge** using **React.js, Express.js, and MySQL**.

---

## 📌 Project Overview

The Store Rating Platform provides a single authentication system with role-based access control.

After logging in, users receive access to different functionalities based on their assigned role:

- **System Administrator** — manages users, stores, and platform data.
- **Normal User** — browses stores and submits or updates ratings.
- **Store Owner** — monitors ratings submitted for their assigned store.

The application includes:

- Authentication and authorization
- Role-based access control
- Form validation
- Password management
- Store ratings
- Filtering and sorting
- Protected routes
- Responsive user interface

---

# 🚀 Features

## 🔐 Authentication and Authorization

- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization
- Single login system for all user roles
- Protected frontend routes
- Role-based access to application features
- Normal users can register through the platform
- Secure login functionality
- Password update functionality for authenticated users
- Logout functionality
- Unauthorized users are redirected appropriately based on authentication and role

### Supported Roles

- `USER`
- `OWNER`
- `ADMIN`

---

# 👤 Normal User

Normal users can:

- Register and log in to the platform
- Update their password after logging in
- View all registered stores
- Search stores by:
  - Store Name
  - Address
- View:
  - Store Name
  - Store Address
  - Overall Store Rating
  - Their Submitted Rating
- Submit ratings between **1 and 5**
- Update an existing rating
- Log out of the platform

---

# 🏪 Store Owner

Store owners can:

- Log in to the platform
- Update their password
- Access their store dashboard
- View users who submitted ratings for their store
- View customer ratings
- View the average rating of their store
- Log out of the platform

---

# 👨‍💼 System Administrator

## Dashboard

Administrators can view platform statistics including:

- Total number of users
- Total number of stores
- Total number of submitted ratings

---

## User Management

Administrators can:

- Add new users
- Create Normal Users
- Create Administrator Users
- View all users
- View user details

User information includes:

- Name
- Email
- Address
- Role

Store Owner details and associated rating information are displayed where applicable.

---

## User Filtering

Users can be filtered by:

- Name
- Email
- Address
- Role

---

## User Sorting

Users can be sorted in ascending or descending order by key fields such as:

- ID
- Name
- Email
- Address
- Role
- Registration Date

---

## Store Management

Administrators can:

- View registered stores
- Add new stores
- Update stores
- Delete stores

Store information includes:

- Store Name
- Email
- Address
- Average Rating

---

## Store Filtering

Stores can be filtered by:

- Name
- Email
- Address

---

## Store Sorting

Stores can be sorted in ascending or descending order by:

- Name
- Email
- Address
- Average Rating
- Created Date

---

## Logout

Administrators can securely log out of the platform.

---

# ⭐ Rating System

The platform allows Normal Users to rate registered stores.

## Rating Rules

- Ratings must be between **1 and 5**
- A user can submit a rating for a store
- Users can update their previously submitted rating
- Store listings display:
  - Overall Rating
  - Logged-in User's Submitted Rating
- Store Owners can view ratings submitted for their store
- Average store ratings are calculated from submitted ratings

---

# 📝 Form Validation

The application follows the validation rules specified in the coding challenge.

| Field | Validation Rule |
| --- | --- |
| Name | Minimum 20 characters and maximum 60 characters |
| Address | Maximum 400 characters |
| Email | Must follow standard email validation rules |
| Password | Between 8 and 16 characters |
| Password | Must contain at least one uppercase letter |
| Password | Must contain at least one special character |
| Rating | Must be between 1 and 5 |

---

# 🔎 Filtering and Sorting

## User Management

### Filters

Users can be filtered by:

- Name
- Email
- Address
- Role

### Sorting

Users can be sorted in ascending or descending order by:

- ID
- Name
- Email
- Address
- Role
- Registration Date

---

## Store Management

### Filters

Stores can be filtered by:

- Name
- Email
- Address

### Sorting

Stores can be sorted in ascending or descending order by:

- Name
- Email
- Address
- Average Rating
- Created Date

---

# 📱 Responsive Design

The application is designed to work across different screen sizes.

The frontend layout adapts for:

- Desktop devices
- Tablets
- Mobile devices

Responsive styling ensures that:

- Navigation adapts to smaller screens
- Cards and dashboard sections stack appropriately
- Forms remain usable on smaller devices
- Tables remain readable using horizontal scrolling when required
- Buttons and text avoid unnecessary compression or awkward wrapping

---

# 🛠️ Tech Stack

## Frontend

- React
- React Router
- Vite
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js

## Database

- MySQL
- MySQL2

## Authentication and Security

- JSON Web Tokens (JWT)
- bcrypt
- express-validator
- Environment Variables

---

# 📁 Project Structure

```text
store-rating-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PasswordUpdateForm.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminStores.jsx
│   │   │   └── AdminUserDetails.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── storeController.js
│   │   ├── ratingController.js
│   │   ├── ownerController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── storeRoutes.js
│   │   ├── ratingRoutes.js
│   │   ├── ownerRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Before running the project, make sure you have installed:

- Node.js
- npm
- MySQL Server

---

# 🔐 Environment Configuration

The application uses environment variables to protect sensitive information such as database credentials and JWT secrets.

## 1. Create the Environment File

Copy the example environment file:

```bash
cp server/.env.example server/.env
```

If you are using Windows and the command above does not work, manually create:

```text
server/.env
```

Then copy the required environment variable names from:

```text
server/.env.example
```

---

## 2. Configure Environment Variables

Update `server/.env` with your local configuration:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_platform

JWT_SECRET=your_secure_jwt_secret
```

> ⚠️ Never commit your `.env` file to GitHub.

The `.env` file should remain excluded through `.gitignore`.

---

# 🗄️ Database Setup

## 1. Create the Database

Open MySQL and run:

```sql
CREATE DATABASE store_rating_platform;
```

---

## 2. Configure the Application

Make sure the database name in your `.env` file matches your database configuration:

```env
DB_NAME=store_rating_platform
```

Configure the remaining database credentials according to your local MySQL setup.

---

# ▶️ Running the Backend

Open a terminal and navigate to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Or run the server normally:

```bash
npm start
```

The backend runs using the configured server port.

---

# 💻 Running the Frontend

Open another terminal and navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite application will provide a local development URL, typically:

```text
http://localhost:5173
```

---

# 📦 Production Build

To create a production build of the frontend:

```bash
cd client
npm run build
```

---

# 📜 Available Scripts

| Location | Command | Description |
| --- | --- | --- |
| `server` | `npm run dev` | Start backend using Nodemon |
| `server` | `npm start` | Start backend using Node.js |
| `client` | `npm run dev` | Start Vite development server |
| `client` | `npm run build` | Create a production build |

---

# 🔐 Security Practices

The project follows several security practices:

- Passwords are hashed using bcrypt
- Authentication is handled using JWT
- Protected routes require authentication
- Role-based authorization restricts access to authorized users
- Passwords and secrets are stored using environment variables
- `.env` files are excluded from version control
- Parameterized database queries help reduce SQL injection risks
- Backend validation is applied to authentication inputs

---

# 👥 Role-Based Access Control

The application uses three primary roles.

| Feature | USER | OWNER | ADMIN |
| --- | :---: | :---: | :---: |
| Login | ✅ | ✅ | ✅ |
| Register as Normal User | ✅ | ❌ | ❌ |
| Browse Stores | ✅ | ❌ | ❌ |
| Submit Rating | ✅ | ❌ | ❌ |
| Update Rating | ✅ | ❌ | ❌ |
| Update Password | ✅ | ✅ | Role-based access |
| View Own Store Ratings | ❌ | ✅ | ❌ |
| View Average Store Rating | ❌ | ✅ | ❌ |
| View Platform Statistics | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Manage Stores | ❌ | ❌ | ✅ |
| Logout | ✅ | ✅ | ✅ |

---

# 🧪 Requirement Coverage

This project implements the major requirements of the Full Stack Intern Coding Challenge.

## System Administrator

- [x] Add users
- [x] Support USER and ADMIN creation
- [x] Dashboard with user count
- [x] Dashboard with store count
- [x] Dashboard with rating count
- [x] View users
- [x] View user details
- [x] Filter users
- [x] Sort users
- [x] Manage stores
- [x] Filter stores
- [x] Sort stores
- [x] Logout

## Normal User

- [x] Register
- [x] Login
- [x] Update password
- [x] Browse stores
- [x] Search stores
- [x] View overall ratings
- [x] View personal rating
- [x] Submit ratings
- [x] Update ratings
- [x] Logout

## Store Owner

- [x] Login
- [x] Update password
- [x] View store rating information
- [x] View users who submitted ratings
- [x] View average rating
- [x] Logout

## Validation

- [x] Name validation
- [x] Address validation
- [x] Email validation
- [x] Password validation
- [x] Rating validation

## Additional Requirements

- [x] Role-based access control
- [x] Authentication and authorization
- [x] Protected routes
- [x] Filtering functionality
- [x] Sorting functionality
- [x] Responsive user interface
- [x] MySQL database integration

---

# 🧹 Repository Practices

The repository excludes unnecessary and sensitive files using `.gitignore`.

Examples include:

```text
node_modules/
.env
dist/
*.log
```

This helps keep the repository clean and prevents sensitive credentials from being uploaded.

---

# 🔮 Future Improvements

Possible future enhancements include:

- Pagination for large datasets
- Store categories
- Review comments alongside ratings
- Admin analytics and charts
- Email notifications
- Rate limiting
- Audit logging
- Two-factor authentication
- Docker support
- Deployment configuration

---

# 👩‍💻 Author

**Renuka Chavan**

B.Tech Student | AI & Data Science  
Full Stack Development Enthusiast

---

# 📄 License

This project was created for educational and coding challenge purposes.

---

# 📌 Project Status

- ✅ Core requirements implemented
- ✅ Role-based access control implemented
- ✅ Authentication and validation implemented
- ✅ Sorting and filtering implemented
- ✅ Responsive design implemented
- ✅ Environment variable configuration included
- ✅ Repository prepared for GitHub submission
