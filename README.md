# 💊 Medication Reminder App

An accessible, elderly-friendly medication reminder application designed to help users manage their daily medication schedule with a clear visual pill organizer interface.

![Medication Reminder App](https://img.shields.io/badge/Status-Ready%20for%20Deployment-success)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Express](https://img.shields.io/badge/Express-4+-green)

## 🎯 Features

### 📱 **Elderly-Friendly Interface**
- **Large, clear text** with high contrast colors
- **Vertical pill organizer** layout for easy navigation
- **Simple navigation** with minimal cognitive load
- **Touch-friendly buttons** with generous sizing

### 💊 **Smart Medication Management**
- **Visual pill organizer** with 4 daily compartments (Morning, Afternoon, Evening, Night)
- **Active medication alerts** with visual arrows pointing to current compartment
- **Real-time clock** displaying current time and next medication
- **Progress tracking** showing daily completion status
- **One-click medication logging** with "I Took My Medicine" button

### ⚙️ **Customizable Settings**
- **Flexible scheduling** for each medication time
- **Enable/disable** individual medication periods
- **Time customization** for morning, afternoon, evening, and night doses
- **Persistent settings** saved automatically

### 🚨 **Emergency Features**
- **Quick access** emergency contact buttons
- **Family contact** button with customizable phone number
- **Doctor contact** button for medical emergencies
- **911 emergency** button for immediate assistance

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management
- **Radix UI** with shadcn/ui for accessible components
- **Tailwind CSS** for responsive styling
- **Vite** for fast development and building

### Backend
- **Express.js** with TypeScript
- **In-memory storage** for development (easily upgradeable to PostgreSQL)
- **Drizzle ORM** for type-safe database operations
- **RESTful API** design

### Development Tools
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations
- **TypeScript** for static type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medication-reminder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to view the application

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Application pages/routes
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage interface
│   └── vite.ts             # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and types
└── package.json            # Project dependencies and scripts
```

## 🔧 API Endpoints

### Medication Schedule
- `GET /api/medication-schedule` - Retrieve current medication schedule
- `PATCH /api/medication-schedule/:id` - Update medication schedule settings

### Medication Logs
- `GET /api/medication-logs/:date` - Get medication logs for specific date (YYYY-MM-DD)
- `POST /api/medication-logs` - Mark medication as taken

## 💾 Data Models

### Medication Schedule
```typescript
{
  id: string;
  name: string;
  morningTime: string | null;
  morningEnabled: boolean | null;
  afternoonTime: string | null;
  afternoonEnabled: boolean | null;
  eveningTime: string | null;
  eveningEnabled: boolean | null;
  nightTime: string | null;
  nightEnabled: boolean | null;
}
```

### Medication Log
```typescript
{
  id: string;
  scheduleId: string;
  compartment: "morning" | "afternoon" | "evening" | "night";
  takenAt: string; // ISO date string
  date: string;    // YYYY-MM-DD format
}
```

## 🎨 Design Principles

### Accessibility First
- **High contrast colors** for better visibility
- **Large touch targets** (minimum 44px) for easy interaction
- **Clear visual hierarchy** with distinct sections
- **Minimal cognitive load** with simple, intuitive navigation

### User Experience
- **Immediate feedback** for all user actions
- **Visual progress indicators** to show completion status
- **Consistent layout** across all pages
- **Error prevention** with clear validation messages

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Environment Variables
For production deployment with PostgreSQL:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production" for production builds

## 📱 Usage Guide

### For Users
1. **Home Screen**: View current time and active medication compartment
2. **Taking Medication**: Click the highlighted compartment and press "I Took My Medicine"
3. **Settings**: Customize medication times and enable/disable periods
4. **Emergency**: Use quick access buttons for family, doctor, or emergency calls

### For Caregivers
1. **Initial Setup**: Configure medication times in Settings page
2. **Monitoring**: Check daily progress on the home screen
3. **Updates**: Adjust times and enabled periods as needed
4. **Emergency Contacts**: Configure phone numbers for quick access buttons

## 🚀 Deployment

### Replit Deployment (Recommended)
1. Push code to GitHub repository
2. Import to Replit
3. Click "Deploy" button in Replit interface
4. Application will be available at `*.replit.app` domain

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy built files to your hosting provider
3. Set environment variables if using PostgreSQL
4. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **shadcn/ui** for beautiful component designs
- **TanStack Query** for excellent server state management
- **Tailwind CSS** for utility-first styling

## 📞 Support

For support, questions, or feature requests, please open an issue in the GitHub repository.

---

**Made with ❤️ for better medication management**