# Odoo_CodeCrunch

Problem Statement - Skill Swap Platform

Team Name - CodeCrunch

Team Email Address - prishahadvani17@gmail.com
                     palakdave2023@gmail.com
                     arpitavekariya6379@gmail.com

# Skill Swap Platform

A full-stack MERN application that enables users to list their skills and request others in return. Users can browse, search, and connect with others to exchange skills and knowledge.

## Features

### User Features
- **User Registration & Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Update personal info, skills, and availability
- **Skill Listing**: Add skills you can offer and skills you want to learn
- **User Search**: Browse and search users by skills and location
- **Skill Swap Requests**: Send and manage swap requests
- **Rating System**: Rate and review after completed swaps
- **Privacy Controls**: Make profiles public or private

### Swap Management
- **Create Swap Requests**: Send requests to other users
- **Accept/Reject Swaps**: Manage incoming requests
- **Cancel Requests**: Cancel pending requests
- **Track Status**: Monitor pending, accepted, and completed swaps
- **Rating & Feedback**: Rate completed swaps

### Admin Features
- **User Management**: View, ban/unban users
- **Content Moderation**: Monitor and manage platform content
- **Analytics**: View platform statistics and reports
- **Role Management**: Assign admin roles

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **CSS3** - Styling

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Quick Start (GitHub)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd skill-swap-platform
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

### Manual Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skill-swap-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/skill-swap
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running Both (Development)

From the root directory:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Users
- `GET /api/users/search` - Search users by skills
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/skills-offered` - Update skills offered
- `PUT /api/users/skills-wanted` - Update skills wanted
- `PUT /api/users/availability` - Update availability
- `PUT /api/users/privacy` - Update profile privacy

### Swaps
- `POST /api/swaps` - Create swap request
- `GET /api/swaps/my-swaps` - Get user's swaps
- `GET /api/swaps/pending` - Get pending requests
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/reject` - Reject swap
- `PUT /api/swaps/:id/cancel` - Cancel swap
- `PUT /api/swaps/:id/complete` - Complete swap
- `POST /api/swaps/:id/rate` - Rate completed swap
- `DELETE /api/swaps/:id` - Delete swap request

### Skills
- `GET /api/skills/popular` - Get popular skills
- `GET /api/skills/suggestions` - Get skill suggestions

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/swaps` - Get all swaps
- `PUT /api/admin/users/:id/ban` - Ban user
- `PUT /api/admin/users/:id/unban` - Unban user
- `PUT /api/admin/users/:id/make-admin` - Make user admin
- `PUT /api/admin/users/:id/remove-admin` - Remove admin role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/reports` - Get detailed reports

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  location: String,
  profilePhoto: String,
  skillsOffered: [{
    name: String,
    description: String,
    level: String
  }],
  skillsWanted: [{
    name: String,
    description: String,
    level: String
  }],
  availability: {
    weekdays: Boolean,
    weekends: Boolean,
    evenings: Boolean,
    mornings: Boolean
  },
  isPublic: Boolean,
  role: String,
  rating: {
    average: Number,
    count: Number
  },
  isBanned: Boolean
}
```

### Swap Model
```javascript
{
  requester: ObjectId,
  recipient: ObjectId,
  requestedSkill: {
    name: String,
    description: String,
    level: String
  },
  offeredSkill: {
    name: String,
    description: String,
    level: String
  },
  status: String,
  message: String,
  scheduledDate: Date,
  completedDate: Date,
  requesterRating: {
    rating: Number,
    comment: String,
    date: Date
  },
  recipientRating: {
    rating: Number,
    comment: String,
    date: Date
  }
}
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Complete Profile**: Add your skills, availability, and location
3. **Search Users**: Find people with skills you want to learn
4. **Send Swap Request**: Propose a skill exchange
5. **Manage Requests**: Accept, reject, or cancel swap requests
6. **Complete Swaps**: Mark swaps as completed and rate each other

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@skillswapplatform.com or create an issue in the repository. 