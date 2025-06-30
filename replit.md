# MobileForge - Shopify Mobile App Builder

## Overview

MobileForge is a full-stack web application that allows users to transform their Shopify stores into native mobile apps using natural language prompts. The platform provides a no-code solution for creating beautiful, customized mobile applications with real-time preview capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Database Schema
The application uses three main entities:
- **Users**: Store authentication and profile information (required for Replit Auth)
- **Shopify Stores**: Store connection details and metadata for connected Shopify stores
- **Generated Apps**: Track mobile app generation requests and their status
- **Sessions**: Handle authentication sessions (required for Replit Auth)

## Key Components

### Authentication System
- Replit-based OpenID Connect authentication
- Session management with PostgreSQL backing
- Automatic user profile synchronization
- Protected routes with authentication middleware

### Shopify Integration
- Store connection and validation
- Access token management
- Store metadata collection (products, collections, orders)
- Real-time sync capabilities

### App Generation Engine
- Natural language prompt processing
- App customization with color themes
- Status tracking (processing, ready, failed)
- Mobile app preview generation

### Real-time Preview
- Live mobile app mockup rendering
- Dynamic content updates based on store data
- Responsive design simulation
- Device frame visualization

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or updating user records
2. **Store Connection**: Users connect their Shopify stores by providing domain and access tokens
3. **App Generation**: Users create mobile apps using natural language descriptions
4. **Preview Generation**: System generates real-time previews of the mobile app
5. **Status Tracking**: Users monitor app generation progress through the dashboard

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds

### Authentication Dependencies
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Mode
- Vite development server with HMR
- Express server with middleware mode
- Automatic TypeScript compilation
- Replit integration with development banners

### Production Build
- Client-side build with Vite (outputs to `dist/public`)
- Server-side build with esbuild (outputs to `dist`)
- Static asset serving from Express
- Environment-based configuration

### Database Management
- Drizzle migrations in `./migrations` directory
- Schema definitions in `shared/schema.ts`
- Push-based deployments with `db:push` command

## Recent Changes

- June 30, 2025: Initial setup with complete mobile app builder platform
- June 30, 2025: Integrated Gemini AI for natural language app generation
- June 30, 2025: Added functional Shopify store connection with form validation
- June 30, 2025: Enhanced mobile preview with AI-generated app configurations
- June 30, 2025: Implemented real-time app generation with status tracking
- June 30, 2025: Migrated from Replit Agent to Replit environment
- June 30, 2025: Fixed Google AI authentication and JSON parsing issues
- June 30, 2025: Resolved code generation viewer JavaScript errors
- June 30, 2025: Implemented complete Shopify data integration with real product/collection import
- June 30, 2025: Enhanced code generation viewer with professional live typing animations
- June 30, 2025: Added Shopify sync functionality and real store data display

## Current Status

The platform is now fully functional with:
- ✓ User authentication via Replit Auth
- ✓ Shopify store connection with secure token management
- ✓ AI-powered app generation using Gemini API
- ✓ Real-time mobile app preview with dynamic configurations
- ✓ Generated app management and status tracking
- ✓ Complete database schema with proper relations

## User Preferences

Preferred communication style: Simple, everyday language.
AI Provider: Gemini (Google AI) for app generation