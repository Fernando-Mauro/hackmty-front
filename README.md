# 🍽️ Food Deal Finder - HackMTY Frontend

> A smart platform connecting students and budget-conscious individuals with real-time food promotions and AI-powered meal planning to combat food waste and reduce expenses.

<div align="center">
  <img src="public/logo.PNG" alt="Logo" width="200"/>
</div>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Social Impact](#social-impact)
- [Scalability](#scalability)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## 🎯 Overview

**Food Deal Finder** is a comprehensive web application designed to help students and individuals find the best food promotions in real-time, plan budget-friendly meals using AI, and reduce food waste. The platform combines interactive maps, AI-powered meal planning, and a community-driven promotion system to make affordable, healthy eating accessible to everyone.

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 15.5.4** - React framework with App Router and Turbopack for blazing-fast performance
- **React 19.1.0** - Latest React with improved concurrent features
- **TypeScript 5** - Type-safe development

### **Styling & UI**
- **Tailwind CSS 4** - Utility-first CSS framework with PostCSS integration
- **Radix UI** - Accessible component primitives
  - `@radix-ui/react-label`
  - `@radix-ui/react-select`
  - `@radix-ui/react-slot`
- **Framer Motion 12** - Animation library for smooth transitions
- **Lucide React** - Beautiful icon library
- **class-variance-authority** - CVA for component variants
- **tw-animate-css** - Enhanced Tailwind animations

### **Mapping & Location**
- **MapLibre GL JS 5.9.0** - Open-source map rendering
- **React Map GL 8.1.0** - React wrapper for MapLibre
- **Amazon Location Service** - Backend mapping infrastructure (AWS)

### **AI & Backend Integration**
- **AWS Amplify 6.15.7** - Cloud integration and API management
- Custom API for AI-powered meal planning and recommendations

### **Utilities**
- **jsPDF 3.0.3** - PDF generation for meal plans
- **clsx & tailwind-merge** - Conditional styling utilities

### **Code Quality**
- **Biome 2.2.0** - Fast linter and formatter (replacing ESLint + Prettier)
- **TypeScript** - Static type checking

---

## ✨ Features

### 🗺️ **Interactive Map with Real-Time Promotions**
- Live visualization of nearby restaurants and food establishments
- Real-time promotion markers with price and timing information
- User location tracking with geolocation API
- Search and filter promotions by food type (Sushi, Pizza, Healthy, etc.)
- Bottom sheet interface for detailed promotion information
- Smooth animations and transitions using Framer Motion

### 🤖 **AI-Powered Meal Planning**
- Chat-based interface for meal plan generation
- Budget-aware meal planning
- Customizable time periods (days)
- Health-level preferences
- Automatic product selection from available promotions
- Cost optimization with discount application
- PDF export functionality for meal plans
- Daily breakdown by meals (Breakfast, Lunch, Dinner)

### 🎯 **Promotion Discovery**
- "Today" section for current active promotions
- "Top Promotions" based on community votes
- Featured promotions highlighting the best deals
- Upvoting system for community-driven recommendations
- Category-based filtering

### 🔐 **Authentication & Security**
- Secure login system with token-based authentication
- Protected routes using Next.js middleware
- Cookie-based session management
- Auto-redirect based on authentication state
- Backend token verification

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-optimized drag gestures
- Adaptive layouts for all screen sizes
- Progressive Web App ready

### 🎨 **User Experience**
- Loading states and skeleton screens
- Smooth page transitions
- Error handling and user feedback
- Intuitive navigation
- Accessible components (Radix UI)

---

## 🌍 Social Impact

### **Combating Food Waste**
- **Unsold Food Reduction**: By connecting students with promotions on food nearing expiration or end-of-day deals, the platform helps restaurants sell items that would otherwise be discarded.
- **Environmental Impact**: Reducing food waste directly decreases greenhouse gas emissions from decomposing food in landfills.

### **Financial Accessibility**
- **Student Budget Support**: College students often struggle with limited budgets. This platform provides access to affordable meals, ensuring better nutrition without financial strain.
- **Community Empowerment**: The upvoting system creates a community-driven approach where users help each other find the best deals.

### **Health & Nutrition**
- **AI Meal Planning**: The meal planner considers health preferences, helping users maintain balanced diets even on tight budgets.
- **Informed Choices**: Users can see nutritional information and make better food decisions.

### **Local Business Support**
- **Increased Foot Traffic**: Restaurants gain visibility and can attract customers during slow periods.
- **Inventory Management**: Helps businesses manage inventory more efficiently by promoting items that need to be sold quickly.

### **Educational Impact**
- **Financial Literacy**: Teaches students to plan meals and manage food budgets effectively.
- **Sustainability Awareness**: Raises awareness about food waste and sustainable consumption.

---

## 📈 Scalability

### **Technical Scalability**

#### **1. Cloud-Native Architecture**
- **AWS Infrastructure**: Built on AWS services (Amplify, Location Service) for automatic scaling
- **CDN Distribution**: Static assets served through global CDN for fast loading worldwide
- **Serverless Backend**: API endpoints can scale automatically with demand

#### **2. Database Optimization**
- Efficient indexing for location-based queries
- Caching layer for frequently accessed data (promotions, places)
- Read replicas for handling increased traffic

#### **3. Frontend Performance**
- **Next.js Turbopack**: Faster builds and hot module replacement
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Lazy Loading**: Components load on-demand

#### **4. API Design**
- RESTful API architecture
- Rate limiting to prevent abuse
- API versioning for backward compatibility
- Microservices-ready structure

### **Business Scalability**

#### **1. Geographic Expansion**
```
Current: Single city/campus
Phase 1: Multiple campuses in the same region
Phase 2: State-wide expansion
Phase 3: National coverage
Phase 4: International markets
```

#### **2. User Growth Strategy**
- **Onboarding**: Simple authentication flow
- **Referral System**: Future feature for viral growth
- **Community Features**: Upvoting and reviews drive engagement
- **Gamification**: Points, badges, and rewards for active users

#### **3. Revenue Models**
- **Premium Subscriptions**: Advanced meal planning features
- **Restaurant Partnerships**: Featured placement for businesses
- **Sponsored Promotions**: Promoted deals in search results
- **Data Analytics**: Aggregated insights for restaurants (anonymous)

#### **4. Feature Expansion**
- **Meal Plan Sharing**: Social features for community meal plans
- **Nutrition Tracking**: Integration with health apps
- **Recipe Suggestions**: Based on available ingredients
- **Delivery Integration**: Partner with delivery services
- **Group Orders**: Split bills and order together

### **Technical Improvements for Scale**

#### **1. Caching Strategy**
```typescript
// Redis caching for hot data
- User sessions: 1 hour TTL
- Promotion listings: 5 minutes TTL
- Place information: 1 day TTL
- AI meal plans: 30 minutes TTL
```

#### **2. Load Balancing**
- Geographic load distribution
- Auto-scaling based on traffic patterns
- Peak hour optimization (lunch/dinner times)

#### **3. Monitoring & Analytics**
- Real-time error tracking
- Performance monitoring (Core Web Vitals)
- User behavior analytics
- A/B testing infrastructure

#### **4. Database Sharding**
- Geographic sharding for location-based data
- User data partitioning
- Promotion data by region

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20+ or Bun
- npm, yarn, pnpm, or bun package manager

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Fernando-Mauro/hackmty-front.git
cd hackmty-front
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

4. **Run the development server**
```bash
npm run dev
# or
bun dev --turbopack
```

5. **Open your browser**
```
http://localhost:3000
```

### **Build for Production**
```bash
npm run build
npm run start
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# AWS Location Service (Amazon Location)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_MAP_NAME=your-map-name
NEXT_PUBLIC_MAP_API_KEY=your-api-key

# Authentication
# (Add your backend authentication endpoints here)
```

---

## 📁 Project Structure

```
hackmty-front/
├── public/                  # Static assets
│   ├── logo.PNG
│   └── *.svg
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── page.tsx       # Login page
│   │   ├── app/           # Protected dashboard
│   │   ├── featured/      # Featured promotions
│   │   ├── promos/        # All promotions
│   │   ├── profile/       # User profile
│   │   └── post-promotion/ # Create promotions
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── card.tsx       # Promotion cards
│   │   ├── map-component.tsx  # Interactive map
│   │   ├── meal-chat.tsx  # AI meal planner
│   │   └── login-form.tsx # Authentication
│   ├── lib/               # Utilities
│   │   ├── utils.ts       # Helper functions
│   │   └── cookies.ts     # Cookie management
│   └── middleware.ts      # Route protection
├── biome.json             # Biome configuration
├── components.json        # Shadcn config
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript config
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Code Quality**
```bash
# Run linter
npm run lint

# Format code
npm run format
```

---

## 📄 License

This project was created for HackMTY. All rights reserved.

---

## 👥 Team

Built with ❤️ by the HackMTY team

---

## 🔗 Links

- **Repository**: [github.com/Fernando-Mauro/hackmty-front](https://github.com/Fernando-Mauro/hackmty-front)
- **Documentation**: See `AUTH_README.md` and `IMPLEMENTATION_SUMMARY.md`

---

## 🎓 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Deployment
Deploy on [Vercel](https://vercel.com/new) - the easiest way to deploy Next.js apps.

---

<div align="center">
  <strong>Making affordable, sustainable eating accessible to everyone 🌱</strong>
</div>
