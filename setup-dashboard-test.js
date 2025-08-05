// Script to help test the dashboard with sample data
console.log(`
🚀 Dashboard Testing Guide
==========================

1. First, populate your Django database with sample data:
   cd Backend
   python manage.py populate_sample_data

2. Start your Django server:
   python manage.py runserver

3. Start your React frontend:
   cd ../frontend/nfc_f
   npm run dev

4. Test login with one of these accounts:
   - Email: user1@example.com, Password: testpass123
   - Email: user2@example.com, Password: testpass123
   - Email: user3@example.com, Password: testpass123

5. After login, you should see:
   ✅ Real user data from the database
   ✅ Actual courses and enrollments
   ✅ Real job postings
   ✅ Mentor sessions (if any)
   ✅ Dynamic notifications based on your data

6. If you see "No data available" messages, it means:
   - The API calls are working but no data exists
   - Run the populate_sample_data command again
   - Check that your database has data

7. To verify API endpoints are working:
   node test-api.js

8. Common issues:
   - CORS errors: Check Django CORS settings
   - 401 errors: Check JWT authentication
   - 404 errors: Check API URLs and Django server
   - Empty data: Run populate_sample_data command

Happy testing! 🎉
`); 