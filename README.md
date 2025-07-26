# 🍽️ OASIS Restaurant - Complete Web Application Suite

A comprehensive restaurant management system consisting of two interconnected applications: a customer-facing table booking platform and an admin management dashboard. Built with Next.js, TypeScript, and modern web technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Applications](#applications)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

OASIS Restaurant is a complete digital solution for restaurant management, featuring:

- **Customer Application**: Modern, responsive web app for table reservations
- **Admin Dashboard**: Comprehensive management interface for restaurant staff
- **OTP Authentication**: Secure mobile-based authentication system
- **Real-time Management**: Live reservation and customer management
- **Responsive Design**: Optimized for all devices and screen sizes

## 🏗️ Architecture

```
Oasis_WebApplication_V0/
├── OASIS/                    # Customer-facing application
│   ├── src/app/             # Next.js App Router
│   ├── src/lib/             # Utilities and data
│   └── public/              # Static assets
└── admin-management/         # Admin dashboard application
    ├── app/                 # Next.js App Router
    ├── components/          # Reusable UI components
    └── lib/                 # Utilities and data
```

## 📱 Applications

### 🍽️ **OASIS Customer Application**

**Purpose**: Customer-facing table booking platform

**Key Features**:
- Table reservation system
- User profile management
- Menu browsing
- Contact information
- OTP-based authentication

**Pages**:
- Home (Hero section with animations)
- About (Restaurant information)
- Menu (Food items and categories)
- Contact (Location and social media)
- Profile (User dashboard and reservations)

### 🔧 **Admin Management Dashboard**

**Purpose**: Restaurant staff management interface

**Key Features**:
- Reservation management
- Customer data management
- Admin authentication
- Real-time updates
- Analytics and reporting

**Pages**:
- Login (OTP authentication)
- Dashboard (Overview and navigation)
- Reservations (Manage bookings)
- Customers (User management)

## ✨ Features

### 🔐 **Authentication System**
- **OTP-based Login**: Secure mobile number verification
- **Static Demo Mode**: Uses dummy data with static OTP (676767)
- **Session Management**: Local storage and cookies for persistence
- **Role-based Access**: Different admin roles and permissions

### 📅 **Table Booking System**
- **Smart Date Selection**: 7-day rolling calendar
- **Time Slot Management**: 15-minute intervals
- **Guest Count**: Flexible party size selection
- **Real-time Validation**: Prevents past bookings
- **Mobile-First Design**: Optimized booking flow

### 👤 **User Management**
- **Profile Management**: Complete user profiles
- **Reservation History**: Past and current bookings
- **Edit Functionality**: In-place profile editing
- **Reservation Cancellation**: User and admin controls

### 🎨 **UI/UX Features**
- **Modern Design**: Clean, elegant interfaces
- **Smooth Animations**: GSAP-powered transitions
- **Loading States**: Professional feedback
- **Toast Notifications**: User action feedback
- **Responsive Design**: All screen sizes supported

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 15.x**: React framework with App Router
- **React 18/19**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development

### **Styling & UI**
- **Tailwind CSS 3/4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **GSAP**: Professional animations
- **React Icons**: Beautiful icon library
- **Lucide React**: Modern icon set

### **State Management & Forms**
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **Local Storage**: Client-side data persistence
- **Cookies**: Session management

### **Development Tools**
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **TypeScript**: Type checking
- **Next.js Config**: Image optimization

### **Dependencies Comparison**

| Feature | OASIS (Customer) | Admin Management |
|---------|------------------|------------------|
| **Next.js** | 15.3.2 | 15.2.4 |
| **React** | 19.0.0 | 18.2.0 |
| **Tailwind** | 4.x | 3.4.17 |
| **UI Library** | Custom + React Icons | Radix UI + Lucide |
| **Animations** | GSAP | Tailwind Animate |
| **Forms** | Custom | React Hook Form + Zod |

## 📁 Project Structure

### **OASIS Customer Application**
```
OASIS/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── button.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── MobilePopup.tsx
│   │   │   ├── NavBar.tsx
│   │   │   └── OtpPopup.tsx
│   │   ├── about/
│   │   ├── contact/
│   │   ├── menu/
│   │   ├── profile/
│   │   ├── Assets/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── admin-utils.ts
│       └── admins.json
├── public/
├── package.json
└── README.md
```

### **Admin Management Application**
```
admin-management/
├── app/
│   ├── api/
│   │   └── admin/
│   ├── dashboard/
│   │   ├── customers/
│   │   ├── reservations/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── admin-sidebar.tsx
│   ├── login-form.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── reservations.json
│   ├── userdata.json
│   └── utils.ts
├── hooks/
├── middleware.ts
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Git

### Installation

#### **1. Clone the Repository**
```bash
git clone <repository-url>
cd Oasis_WebApplication_V0
```

#### **2. Install Dependencies**

**For OASIS Customer App:**
```bash
cd OASIS
npm install
```

**For Admin Management:**
```bash
cd admin-management
npm install
```

#### **3. Run Development Servers**

**OASIS Customer App:**
```bash
cd OASIS
npm run dev
# Access at http://localhost:3000
```

**Admin Management:**
```bash
cd admin-management
npm run dev
# Access at http://localhost:3001 (or next available port)
```

#### **4. Build for Production**
```bash
# For each application
npm run build
npm start
```

## 🧪 Demo Accounts

### **Customer Application (OASIS)**
| Phone Number | Name | OTP |
|--------------|------|-----|
| `1234567890` | John Doe | `676767` |
| `9876543210` | Jane Smith | `676767` |
| `5555555555` | Mike Johnson | `676767` |

### **Admin Management**
| Mobile Number | Name | Role | OTP |
|---------------|------|------|-----|
| `1234567890` | Admin User | admin | `676767` |
| `9876543210` | Manager Admin | admin | `676767` |
| `5555555555` | Super Admin | super_admin | `676767` |

## 🔧 Configuration

### **Environment Variables**

**OASIS Customer App:**
```env
NEXT_PUBLIC_API_BASE_URL=your-api-endpoint
```

**Admin Management:**
```env
NEXT_PUBLIC_API_URL=your-api-endpoint
```

### **Image Domains**
Configured in respective `next.config` files:
- `images.unsplash.com` - Stock photos
- `www.indianhealthyrecipes.com` - Food images

## 📱 Responsive Design

Both applications are fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 Key Components

### **Customer Application**
- **BookingForm.tsx**: Table reservation logic
- **Profile Page**: User management and reservations
- **NavBar.tsx**: Responsive navigation
- **HomeScreen.tsx**: Hero section with animations

### **Admin Management**
- **LoginForm.tsx**: OTP authentication
- **Admin Sidebar**: Navigation and user info
- **Reservations Page**: Booking management
- **Customers Page**: User data management

## 🔒 Security Features

- **OTP Authentication**: Secure mobile verification
- **Input Validation**: Form validation and sanitization
- **Session Management**: Secure token storage
- **Demo Mode**: Safe testing environment
- **Role-based Access**: Admin permission levels

## 🎨 Design System

### **Color Palette**
- **Primary**: `#2EFFFF` (Cyan)
- **Secondary**: `#bfa76f` (Gold)
- **Background**: `#1a1a1a` (Dark)
- **Text**: `#ffffff` (White)

### **Typography**
- **Fonts**: Geist Sans, Geist Mono
- **Headings**: Serif fonts for elegance
- **Body**: Sans-serif for readability

### **Animations**
- **GSAP**: Professional scroll animations
- **CSS Transitions**: Smooth hover effects
- **Loading States**: Professional feedback

## 🧪 Testing

### **Manual Testing Checklist**

#### **Customer Application**
1. **Booking Flow**: Test table reservation process
2. **Authentication**: Test OTP login with demo accounts
3. **Profile Management**: Test profile editing and reservation management
4. **Responsive Design**: Test on different screen sizes
5. **Navigation**: Test all pages and links

#### **Admin Management**
1. **Login Flow**: Test OTP authentication
2. **Dashboard Navigation**: Test sidebar and routing
3. **Reservation Management**: Test booking operations
4. **Customer Management**: Test user data operations
5. **Responsive Design**: Test on different screen sizes

### **Demo Data**
Both applications include comprehensive dummy data:
- Demo user accounts with mobile numbers
- Sample reservations with different statuses
- Static OTP for authentication testing

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Deploy each application separately
npm run build
vercel --prod
```

### **Other Platforms**
Both applications can be deployed to:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform
- VPS with Node.js

### **Environment Setup**
1. Set environment variables
2. Configure image domains
3. Set up database connections (if applicable)
4. Configure authentication providers

## 🔄 API Integration

### **Current Status**
- **Demo Mode**: Both applications use dummy data
- **API Ready**: Architecture supports real API integration
- **Postman Collection**: Included for API testing

### **Integration Points**
- User authentication
- Reservation management
- Customer data
- Admin operations

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes in the appropriate application directory
4. Test thoroughly with demo accounts
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use consistent formatting with ESLint
- Write meaningful commit messages
- Test on multiple devices and browsers
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: Next.js, React, TypeScript
- **UI/UX Design**: Tailwind CSS, Radix UI, GSAP Animations
- **Backend Integration**: API-ready architecture
- **Testing**: Comprehensive demo data and testing flows

## 📞 Support

For support and questions:
- **Email**: hello@sample.com
- **Location**: Coimbatore, Tamil Nadu
- **Instagram**: [@oasisrestaurantofficial](https://www.instagram.com/oasisrestaurantofficial)

## 🔮 Future Enhancements

### **Planned Features**
- Real-time notifications
- Payment integration
- Advanced analytics
- Multi-language support
- Mobile applications
- Integration with POS systems

### **Technical Improvements**
- Performance optimization
- Enhanced security
- Better error handling
- Automated testing
- CI/CD pipeline

---

**LiveSite URLS :** 

Admin Panel : https://oasisadminmanagement.vercel.app/
client Site : https://restaurantmanagement-jet.vercel.app/