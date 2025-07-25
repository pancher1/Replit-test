# Employee Expertise Analysis System

## Overview

This is a full-stack web application built with Express.js and React that analyzes employee expertise through an interactive 3D visualization. The system allows users to input employee data through resumes and evaluations, then visualizes expertise across multiple dimensions using a 3D cube interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **3D Visualization**: Three.js with React Three Fiber for the expertise cube
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful endpoints under `/api` prefix
- **Error Handling**: Centralized error middleware with structured JSON responses
- **Logging**: Custom request/response logging for API endpoints

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured via Drizzle ORM)
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Storage**: In-memory storage with sample data for development
- **ORM**: Drizzle ORM with Zod schema validation
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Database Schema
- **Employees Table**: Core employee information with JSON fields for resume and evaluation data
- **Projects Table**: Employee project history with technologies and impact metrics
- **Expertise Scores Table**: Calculated expertise ratings across 6 dimensions

### 3D Visualization System
- **Expertise Cube**: Interactive 3D cube with each face representing a skill dimension
- **Face Interactions**: Clickable faces that open detailed modals
- **Visual Filters**: Toggle visibility of different expertise dimensions
- **Camera Controls**: Orbital controls for 360-degree viewing

### Form System
- **Resume Input**: Multi-step form for personal info, projects, skills, and achievements
- **Evaluation Input**: Slider-based ratings for expertise dimensions
- **Validation**: Zod schemas for type-safe form validation
- **React Hook Form**: Form state management with resolver integration

### Analysis Engine
- **Resume Analysis**: Keyword-based scoring algorithm for technical skills
- **Experience Weighting**: Years of experience factor into all calculations
- **Project Impact**: Project complexity and leadership roles affect scores
- **Domain Knowledge**: Department and industry-specific skill assessment

## Data Flow

1. **Data Input**: Users submit resume or evaluation data through forms
2. **Analysis Processing**: Custom algorithms calculate expertise scores from input data
3. **Database Storage**: Processed data is stored in PostgreSQL tables
4. **API Retrieval**: React Query fetches employee and expertise data
5. **3D Rendering**: Three.js renders interactive expertise cube
6. **User Interaction**: Clicks on cube faces trigger detailed modal views

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives for forms and modals
- **three**: 3D graphics library for expertise visualization
- **@react-three/fiber**: React renderer for Three.js

### Development Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast bundler for production builds
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development enhancements

### UI Framework
- **shadcn/ui**: Pre-built component library with Tailwind CSS
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent UI elements

## Deployment Strategy

### Development Environment
- **Server**: Node.js with tsx for TypeScript execution
- **Client**: Vite dev server with HMR and React Fast Refresh
- **Database**: Environment variable-based PostgreSQL connection
- **File Watching**: Automatic server restart on backend changes

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: esbuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built React app in production
- **Database**: Production PostgreSQL via environment variables

### Environment Configuration
- **DATABASE_URL**: Required environment variable for PostgreSQL connection
- **NODE_ENV**: Controls development vs production behavior
- **REPL_ID**: Enables Replit-specific development features