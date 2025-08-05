# NFC Frontend - React + Vite

This is the frontend application for the NFC (Non-Formal Career) platform, built with React and Vite.

## Features

- 🔐 JWT Authentication with automatic token refresh
- 📱 Responsive design with Tailwind CSS
- 🛡️ Protected routes for authenticated users
- 🔄 Real-time API integration with Django backend
- 🌐 Multi-language support
- 📊 Dashboard with progress tracking
- 👥 Mentor matching system
- 💼 Job posting and application system

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Django backend running on `http://localhost:8000`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## API Integration

The frontend is configured to connect to the Django backend API. The connection is handled through:

### API Service (`src/services/api.js`)
- Centralized API configuration with axios
- Automatic JWT token management
- Request/response interceptors for authentication
- Error handling and token refresh

### Authentication Context (`src/context/AuthContext.jsx`)
- Global authentication state management
- Login/logout functionality
- Token storage in localStorage
- Protected route handling

## Environment Configuration

The application is configured to connect to the Django backend at `http://localhost:8000`. If you need to change this:

1. Update the `API_BASE_URL` in `src/services/api.js`
2. Update the proxy configuration in `vite.config.js`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable components
│   └── ProtectedRoute.jsx
├── context/            # React context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── dashboard.jsx
│   ├── login.jsx
│   ├── signup.jsx
│   └── ...
├── services/           # API services
│   └── api.js
├── assets/             # Static assets
└── App.jsx            # Main application component
```

## API Endpoints

The frontend integrates with the following Django API endpoints:

- **Authentication:**
  - `POST /api/token/` - Login
  - `POST /api/token/refresh/` - Refresh token
  - `POST /api/register/` - User registration

- **User Management:**
  - `GET /api/users/` - Get user profiles
  - `POST /api/users/` - Create user profile
  - `PUT /api/users/{id}/` - Update user profile

- **Courses:**
  - `GET /api/courses/` - Get all courses
  - `GET /api/courses/{id}/` - Get specific course
  - `POST /api/enrollments/` - Enroll in course

- **Jobs:**
  - `GET /api/job-postings/` - Get job postings
  - `GET /api/job-postings/{id}/` - Get specific job

- **Mentors:**
  - `GET /api/mentor-profiles/` - Get mentor profiles
  - `GET /api/mentor-sessions/` - Get mentor sessions

## Development

### Adding New API Calls

1. Add the API function to `src/services/api.js`
2. Import and use it in your component
3. Handle loading states and errors appropriately

### Adding Protected Routes

1. Wrap your component with `ProtectedRoute` in `App.jsx`
2. The route will automatically redirect to login if not authenticated

### Styling

The project uses Tailwind CSS for styling. You can:
- Use Tailwind utility classes directly
- Create custom components with Tailwind
- Add custom CSS in component files

## Troubleshooting

### CORS Issues
- Ensure Django backend has CORS configured properly
- Check that `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`

### Authentication Issues
- Check browser console for API errors
- Verify JWT tokens are being stored correctly
- Ensure Django JWT settings are configured

### API Connection Issues
- Verify Django backend is running on port 8000
- Check network tab for failed requests
- Ensure API endpoints match between frontend and backend

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the NFC (Non-Formal Career) platform.
