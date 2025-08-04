# Order Management System

## Overview

This is a full-stack order management system built with React frontend and Express.js backend. The application allows users to create, manage, and track orders with features including invoice file uploads, real-time notifications, and comprehensive order analytics. The system uses a modern tech stack with TypeScript throughout, PostgreSQL for data persistence, and shadcn/ui components for a polished user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **File Uploads**: Custom file upload component with drag-and-drop support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Handling**: Multer middleware for multipart file uploads
- **Validation**: Zod schemas for request/response validation
- **Development**: tsx for TypeScript execution in development

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: 
  - `orders`: Core order data with unique order IDs, customer info, amounts, and invoice file URLs
  - `users`: User authentication (prepared for future implementation)

### API Structure
- **REST API**: Express routes handling CRUD operations for orders
- **File Upload Endpoint**: `/api/orders` POST with multipart form data support
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

### External Service Integration
- **Mock AWS Services**: Simulated S3 for file storage and SNS for notifications
- **File Storage**: Mock S3 service generates placeholder URLs for uploaded invoices
- **Notifications**: Mock SNS service simulates order confirmation emails/SMS

### Development Tools
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Code Quality**: ESLint configuration and TypeScript strict mode
- **Hot Reload**: Vite dev server with HMR for frontend, tsx for backend

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations and query building
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight routing library for React applications

### UI and Styling
- **@radix-ui/***: Comprehensive set of headless UI components
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe component variant management
- **lucide-react**: Icon library for consistent iconography

### Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration layer for external validation libraries
- **zod**: Schema validation for TypeScript with runtime type checking
- **drizzle-zod**: Bridge between Drizzle schemas and Zod validation

### File Handling and Utilities
- **multer**: Middleware for handling multipart/form-data file uploads
- **date-fns**: Modern date utility library for date formatting and manipulation

### Development and Build Tools
- **vite**: Fast build tool and development server for modern web projects
- **tsx**: TypeScript execution engine for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting in development