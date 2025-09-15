# ProjectHejer - Customer & Lead Image Upload Feature

## Overview
This project implements a comprehensive Customer and Lead management system with image upload functionality. The backend is built with .NET 8 Web API and SQLite, while the frontend uses Angular 14.

## Features

### Backend (C# .NET 8)
- **Database Models**: Customer, Lead, CustomerImage, and LeadImage entities
- **SQLite Database**: Lightweight database with Entity Framework Core
- **Image Storage**: Base64-encoded images stored directly in the database
- **Upload Limits**: Maximum of 10 images per customer/lead profile
- **RESTful API**: Complete CRUD operations for customers, leads, and images
- **Smart Validation**: Prevents exceeding the 10-image limit with clear error messages

### Frontend (Angular 14)
- **Responsive UI**: Clean, modern interface for managing customers and leads
- **Image Gallery**: Interactive gallery with modal view for images
- **Drag & Drop**: File upload with preview functionality
- **Real-time Updates**: Live image count and remaining slots display
- **Form Validation**: Client-side validation for all forms

## API Endpoints

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/{id}/images` - Get customer images
- `POST /api/customers/{id}/images` - Upload images to customer
- `DELETE /api/customers/{id}/images/{imageId}` - Delete customer image

### Leads
- `GET /api/leads` - List all leads
- `GET /api/leads/{id}` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead
- `GET /api/leads/{id}/images` - Get lead images
- `POST /api/leads/{id}/images` - Upload images to lead
- `DELETE /api/leads/{id}/images/{imageId}` - Delete lead image

## Installation & Setup

### Prerequisites
- .NET 8 SDK
- Node.js (v16 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup
1. Navigate to the server project:
   ```bash
   cd ProjectHejer.Server
   ```

2. Install required NuGet packages:
   ```bash
   dotnet add package Microsoft.EntityFrameworkCore.Sqlite
   dotnet add package Microsoft.EntityFrameworkCore.Design
   ```

3. Build and run the server:
   ```bash
   dotnet build
   dotnet run
   ```

The API will be available at `https://localhost:5001` (or as configured in launchSettings.json).

### Frontend Setup
1. Navigate to the client project:
   ```bash
   cd projecthejer.client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The Angular app will be available at `https://localhost:57043`.

## Database Schema

### Customer Table
- Id (int, PK)
- Name (string, required)
- Email (string, optional)
- Phone (string, optional)
- Address (string, optional)
- CreatedDate (datetime)

### Lead Table
- Id (int, PK)
- Name (string, required)
- Email (string, optional)
- Phone (string, optional)
- Company (string, optional)
- Source (string, optional)
- Status (string, default: "New")
- CreatedDate (datetime)

### CustomerImage Table
- Id (int, PK)
- CustomerId (int, FK)
- ImageData (string, Base64 encoded)
- FileName (string, optional)
- ContentType (string, optional)
- FileSize (long)
- UploadedDate (datetime)

### LeadImage Table
- Id (int, PK)
- LeadId (int, FK)
- ImageData (string, Base64 encoded)
- FileName (string, optional)
- ContentType (string, optional)
- FileSize (long)
- UploadedDate (datetime)

## Key Implementation Details

### Image Upload Limits
The system enforces a maximum of 10 images per customer/lead through:
- Database constraints
- API validation before upload
- Frontend validation with real-time slot counting
- Clear error messages when limits are exceeded

### Base64 Storage
Images are converted to Base64 strings and stored directly in the SQLite database:
- **Pros**: Simple implementation, no file system management, easy backup
- **Cons**: Larger database size, potential memory usage for large images
- **Recommendation**: For production, consider blob storage for larger scale

### Error Handling
Comprehensive error handling includes:
- Invalid Base64 validation
- File type validation
- Upload limit enforcement
- Database constraint violations
- Network error handling

### Security Considerations
- Input validation on all endpoints
- File type restrictions (images only)
- SQL injection prevention through Entity Framework
- CORS configuration for development

## Usage Guide

### Creating Customers/Leads
1. Click "Add Customer" or "Add Lead" button
2. Fill in the required information
3. Submit the form

### Uploading Images
1. Select a customer or lead
2. Click "Show Images"
3. Use the file input to select images (up to remaining slots)
4. Click "Upload Images"
5. Images appear in the gallery immediately

### Viewing Images
1. Click on any thumbnail in the gallery
2. Image opens in a modal with full size view
3. View file details (name, size, upload date)
4. Click outside modal or 'X' to close

### Deleting Images
1. Click "Delete" button on any image in the gallery
2. Confirm deletion
3. Image is removed and slot becomes available

## Future Enhancements

### Backend
- Add image compression before Base64 conversion
- Implement blob storage (Azure, AWS S3) for production
- Add image metadata extraction (dimensions, EXIF data)
- Implement image resizing/thumbnails
- Add audit logging for image operations

### Frontend
- Add drag-and-drop upload functionality
- Implement image carousel navigation
- Add image cropping/editing tools
- Include image zoom functionality
- Add bulk image operations

### Performance
- Implement lazy loading for images
- Add pagination for large image collections
- Optimize Base64 encoding/decoding
- Add caching strategies

## Technology Choices

### Backend: .NET 8 Web API
- **Why**: Modern, performant, excellent tooling, strong typing
- **Benefits**: Built-in dependency injection, Entity Framework, excellent debugging

### Database: SQLite
- **Why**: Lightweight, serverless, perfect for development and small-medium applications
- **Benefits**: Zero configuration, file-based, excellent for prototyping

### Frontend: Angular 14
- **Why**: Full-featured framework, excellent for complex applications
- **Benefits**: TypeScript support, dependency injection, powerful CLI

### Base64 Image Storage
- **Why**: Simplicity for this demo/prototype
- **Considerations**: For production, consider dedicated image storage services

## License
This project is for demonstration purposes. Modify and use as needed for your requirements.