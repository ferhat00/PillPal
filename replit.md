# Medication Reminder App

## Overview

This is a medication reminder application built with React, Express, and in-memory storage designed specifically for elderly users. The app features a vertical pill organizer interface with large, accessible components and helps users manage their daily medication schedule with visual indicators and tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

✓ **Vertical pill organizer layout** - Redesigned compartments to stack vertically (top to bottom) for better accessibility
✓ **Elderly-friendly interface** - Large text, high contrast colors, clear visual indicators
✓ **Active medication alerts** - Visual arrows and alerts showing which compartment to open
✓ **Medication tracking** - "I Took My Medicine" button functionality
✓ **Settings management** - Customizable medication times with enable/disable options
✓ **Emergency contacts** - Quick access buttons for family, doctor, and emergency calls
✓ **Fixed React re-rendering bug** - Resolved infinite re-render loop in Settings component
✓ **TypeScript fixes** - Corrected type compatibility issues in storage layer

Date: July 29, 2025

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Session Storage**: PostgreSQL session store using connect-pg-simple

### Key Components

#### Database Schema (shared/schema.ts)
- **Medication Schedules**: Stores time settings for morning, afternoon, evening, and night doses
- **Medication Logs**: Tracks when medications are taken with timestamps and dates
- **Users**: Basic user authentication schema (present but not fully implemented)

#### Core Features
- **Visual Pill Organizer**: Shows 4 compartments (morning, afternoon, evening, night) with visual indicators
- **Real-time Clock**: Displays current time and determines active medication period
- **Progress Tracking**: Shows daily completion status with visual progress bar
- **Settings Management**: Allows users to configure medication times and enable/disable periods
- **Emergency Contacts**: Quick access buttons for emergency, family, and doctor calls

#### API Endpoints
- `GET /api/medication-schedule` - Retrieve current medication schedule
- `PATCH /api/medication-schedule/:id` - Update medication schedule settings
- `GET /api/medication-logs/:date` - Get medication logs for specific date
- `POST /api/medication-logs` - Mark medication as taken

## Data Flow

1. **Schedule Management**: Users configure their medication times in the settings page
2. **Active Period Detection**: The timer hook determines which medication period is currently active
3. **Visual Indicators**: The pill organizer shows which compartment needs attention
4. **Medication Logging**: Users mark medications as taken, updating the database
5. **Progress Tracking**: The app calculates daily completion percentage based on enabled periods

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database PostgreSQL driver
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **react-hook-form**: Form state management with validation
- **zod**: Schema validation
- **wouter**: Lightweight React router

### Development Tools
- **Vite**: Build tool with React plugin
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Mode
- Frontend served by Vite dev server with HMR
- Backend runs with tsx for TypeScript execution
- Database migrations handled by Drizzle Kit

### Production Build
- Frontend built to static files using Vite
- Backend bundled with ESBuild targeting Node.js
- Static files served by Express in production
- Database configured via DATABASE_URL environment variable

### Configuration Files
- **drizzle.config.ts**: Database migration configuration
- **vite.config.ts**: Frontend build configuration with path aliases
- **tsconfig.json**: TypeScript configuration for monorepo structure
- **tailwind.config.ts**: CSS framework configuration
- **components.json**: shadcn/ui component configuration

The application uses a monorepo structure with shared types and schemas, making it easy to maintain type safety between frontend and backend. The storage layer is abstracted with an interface, currently using in-memory storage for development but designed to easily switch to database storage.