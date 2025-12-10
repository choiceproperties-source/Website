# Choice Properties - API Documentation

## Base URL
- **Development:** `http://localhost:8000`
- **Production:** `{your-domain.com}`

---

## 📦 PROPERTIES ENDPOINTS

### GET /api/properties
Get all properties

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Beautiful 3BR House",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "price": 500000,
      "beds": 3,
      "baths": 2,
      "sqft": 2000,
      "description": "...",
      "amenities": "Pool, Gym, Parking",
      "images": "url1,url2",
      "contact_phone": "(555) 123-4567",
      "contact_email": "agent@example.com",
      "created_at": "2024-12-10T..."
    }
  ]
}
```

### GET /api/properties/:id
Get single property

**URL Params:** `id` (uuid)

**Response:**
```json
{
  "success": true,
  "data": { /* property object */ }
}
```

### POST /api/properties
Create new property

**Body:**
```json
{
  "title": "Beautiful 3BR House",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "price": 500000,
  "beds": 3,
  "baths": 2.5,
  "sqft": 2000,
  "description": "Spacious home...",
  "amenities": "Pool, Gym, Parking",
  "contact_phone": "(555) 123-4567",
  "contact_email": "agent@example.com",
  "images": "url1,url2" (optional)
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": { /* created property */ }
}
```

### PUT /api/properties/:id
Update property

**URL Params:** `id` (uuid)

**Body:** Any fields to update (same as POST)

**Response:**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": { /* updated property */ }
}
```

### DELETE /api/properties/:id
Delete property

**URL Params:** `id` (uuid)

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

## 📋 APPLICATIONS ENDPOINTS

### POST /api/applications
Submit application (from /apply form)

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "interested_in": "buy|rent|sell",
  "budget_max": 500000,
  "message": "I'm interested..."
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "interest_type": "buy",
    "budget": 500000,
    "message": "I'm interested...",
    "created_at": "2024-12-10T..."
  }
}
```

### GET /api/applications
Get all applications (Admin only)

**Headers:** 
- `Authorization: Bearer {admin_token}` (TODO: Implement auth check)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of applications */ ]
}
```

---

## 👤 AGENTS ENDPOINTS

### GET /api/agents
Get all agents

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Sarah Johnson",
      "email": "sarah@choiceproperties.com",
      "phone": "(555) 123-4567",
      "about": "12+ years experience...",
      "specialties": "Residential,Luxury Homes",
      "photo": "url",
      "created_at": "2024-12-10T..."
    }
  ]
}
```

### GET /api/agents/:id
Get single agent

**URL Params:** `id` (uuid)

**Response:**
```json
{
  "success": true,
  "data": { /* agent object */ }
}
```

### POST /api/agents
Create agent (Admin only)

**Headers:**
- `Authorization: Bearer {admin_token}` (TODO: Implement auth check)

**Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@choiceproperties.com",
  "phone": "(555) 123-4567",
  "about": "12+ years experience",
  "specialties": "Residential,Luxury Homes",
  "photo": "url"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Agent created successfully",
  "data": { /* created agent */ }
}
```

---

## 💬 CONTACT ENDPOINTS

### POST /api/contact
Submit contact form

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "message": "I have a question..."
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "message": "I have a question...",
    "created_at": "2024-12-10T..."
  }
}
```

---

## 🔐 Error Responses

All endpoints return error responses in this format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## 🔐 Authentication Notes

TODO: Implement authentication middleware for:
- `GET /api/applications` - Admin only
- `POST /api/agents` - Admin only

Current implementation has TODO comments at these endpoints.

---

## 🗄️ Database Tables

See `backend/supabase_tables.sql` for complete schema.

**Main Tables:**
- `properties` - Property listings
- `applications` - User applications
- `agents` - Real estate agents
- `contact_forms` - Contact submissions
- `users` - User accounts
- `appointments` - Scheduled appointments

---

## 🧪 Testing Endpoints

### Test Properties
```bash
curl -X GET http://localhost:8000/api/properties

curl -X POST http://localhost:8000/api/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","address":"123 St","city":"NYC","state":"NY","zip":"10001","price":500000,"beds":3,"baths":2,"sqft":2000,"contact_phone":"555-1234","contact_email":"test@test.com"}'
```

### Test Applications
```bash
curl -X POST http://localhost:8000/api/applications \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","phone":"555-1234","interested_in":"buy","budget_max":500000,"message":"Interested"}'
```

### Test Agents
```bash
curl -X GET http://localhost:8000/api/agents
```

### Test Contact
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","phone":"555-1234","message":"Hello"}'
```
