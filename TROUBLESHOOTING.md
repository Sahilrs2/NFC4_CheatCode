# API Connection Troubleshooting Guide

## Common Issues and Solutions

### 1. **CORS Errors**
**Symptoms:** Browser console shows CORS errors
**Solution:** 
- Ensure Django CORS settings are correct in `Backend/Backend/settings.py`
- Check that `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`
- Verify `corsheaders` is in `INSTALLED_APPS` and `MIDDLEWARE`

### 2. **API Endpoint Not Found (404)**
**Symptoms:** Network tab shows 404 errors
**Solution:**
- Check Django server is running on port 8000
- Verify URL patterns in `Backend/api/urls.py`
- Ensure the API base URL is correct: `http://localhost:8000/api`

### 3. **Authentication Errors (401)**
**Symptoms:** Login/registration fails with 401
**Solution:**
- Check JWT settings in Django
- Verify `rest_framework_simplejwt` is installed
- Ensure authentication classes are configured

### 4. **Data Format Mismatch**
**Symptoms:** Registration/login fails with validation errors
**Solution:**
- Check the data format being sent from frontend
- Verify serializer fields match the expected format
- Use browser dev tools to inspect the request payload

## Testing Steps

### Step 1: Test Django Server
```bash
cd Backend
python manage.py runserver
```
Visit: http://localhost:8000/admin/ (should show Django admin)

### Step 2: Test API Endpoints
```bash
# Test API root
curl http://localhost:8000/api/

# Test registration
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "email": "test@example.com", 
    "password": "testpass123",
    "role": "user",
    "phone": "1234567890",
    "gender": "other",
    "location": "Test City",
    "language_preference": "English",
    "age": 25
  }'

# Test login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "testpass123"
  }'
```

### Step 3: Test Frontend Connection
1. Start React dev server: `npm run dev`
2. Open browser dev tools (F12)
3. Go to Network tab
4. Try to login/register
5. Check for failed requests

## Debug Checklist

- [ ] Django server running on port 8000
- [ ] React dev server running on port 5173
- [ ] CORS settings configured correctly
- [ ] JWT authentication set up
- [ ] API endpoints accessible
- [ ] Database migrations applied
- [ ] No console errors in browser
- [ ] Network requests showing in dev tools

## Common Error Messages

### "Network Error"
- Django server not running
- Wrong API URL
- CORS not configured

### "401 Unauthorized"
- Invalid credentials
- JWT token expired
- Authentication not configured

### "400 Bad Request"
- Invalid data format
- Missing required fields
- Validation errors

### "500 Internal Server Error"
- Django server error
- Database connection issue
- Code error in views/serializers

## Quick Fixes

### Reset Everything
```bash
# Stop all servers
# Clear browser cache
# Restart Django server
cd Backend
python manage.py runserver

# Restart React server
cd frontend/nfc_f
npm run dev
```

### Check Database
```bash
cd Backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Test with Postman/Insomnia
- Import the test requests
- Test each endpoint individually
- Check response format

## Still Having Issues?

1. Check Django logs for detailed error messages
2. Use browser dev tools to inspect network requests
3. Add console.log statements in frontend code
4. Use Django debug toolbar for backend debugging
5. Check if all required packages are installed

## Package Dependencies

### Backend (Django)
```bash
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install mysqlclient
```

### Frontend (React)
```bash
npm install axios
npm install react-router-dom
npm install lucide-react
``` 