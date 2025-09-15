# 🏢 ProjectHejer - Customer & Lead Management System

<div align="center">

![.NET](https://img.shields.io/badge/.NET-8.0-blue?style=for-the-badge&logo=dotnet)
![Angular](https://img.shields.io/badge/Angular-14-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue?style=for-the-badge&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3-green?style=for-the-badge&logo=sqlite)

*A modern, full-stack customer and lead management system with advanced image handling capabilities*

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Setup Guide](#️-setup-guide)
- [⚙️ Configuration](#️-configuration)
- [🌐 API Reference](#-api-reference)
- [📱 Usage](#-usage)
- [🐛 Troubleshooting](#-troubleshooting)

---

## 🌟 Features

### 🎯 **Core Functionality**
- **👥 Customer Management** - Complete CRUD operations with detailed profiles
- **🎯 Lead Tracking** - Advanced lead management with status progression
- **🖼️ Image Gallery** - Upload, view, and manage up to 10 images per entity
- **🔍 Full-Screen Preview** - Professional image viewing with modal overlays
- **🔎 Search & Filter** - Powerful search across all data fields

### 🎨 **User Experience**
- **📱 Responsive Design** - Mobile-first approach for all devices
- **✨ Modern UI** - Clean, professional interface with smooth animations
- **⚡ Real-time Updates** - Live feedback and instant synchronization
- **♿ Accessibility** - WCAG compliant with keyboard navigation

---

## 🚀 Quick Start

### 📋 Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v16+)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`

### ⚡ One-Minute Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ProjectHejer.git
cd ProjectHejer

# Terminal 1: Start Backend
cd ProjectHejer.Server
dotnet run

# Terminal 2: Start Frontend  
cd projecthejer.client
npm install && npm start
```

🎉 **Ready!** Open https://localhost:57043

---

## 🛠️ Step-by-Step Setup Guide

### 📁 Project Structure
```
ProjectHejer/
├── 📂 ProjectHejer.Server/          # .NET 8 Web API
│   ├── Controllers/                 # API Controllers
│   ├── Models/                      # Entity Models
│   ├── Data/                        # Database Context
│   └── Program.cs                   # Entry Point
├── 📂 projecthejer.client/          # Angular 14 Frontend
│   ├── src/app/components/          # Angular Components
│   ├── src/app/services/            # API Services
│   └── src/environments/            # Environment Config
└── README.md
```

### 🔧 Backend Setup

#### 1️⃣ Clone & Navigate
```bash
git clone https://github.com/yourusername/ProjectHejer.git
cd ProjectHejer/ProjectHejer.Server
```

#### 2️⃣ Install Dependencies
```bash
dotnet restore
```

#### 3️⃣ Run Backend
```bash
dotnet run
```

✅ **Backend Running:**
- 🔐 HTTPS: `https://localhost:7064`
- 🌐 HTTP: `http://localhost:5023`
- 📚 Swagger: `https://localhost:7064/swagger`

### 🎨 Frontend Setup

#### 1️⃣ Navigate to Client
```bash
cd ../projecthejer.client
```

#### 2️⃣ Install & Run
```bash
npm install
npm start
```

✅ **Frontend Running:**
- 🔐 HTTPS: `https://localhost:57043`
- 🌐 HTTP: `http://localhost:4200`

---

## ⚙️ Configuration

### 🚨 CRITICAL: API URL Configuration

**⚠️ You MUST update these files before running:**

#### 🔧 Development Environment
**File:** `projecthejer.client/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7064/api', // ⬅️ UPDATE THIS
};
```

#### 🌐 Production Environment
**File:** `projecthejer.client/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true, 
  apiUrl: 'https://your-production-api.com/api', // ⬅️ UPDATE THIS
};
```

### 🌐 Port Configuration

| Service | Port | Config File |
|---------|------|-------------|
| Backend HTTPS | `7064` | `launchSettings.json` |
| Backend HTTP | `5023` | `launchSettings.json` |
| Frontend HTTPS | `57043` | `angular.json` |
| Frontend HTTP | `4200` | Angular CLI default |

### 🔗 Common API URLs

| Environment | URL | Use Case |
|-------------|-----|----------|
| **Default** | `https://localhost:7064/api` | Standard setup |
| **Alt HTTPS** | `https://localhost:5001/api` | Different port |
| **HTTP** | `http://localhost:5000/api` | SSL issues |
| **Azure** | `https://yourapp.azurewebsites.net/api` | Cloud hosting |
| **Custom** | `https://api.yourapp.com/api` | Production |

---

## 🌐 API Reference

### 👥 Customers API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customers` | List all customers |
| `POST` | `/customers` | Create customer |
| `GET` | `/customers/{id}` | Get customer |
| `PUT` | `/customers/{id}` | Update customer |
| `DELETE` | `/customers/{id}` | Delete customer |
| `GET` | `/customers/{id}/images` | Get images |
| `POST` | `/customers/{id}/images` | Upload images |
| `DELETE` | `/customers/{id}/images/{imageId}` | Delete image |

### 🎯 Leads API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/leads` | List all leads |
| `POST` | `/leads` | Create lead |
| `GET` | `/leads/{id}` | Get lead |
| `PUT` | `/leads/{id}` | Update lead |
| `DELETE` | `/leads/{id}` | Delete lead |
| `GET` | `/leads/{id}/images` | Get images |
| `POST` | `/leads/{id}/images` | Upload images |
| `DELETE` | `/leads/{id}/images/{imageId}` | Delete image |

---

## 📱 Usage

### 👥 Customer Management
1. **Add Customer** - Click "Add Customer", fill required fields
2. **Manage Images** - Click "Manage Images" to open gallery
3. **Upload Images** - Drag & drop or select up to 10 images
4. **View Images** - Click thumbnails for full-screen preview
5. **Delete** - Remove customers and their images

### 🎯 Lead Management
1. **Add Lead** - Switch to Leads tab, click "Add Lead"
2. **Set Status** - Choose: New, Contacted, Qualified, Converted, Lost
3. **Track Progress** - Visual status indicators
4. **Filter** - Use status dropdown to filter leads
5. **Manage Images** - Same as customers

### 🖼️ Image Features
- **Formats**: JPG, PNG, GIF, WebP
- **Size Limit**: 5MB per image
- **Upload Limit**: 10 images per entity
- **Storage**: Base64 in SQLite database

---

## 🐛 Troubleshooting

### ❌ Common Issues

#### "Cannot connect to server"
```bash
# Check backend status
curl https://localhost:7064/api/customers

# Start backend if not running
cd ProjectHejer.Server && dotnet run
```

#### Frontend can't reach API
1. ✅ Check `environment.ts` has correct backend URL
2. 🔌 Verify backend runs on port `7064`
3. 🔗 Check CORS allows `https://localhost:57043`

#### Database issues
```bash
# Recreate database
rm projecthejer.db
dotnet run  # Auto-recreates
```

#### Port conflicts
```bash
# Windows - Find process
netstat -ano | findstr :7064
taskkill /PID <process-id> /F

# Linux/Mac - Find and kill
lsof -ti:7064 | xargs kill -9
```

### 🔧 Configuration Fixes

#### Wrong API URL
```typescript
// ❌ Incorrect
apiUrl: 'https://localhost:5001/api'

// ✅ Correct
apiUrl: 'https://localhost:7064/api'
```

#### SSL Certificate issues
```bash
# Trust certificates
dotnet dev-certs https --trust

# Angular HTTPS setup
npm run prestart
```

---

## 🏗️ Architecture

### 💾 Database Schema
- **Customers**: ID, Name, Email, Phone, Address, CreatedDate
- **Leads**: ID, Name, Email, Phone, Company, Source, Status, CreatedDate  
- **Images**: ID, EntityId, ImageData (Base64), FileName, ContentType, FileSize

### 🛠️ Technology Stack
- **Backend**: .NET 8, Entity Framework Core, SQLite, Swagger
- **Frontend**: Angular 14, TypeScript, RxJS, CSS Grid/Flexbox
- **Database**: SQLite with automatic migrations

---

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Create Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">




</div>