# 🍽️ OASIS Restaurant - Table Booking Web Application

A modern, responsive restaurant table booking web application built with Next.js, TypeScript, and Tailwind CSS. OASIS provides an elegant dining experience with seamless table reservations, user profiles, and a beautiful UI.

## ✨ Features

### 🏠 **Home Page**
- **Hero Section**: Eye-catching landing page with animated content
- **Why Choose Us**: Showcases restaurant highlights with smooth animations
- **Interactive Elements**: GSAP animations for enhanced user experience
- **Responsive Design**: Optimized for all device sizes

### 📅 **Table Booking System**
- **Smart Date Selection**: 7-day rolling calendar with availability
- **Time Slot Management**: 15-minute intervals with smart filtering
- **Guest Count**: Flexible party size selection (1-10+ guests)
- **Real-time Validation**: Prevents booking in the past
- **Mobile-First Design**: Optimized booking flow for mobile users

### 🔐 **Authentication System**
- **OTP-based Login**: Secure mobile number verification
- **Static Demo Mode**: Uses dummy data with static OTP (676767)
- **Session Management**: Local storage for persistent login
- **Demo Accounts**: Pre-configured test accounts for development

### 👤 **User Profile Management**
- **Profile Information**: Name, gender, date of birth, phone number
- **Edit Profile**: In-place editing with form validation
- **Reservation History**: View all past and current bookings
- **Reservation Management**: Cancel confirmed reservations
- **Filter Options**: All, Confirmed, Cancelled reservations

### 🍽️ **Menu & Content Pages**
- **About Page**: Restaurant story and information
- **Menu Page**: Elegant menu display with categories
- **Contact Page**: Location, email, and social media links
- **Responsive Navigation**: Smooth mobile navigation

### 🎨 **UI/UX Features**
- **Modern Design**: Clean, elegant interface with custom styling
- **Dark/Light Themes**: Adaptive color schemes
- **Smooth Animations**: GSAP-powered scroll animations
- **Loading States**: Professional loading indicators
- **Toast Notifications**: User feedback for actions
- **Mobile Responsive**: Optimized for all screen sizes

## 🚀 Demo Accounts

For testing purposes, the application includes demo accounts:

| Phone Number | Name | OTP |
|--------------|------|-----|
| `1234567890` | John Doe | `676767` |
| `9876543210` | Jane Smith | `676767` |
| `5555555555` | Mike Johnson | `676767` |

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 15.3.2**: React framework with App Router
- **React 19.0.0**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development

### **Styling & UI**
- **Tailwind CSS 4**: Utility-first CSS framework
- **Custom CSS**: Additional styling for components
- **GSAP**: Professional animations and transitions
- **React Icons**: Beautiful icon library

### **Development Tools**
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Next.js Config**: Image optimization and domain configuration

### **Dependencies**
```json
{
  "aos": "^2.3.4",           // Animate On Scroll
  "gsap": "^3.13.0",         // GreenSock Animation Platform
  "react-icons": "^5.5.0",   // Icon library
  "react-router-dom": "^7.6.0" // Client-side routing
}
```

## 📁 Project Structure

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
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── menu/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── Assets/
│   │   │   └── logo.png
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── admin-utils.ts
│       └── admins.json
├── public/
│   └── logo.png
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OASIS
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
The application uses dummy data by default. For production, you can configure:

```env
NEXT_PUBLIC_API_BASE_URL=your-api-endpoint
```

### Image Domains
Configured in `next.config.ts`:
- `images.unsplash.com` - Stock photos
- `www.indianhealthyrecipes.com` - Food images

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 Key Components

### **BookingForm.tsx**
- Handles table reservation logic
- Date and time slot management
- Guest count selection
- OTP authentication integration

### **Profile Page**
- User profile management
- Reservation history
- Edit profile functionality
- Reservation cancellation

### **NavBar.tsx**
- Responsive navigation
- Booking form trigger
- Profile access
- Mobile menu

### **HomeScreen.tsx**
- Hero section with animations
- Why choose us section
- GSAP scroll animations
- Call-to-action buttons

## 🔒 Security Features

- **OTP Authentication**: Secure mobile verification
- **Input Validation**: Form validation and sanitization
- **Session Management**: Secure token storage
- **Demo Mode**: Safe testing environment

## 🎨 Design System

### **Color Palette**
- Primary: `#2EFFFF` (Cyan)
- Secondary: `#bfa76f` (Gold)
- Background: `#1a1a1a` (Dark)
- Text: `#ffffff` (White)

### **Typography**
- **Fonts**: Geist Sans, Geist Mono
- **Headings**: Serif fonts for elegance
- **Body**: Sans-serif for readability

### **Animations**
- **GSAP**: Professional scroll animations
- **CSS Transitions**: Smooth hover effects
- **Loading States**: Professional feedback

## 🧪 Testing

### Manual Testing
1. **Booking Flow**: Test table reservation process
2. **Authentication**: Test OTP login with demo accounts
3. **Profile Management**: Test profile editing and reservation management
4. **Responsive Design**: Test on different screen sizes

### Demo Data
The application includes comprehensive dummy data for testing:
- 3 demo user accounts
- 4 sample reservations
- Static OTP for authentication

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: Next.js, React, TypeScript
- **UI/UX Design**: Tailwind CSS, GSAP Animations
- **Backend Integration**: API-ready architecture
- **Testing**: Comprehensive demo data and testing flows

## 📞 Support

For support and questions:
- **Email**: hello@sample.com
- **Location**: Coimbatore, Tamil Nadu
- **Instagram**: [@oasisrestaurantofficial](https://www.instagram.com/oasisrestaurantofficial)

---

**OASIS Restaurant** - Where every bite brings you closer to delicious! 🍽️✨
