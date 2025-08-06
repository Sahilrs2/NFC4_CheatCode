# Contact Us Backend Implementation

## Overview
The contact us backend has been enhanced to support comprehensive customer support ticket management with full integration to the frontend contact form.

## Features Implemented

### 1. Enhanced Customer Support Model
- **Form Fields**: name, email, phone, subject, message, category
- **Support Tracking**: status, priority, assigned_to, timestamps
- **Categories**: general, technical, course, job, mentorship
- **Statuses**: pending, in_progress, resolved, closed
- **Priorities**: low, medium, high

### 2. API Endpoints
- `POST /api/customer-support/` - Create new support ticket
- `GET /api/customer-support/` - List all tickets (with filtering)
- `GET /api/customer-support/{id}/` - Get specific ticket
- `PUT /api/customer-support/{id}/` - Update ticket
- `DELETE /api/customer-support/{id}/` - Delete ticket
- `POST /api/customer-support/{id}/assign_to_me/` - Assign ticket to current user
- `POST /api/customer-support/{id}/mark_resolved/` - Mark ticket as resolved
- `GET /api/customer-support/statistics/` - Get support statistics

### 3. Query Parameters for Filtering
- `status` - Filter by ticket status
- `category` - Filter by ticket category
- `priority` - Filter by priority level
- `assigned_to` - Filter by assigned user
- `search` - Search in name, email, subject, message

### 4. Frontend Integration
- Form data is sent to backend via `supportAPI.createSupport(formData)`
- Real-time validation and error handling
- Success/error feedback to users

### 5. Admin Interface
- Enhanced Django admin with custom fieldsets
- Bulk editing capabilities
- Search and filtering
- Read-only protection for form fields

## Database Schema

```python
class customer_support(models.Model):
    # Form fields
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, null=True, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Support tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(User, null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
```

## Usage Examples

### Creating a Support Ticket
```javascript
// Frontend
const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 98765 43210',
  subject: 'Need help with course enrollment',
  message: 'I am having trouble enrolling in the Digital Literacy course.',
  category: 'course'
};

const response = await supportAPI.createSupport(formData);
```

### Getting Support Statistics
```javascript
// Admin/Backend
const stats = await api.get('/api/customer-support/statistics/');
// Returns: total_tickets, pending_tickets, in_progress_tickets, resolved_tickets, etc.
```

### Filtering Tickets
```javascript
// Get all pending technical tickets
const tickets = await api.get('/api/customer-support/?status=pending&category=technical');
```

## Sample Data
The system includes sample support tickets with various categories, statuses, and priorities for testing purposes.

## Security Features
- Input validation and sanitization
- Rate limiting (can be added)
- Authentication required for admin operations
- Audit logging for all ticket changes

## Next Steps
1. Run migrations: `python manage.py makemigrations && python manage.py migrate`
2. Populate sample data: `python manage.py populate_sample_data`
3. Test the contact form on the frontend
4. Access admin panel at `/admin/` to manage tickets

## API Response Format
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "subject": "Need help with course enrollment",
  "message": "I am having trouble enrolling...",
  "category": "course",
  "category_display": "Course Related",
  "status": "pending",
  "status_display": "Pending",
  "priority": "medium",
  "priority_display": "Medium",
  "assigned_to": null,
  "assigned_to_username": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "resolved_at": null
}
``` 