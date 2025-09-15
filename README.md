# ProjectHejer - Customer & Lead Management System

A comprehensive Customer and Lead management system with image upload functionality built with .NET 8 Web API and Angular 14.

## ?? Features

### Backend (.NET 8 Web API)
- **Customer Management**: Full CRUD operations for customer records
- **Lead Management**: Complete lead tracking with status management
- **Image Storage**: Up to 10 Base64-encoded images per customer/lead
- **Smart Validation**: Enforced 10-image limit with clear error messages
- **SQLite Database**: Lightweight, file-based database perfect for development
- **RESTful API**: Clean, well-documented API endpoints
- **Entity Framework**: Code-first database approach with automatic migrations

### Frontend (Angular 14)
- **Responsive Design**: Modern, mobile-friendly interface
- **Tabbed Interface**: Easy switching between Customers and Leads
- **Image Gallery**: Interactive gallery with modal view for full-size images
- **Real-time Updates**: Live image count and remaining slots display
- **Form Validation**: Client-side validation with user-friendly feedback
- **File Upload**: Support for multiple image formats with size validation
- **Configurable API**: Environment-based API URL configuration

## ?? Getting Started

### Prerequisites
- **.NET 8 SDK** or later
- **Node.js** (v16 or higher)
- **Angular CLI** (`npm install -g @angular/cli`)

### Backend Setup
1. **Navigate to the server project:**cd ProjectHejer.Server
2. **Restore packages:**dotnet restore
3. **Run the server:**dotnet run   The API will be available at `https://localhost:7064` with Swagger documentation at `https://localhost:7064/swagger`.

### Frontend Setup

#### ?? **API Configuration (IMPORTANT)**
Before running the frontend, you may need to update the API URL configuration:

1. **For Development**: Edit `projecthejer.client/src/environments/environment.ts`export const environment = {
  production: false,
  apiUrl: 'https://localhost:7064/api', // Update this if your backend runs on a different port
};
2. **For Production**: Edit `projecthejer.client/src/environments/environment.prod.ts`export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api', // Update with your production API URL
   };
#### Common API URL Configurations:
- **Default Development**: `https://localhost:7064/api`
- **Alternative HTTPS**: `https://localhost:5001/api`
- **HTTP Fallback**: `http://localhost:5000/api`
- **Azure Deployment**: `https://yourapp.azurewebsites.net/api`
- **Custom Domain**: `https://api.yourapp.com/api`

#### Frontend Installation and Startup:

1. **Navigate to the client project:**cd projecthejer.client
2. **Install dependencies:**npm install
3. **Start the development server:**npm start   The Angular app will be available at `https://localhost:57043`.

## ?? Configuration Management

### API URL Configuration
The application now uses environment-based configuration instead of hardcoded URLs:

- **Development Environment**: `src/environments/environment.ts`
- **Production Environment**: `src/environments/environment.prod.ts`
- **Configuration Service**: `src/app/services/config.service.ts` (centralized config management)

### Updating API URLs
If your backend server runs on a different port or domain:

1. **Check your backend server's actual URL** in the console output when running `dotnet run`
2. **Update the environment file** with the correct URL
3. **Restart the Angular development server** for changes to take effect

### Environment Variables
The proxy configuration in `proxy.conf.js` automatically detects the backend port from environment variables, but the Angular services now use the environment configuration for API calls.

## ?? Usage Guide

### Managing Customers
1. **Add Customer**: Click "Add Customer" button and fill in the required information
2. **View Images**: Click "Manage Images" to expand the image gallery
3. **Upload Images**: Select files using the file input (up to 10 images)
4. **View Full Image**: Click any thumbnail to open in modal view
5. **Delete Images**: Click the delete button on any image
6. **Delete Customer**: Remove customer and all associated images

### Managing Leads
1. **Add Lead**: Click "Add Lead" button and fill in the details
2. **Set Status**: Choose from New, Contacted, Qualified, Converted, or Lost
3. **Track Progress**: Visual status indicators help track lead progression
4. **Manage Images**: Same image functionality as customers

### Image Management
- **Upload Limit**: Maximum 10 images per customer/lead
- **File Types**: Supports all common image formats (JPG, PNG, GIF, etc.)
- **File Size**: 5MB maximum per image
- **Storage**: Images stored as Base64 strings in SQLite database
- **Display**: Responsive grid layout with hover effects

## ??? Architecture

### Database Schema
- **Customers**: ID, Name, Email, Phone, Address, CreatedDate
- **Leads**: ID, Name, Email, Phone, Company, Source, Status, CreatedDate
- **CustomerImages**: ID, CustomerId, ImageData (Base64), FileName, ContentType, FileSize, UploadedDate
- **LeadImages**: ID, LeadId, ImageData (Base64), FileName, ContentType, FileSize, UploadedDate

### API Endpoints

#### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/{id}/images` - Get customer images
- `POST /api/customers/{id}/images` - Upload images
- `DELETE /api/customers/{id}/images/{imageId}` - Delete image

#### Leads
- `GET /api/leads` - List all leads
- `GET /api/leads/{id}` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead
- `GET /api/leads/{id}/images` - Get lead images
- `POST /api/leads/{id}/images` - Upload images
- `DELETE /api/leads/{id}/images/{imageId}` - Delete image

## ??? Security & Validation

- **Input Validation**: Server-side validation for all inputs
- **File Type Restrictions**: Only image files accepted
- **Size Limits**: 5MB per image, 10 images per entity
- **Error Handling**: Comprehensive error messages
- **CORS Configuration**: Properly configured for development
- **Environment-based URLs**: Secure configuration management

## ?? UI/UX Features

- **Clean Design**: Modern, professional interface
- **Responsive Layout**: Works on desktop and mobile devices
- **Intuitive Navigation**: Clear visual hierarchy and user flows
- **Real-time Feedback**: Immediate validation and error messages
- **Loading States**: Visual feedback during operations
- **Confirmation Dialogs**: Prevent accidental deletions
- **Toast Notifications**: Professional notification system

## ?? Development

### Project StructureProjectHejer/
??? ProjectHejer.Server/          # .NET 8 Web API
?   ??? Controllers/              # API Controllers
?   ??? Models/                   # Entity Models
?   ??? DTOs/                     # Data Transfer Objects
?   ??? Data/                     # Database Context
?   ??? Program.cs                # Application Entry Point
??? projecthejer.client/          # Angular 14 Frontend
?   ??? src/app/
?   ?   ??? components/           # Angular Components
?   ?   ??? services/             # API Services
?   ?   ??? environments/         # Environment Configuration
?   ?   ??? app.module.ts         # App Module
?   ??? src/proxy.conf.js         # Development Proxy
??? README.md                     # This file
### Key Technologies
- **Backend**: .NET 8, Entity Framework Core, SQLite, Swagger
- **Frontend**: Angular 14, TypeScript, RxJS, Angular Forms
- **Styling**: CSS3 with Flexbox and Grid layouts
- **Build Tools**: Angular CLI, .NET CLI

## ?? Dependencies

### Backend NuGet Packages
- `Microsoft.EntityFrameworkCore.Sqlite` - SQLite database support
- `Microsoft.EntityFrameworkCore.Design` - EF Core design-time tools
- `Swashbuckle.AspNetCore` - Swagger/OpenAPI documentation

### Frontend NPM Packages
- `@angular/core` - Angular framework
- `@angular/common` - Common Angular utilities
- `@angular/forms` - Reactive forms
- `rxjs` - Reactive programming

## ?? Features Implemented

### ? Core Requirements
- Customer and Lead CRUD operations
- Image upload with Base64 storage
- 10-image limit enforcement
- SQLite database integration
- RESTful API design
- **Configurable API URLs** (NEW)

### ? Bonus Features
- Responsive image gallery
- Modal image viewer
- Real-time validation
- Status tracking for leads
- Professional UI/UX design
- Error handling and user feedback
- **Environment-based configuration** (NEW)
- **Centralized configuration service** (NEW)

## ?? Future Enhancements

### Potential Improvements
- **Cloud Storage**: Move images to Azure Blob Storage or AWS S3
- **Image Processing**: Add compression and thumbnail generation
- **Search & Filter**: Add search functionality for customers/leads
- **Export Features**: PDF/Excel export capabilities
- **User Authentication**: Add login and user management
- **Audit Logging**: Track all user actions
- **Advanced Analytics**: Dashboard with charts and metrics

### Performance Optimizations
- **Lazy Loading**: Load images on demand
- **Pagination**: Handle large datasets efficiently
- **Caching**: Implement client-side caching
- **Compression**: Optimize image storage

## ?? Troubleshooting

### Common Issues

1. **"Cannot connect to server" error**:
   - Check if the backend server is running (`dotnet run` in ProjectHejer.Server)
   - Verify the API URL in your environment configuration
   - Check console for the actual backend URL

2. **API endpoints not found**:
   - Ensure the backend server is running on the correct port
   - Update `apiUrl` in the environment files to match your backend URL
   - Check that the proxy configuration is working

3. **CORS errors**:
   - Verify the frontend is running on `https://localhost:57043`
   - Check CORS configuration in the backend `Program.cs`

## ?? License

This project is for demonstration purposes. Modify and use as needed for your requirements.

## ?? Contributing

This is a complete, working application ready for use or further development. The codebase is clean, well-structured, and follows best practices for both .NET and Angular development.