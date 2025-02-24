# User Routes API Documentation

## Base URL
```
https://heliverse-assingment-1.onrender.com/api/v1/users
```

---

## Authentication
Most endpoints require authentication using a Bearer Token. Ensure you include the `Authorization` header:
```
Authorization: Bearer <your_access_token>
```

---

## Endpoints

### 1. **User Registration**
**Endpoint:**
```
POST /register
```
**Description:** Registers a new user.
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "1234567890",
  "role": "customer"
}
```
**Response:**
```json
{
  "status": 201,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "customer",
    "accessToken": "token"
  },
  "message": "User registered successfully"
}
```

---

### 2. **User Login**
**Endpoint:**
```
POST /login
```
**Description:** Authenticates user and returns access and refresh tokens.
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "status": 200,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "1234567890",
    "accessToken": "token"
  },
  "message": "Login successful"
}
```

---

### 3. **User Logout**
**Endpoint:**
```
POST /logout
```
**Description:** Logs out the user and clears refresh tokens.
**Headers:**
```
Authorization: Bearer <your_access_token>
```
**Response:**
```json
{
  "status": 200,
  "data": {},
  "message": "User logged out"
}
```

---

### 4. **Browse Listings**
**Endpoint:**
```
GET /listings
```
**Description:** Fetches available listings based on filters.
**Query Parameters (optional):**
- `location`: City name
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `rating`: Minimum rating
- `amenities`: Comma-separated list of amenities
- `type`: Listing type

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "_id": "listing_id",
      "name": "Luxury Apartment",
      "location": "New York",
      "pricing": 1200,
      "facilities": "WiFi,Pool",
      "rating": 4.5
    }
  ],
  "message": "Listings retrieved successfully"
}
```

---

### 5. **View Listing Details**
**Endpoint:**
```
GET /listings/:listingId
```
**Description:** Retrieves details of a specific listing.
**Response:**
```json
{
  "status": 200,
  "data": {
    "_id": "listing_id",
    "name": "Luxury Apartment",
    "description": "Spacious apartment with great amenities",
    "address": "123 Main St, New York",
    "pricing": 1200,
    "facilities": "WiFi,Pool",
    "vendorDetails": {
      "name": "Vendor Name",
      "phone": "1234567890",
      "email": "vendor@example.com"
    },
    "unitDetails": [
      {
        "_id": "unit_id",
        "type": "Studio",
        "capacity": 2,
        "price": 1200,
        "availability": true
      }
    ]
  },
  "message": "Listing details retrieved successfully"
}
```

---

### 6. **Book a Listing Unit**
**Endpoint:**
```
POST /bookings/:listingId/:unitId
```
**Description:** Books a unit in a listing.
**Headers:**
```
Authorization: Bearer <your_access_token>
```
**Request Body:**
```json
{
  "bookingDate": "2025-03-10",
  "bookingTime": "12:00 PM",
  "vendorId": "vendor_id"
}
```
**Response:**
```json
{
  "status": 201,
  "data": {
    "_id": "booking_id",
    "status": "Pending"
  },
  "message": "Booking successful, pending approval"
}
```

---

### 7. **Booking History**
**Endpoint:**
```
GET /bookings/history
```
**Description:** Retrieves the user's booking history.
**Headers:**
```
Authorization: Bearer <your_access_token>
```
**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "_id": "booking_id",
      "listingId": "listing_id",
      "unitId": "unit_id",
      "bookingDate": "2025-03-10",
      "bookingTime": "12:00 PM",
      "status": "Confirmed"
    }
  ],
  "message": "Booking history retrieved successfully"
}
```

---

### 8. **Write a Review**
**Endpoint:**
```
POST /reviews/:bookingId
```
**Description:** Submits a review for a completed booking.
**Headers:**
```
Authorization: Bearer <your_access_token>
```
**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service!"
}
```
**Response:**
```json
{
  "status": 201,
  "data": {
    "_id": "review_id",
    "rating": 5,
    "comment": "Excellent service!"
  },
  "message": "Review submitted successfully"
}
```

---

## Notes
- Ensure to include the `Authorization` token for protected routes.
- Listings and booking details are retrieved dynamically.
- Booking status may be `Pending`, `Confirmed`, or `Completed`.
- Reviews can only be written after the service has been used.

For any issues or support, contact the development team. 🚀
# Vendor API Documentation

## Overview
This API provides endpoints for vendors to manage their listings, units, bookings, and analytics. Vendors can add, update, and delete listings and units, view and update bookings, and retrieve analytics.
## Base URL
```
https://heliverse-assingment-1.onrender.com/api/v1/users
```

---
## Authentication
All routes require authentication with a valid token.

## Endpoints

### 1. Add a New Listing
**Endpoint:** `POST /api/v1/vendors/`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Hotel ABC",
  "address": "123 Main St",
  "description": "Luxury hotel with great amenities",
  "facilities": "WiFi,Parking,Pool",
  "pricing": 100,
  "type": "Hotel"
}
```

**Response:**
```json
{
  "status": 201,
  "data": { ... },
  "message": "added"
}
```

---

### 2. Update a Listing
**Endpoint:** `PATCH /:listingId`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:** *(Optional fields for update)*
```json
{
  "name": "Updated Name",
  "address": "Updated Address",
  "pricing": 120
}
```

**Response:**
```json
{
  "status": 200,
  "data": { ... },
  "message": "updated"
}
```

---

### 3. Delete a Listing
**Endpoint:** `DELETE /:listingId`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": 200,
  "message": "Listing deleted successfully"
}
```

---

### 4. Get Vendor Bookings
**Endpoint:** `GET /bookings`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": 200,
  "data": [...],
  "message": "Bookings retrieved successfully"
}
```

---

### 5. Update Booking Status
**Endpoint:** `PATCH /:bookingId`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "Confirmed"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Booking status updated to Confirmed"
}
```

---

### 6. Add a Unit to a Listing
**Endpoint:** `POST /unit/:listingId`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Suite Room",
  "capacity": 2,
  "price": 150
}
```

**Response:**
```json
{
  "status": 201,
  "data": { ... },
  "message": "added"
}
```

---

### 7. Update a Unit
**Endpoint:** `PATCH /unit/:unitId`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:** *(Optional fields for update)*
```json
{
  "price": 160
}
```

**Response:**
```json
{
  "success": true,
  "unit": { ... }
}
```

---

### 8. Delete a Unit
**Endpoint:** `DELETE /unit/:unitId`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Unit deleted successfully"
}
```

---

### 9. Get Vendor Analytics
**Endpoint:** `GET /analytics`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": 200,
  "data": [...],
  "message": "Analytics retrieved successfully"
}
```

## Error Handling
Errors are returned in the following format:
```json
{
  "status": <error_code>,
  "message": "Error description"
}
```

## Notes
- All routes require authentication.
- Vendors can only modify their own listings and bookings.
- Listings can have multiple units, each with its own price and capacity.



