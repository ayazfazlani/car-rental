# Admin User Management System

This document describes the admin user management system that allows Super Admins to manage other administrator accounts.

## Features

- **Super Admin Only**: Only users with the `SUPER_ADMIN` role can access user management features
- **Create Admins**: Add new administrator accounts with required fields
- **Edit Admins**: Update admin details including name, contact info, department, and status
- **Delete Admins**: Soft delete admin accounts (records are not permanently removed)
- **List & Search**: View all admins with filtering and search capabilities
- **Password Management**: Reset admin passwords (for editors only, super admins can set passwords)
- **Status Control**: Activate/deactivate admin accounts

## Database Schema

The system uses the existing `User` and `AdminProfile` models:

### User Model

- `id`: Unique identifier
- `email`: Email address (unique)
- `firstName`: Administrator's first name
- `lastName`: Administrator's last name
- `phone`: Optional phone number
- `passwordHash`: Bcrypt hashed password
- `role`: UserRole (SUPER_ADMIN, ADMIN, CUSTOMER)
- `isActive`: Account status
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp
- `deletedAt`: Soft delete timestamp (null if active)

### AdminProfile Model

- `id`: Unique identifier
- `userId`: Reference to User
- `employeeId`: Optional employee ID
- `department`: Department assignment
- `permissions`: JSON field for flexible permissions
- `lastLoginAt`: Last login timestamp
- `lastLoginIp`: Last login IP address
- `createdAt`: Profile creation timestamp
- `updatedAt`: Last update timestamp
- `deletedAt`: Soft delete timestamp

## API Endpoints

All endpoints require valid JWT authentication and SUPER_ADMIN role.

### List All Admins

```http
GET /api/admin/users?page=1&limit=10&search=&isActive=true
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by email or name (optional)
- `isActive`: Filter by status - "true", "false", or empty (optional)

**Response:**

```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "id": "user-id",
        "email": "admin@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z",
        "adminProfile": {
          "id": "profile-id",
          "employeeId": "EMP001",
          "department": "Administration",
          "lastLoginAt": "2024-01-15T12:30:00Z"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Get Specific Admin

```http
GET /api/admin/users/{userId}
```

**Response:** Single admin object (same format as list)

### Create New Admin

```http
POST /api/admin/users
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567891",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**

- Email: Valid email format, must be unique
- First Name: At least 2 characters
- Last Name: At least 2 characters
- Password: At least 8 characters
- Phone: Optional

**Response:**

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": "new-user-id",
    "email": "newadmin@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567891",
    "role": "ADMIN",
    "isActive": true,
    "adminProfile": {
      "id": "new-profile-id",
      "department": "Administration"
    },
    "createdAt": "2024-01-16T10:00:00Z"
  }
}
```

### Update Admin

```http
PUT /api/admin/users/{userId}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1234567892",
  "password": "NewSecurePassword123!",
  "department": "Operations",
  "isActive": true
}
```

**Notes:**

- `password` field is optional - leave blank to keep current password
- All other fields are optional
- Email cannot be changed
- Only SUPER_ADMIN can change the `isActive` status

**Response:** Updated admin object

### Delete Admin

```http
DELETE /api/admin/users/{userId}
```

**Notes:**

- Performs a soft delete (sets `deletedAt` to current timestamp)
- User record remains in database but is hidden from queries
- Cannot delete your own account (self-deletion prevented)
- Can only delete ADMIN role users, not SUPER_ADMIN

**Response:**

```json
{
  "success": true,
  "message": "Admin deleted successfully",
  "data": {
    "id": "user-id",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## UI Components

### Pages

- `/admin/users` - List all admins with filters and search
- `/admin/users/new` - Create new admin
- `/admin/users/{userId}` - Edit admin details

### Features

- **Search**: Filter admins by email, first name, or last name
- **Status Filter**: Show active, inactive, or all admins
- **Pagination**: Navigate through results (10 per page)
- **Quick Actions**: Edit and delete buttons on list view
- **Form Validation**: Real-time validation with error messages
- **Soft Delete**: Confirmation before deletion

## Error Handling

Common error responses:

### Unauthorized (401)

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "Only super admins can manage other admins"
}
```

### Conflict (409)

```json
{
  "success": false,
  "error": "CONFLICT",
  "message": "Email already in use"
}
```

### Validation Error (400)

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Password must be at least 8 characters"
}
```

## Security Considerations

1. **Role-Based Access Control**: Only SUPER_ADMIN can manage other admins
2. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 12
3. **Self-Deletion Prevention**: Admins cannot delete their own account
4. **Soft Deletion**: Deleted records are not permanently removed for data integrity
5. **Token Validation**: All requests require valid JWT authentication
6. **Unique Constraints**: Email and phone are unique at database level

## Usage Examples

### Creating an Admin Account

1. Navigate to `/admin/users`
2. Click "Add New Admin" button
3. Fill in the form with admin details
4. Click "Create Admin"

### Editing an Admin Account

1. Find the admin in the list
2. Click "Edit" button
3. Update the desired fields
4. Click "Update Admin"

### Deactivating an Admin

1. Edit the admin account
2. Uncheck the "Active" checkbox
3. Click "Update Admin"

### Deleting an Admin

1. Click "Delete" button next to the admin
2. Confirm deletion in the dialog
3. Record will be soft-deleted

## Frontend Integration

The UI components use the following utilities:

- `authenticatedFetch()`: Makes authenticated API requests with auto-redirect on 401
- `Button` component: Reusable button component with variants (primary, outline, etc.)
- Form validation: Client-side validation with error messages

## Future Enhancements

Potential improvements for future versions:

1. **Permissions Management**: Granular permission control per admin
2. **Activity Logs**: View admin action history
3. **Email Notifications**: Send welcome emails to new admins
4. **Bulk Operations**: Bulk delete or status change
5. **Admin Roles**: Different levels of admin access
6. **Two-Factor Authentication**: Enhanced security for admin accounts
7. **Password Expiration**: Force password changes periodically
8. **Email Verification**: Verify admin email before activation
