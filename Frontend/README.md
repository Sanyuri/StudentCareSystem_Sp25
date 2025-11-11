# StudentCareSystem Frontend

## Overview

StudentCareSystem is an enterprise-grade frontend for educational institutions, built with React 18, Vike for SSR, Zustand, TanStack Query, and Ant Design. It offers a responsive, secure UI for managing student care, integrating tightly with the backend (.NET 9.0) and AI service (FastAPI).

The app emphasizes performance, security, and user experience, with comprehensive automated testing and Docker Compose support for deployment.

## Architecture

The project follows a **Modern Component-Based Architecture** with a focus on reusability, maintainability, and security:

- **Presentation Layer**: UI components with Ant Design and Pro Components
- **State Management**: Zustand for global state and TanStack Query for server state
- **Service Layer**: API integration with Axios and error handling
- **Server Layer**: Express server with Vike for SSR capabilities
- **Utility Layer**: Helper functions and common utilities
- **Asset Layer**: Static resources, images, and styles

### Design Patterns

- **Atomic Design**: Components are structured following atomic design principles
- **Container/Presenter Pattern**: Separation of logic and presentation
- **Custom Hook Pattern**: Reusable logic extracted into hooks
- **Render Props**: For component composition and logic reuse
- **Context API**: For theme and localization management

## Tech Stack

- **Framework**: React 18
- **SSR Framework**: Vike with vike-react
- **State Management**: Zustand and TanStack Query (React Query)
- **UI Library**: Ant Design with Pro Components
- **API Integration**: Axios with axios-retry
- **Form Validation**: Zod
- **Routing**: Vike routing
- **Charts & Visualization**: Recharts
- **Date & Time**: Luxon and Moment
- **Internationalization**: i18next with react-i18next
- **Rich Text Editing**: React Quill
- **Testing**: Vitest and React Testing Library
- **Build Tool**: Vite
- **Authentication**: JWT with react-oauth/google
- **Data Export**: XLSX (SheetJS)
- **Notifications**: React Toastify
- **Security**: DOMPurify, encrypt-storage, disable-devtool
- **Server**: Express with compression and helmet
- **Code Obfuscation**: JavaScript Obfuscator (production build)
- **Styling**: Tailwind CSS

## Security Features

- **Code Obfuscation**: JavaScript obfuscation in production builds
- **CSP Nonces**: Content Security Policy implementation
- **XSS Protection**: DOMPurify for sanitizing user input
- **Anti-Tampering**: Self-defending code in production
- **DevTool Disabling**: Prevention of browser DevTools in production
- **Encrypted Storage**: Secure local storage encryption
- **HTTPS Enforcement**: Secure communication
- **JWT Authentication**: Secure token-based authentication
- **Helmet**: HTTP header security
- **Input Validation**: Zod validation for all form inputs
- **CORS Protection**: Configured secure cross-origin resource sharing

## Project Structure

```plaintext
StudentCareSystem-Frontend/
├── server/                     # Express server for SSR
│   ├── config/                 # Server configuration
│   ├── middlewares/            # Express middlewares
│   ├── routes/                 # Server-side routes
│   ├── schemas/                # Validation schemas
│   ├── types/                  # TypeScript types for server
│   └── utils/                  # Server utilities
├── src/                        # Source code
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Reusable UI components
│   ├── configs/                # Application configuration
│   ├── hooks/                  # Custom React hooks
│   ├── layout/                 # Layout components
│   ├── locales/                # Internationalization files
│   ├── pages/                  # Application pages/routes
│   ├── plugins/                # Application plugins
│   ├── services/               # API services
│   ├── stores/                 # Zustand state stores
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── scripts/                    # Build and deployment scripts
├── .dockerignore               # Docker ignore file
├── .env                        # Environment variables
├── .env.example                # Example environment variables
├── .eslintrc.cjs               # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .stylelintrc.json           # Stylelint configuration
├── Dockerfile                  # Docker configuration
├── ecosystem.config.cjs        # PM2 configuration
├── nodemon.json                # Nodemon configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

### Key Directories Explained

#### Server

The server directory contains the Express server implementation that handles server-side rendering (SSR), API proxying, and serves the application. This is a critical component as the application uses Vike for SSR.

#### Source Code

##### Components

Reusable UI components following atomic design principles:

- **Atoms**: Basic building blocks (buttons, inputs, etc.)
- **Molecules**: Combinations of atoms (form fields, search bars)
- **Organisms**: Complex UI sections (navigation, dashboards)
- **Templates**: Page layouts and structural components

##### Hooks

Custom React hooks that encapsulate reusable logic:

- Authentication hooks
- Form handling hooks
- API request hooks
- UI state hooks

##### Pages

Application pages that correspond to routes in the application. Each page typically consists of:

- Page component
- Page-specific components
- Page-level hooks
- Page-level stores

##### Services

API integration services organized by domain:

- Authentication services
- Student services
- Attendance services
- Care management services

##### Stores

Zustand stores for global state management:

- Authentication store
- UI state store
- User preferences store
- Application settings store

## Key Features

### User Interface

- **Responsive Dashboard**: Adaptive dashboard for student care overview
- **Interactive Student Profiles**: Comprehensive student information display
- **Attendance Visualization**: Graphical attendance tracking and analysis
- **Care Assignment Interface**: Intuitive care assignment workflow
- **Progress Tracking**: Visual representation of student progress
- **Note System**: Rich text note-taking for student interactions
- **Multi-language Support**: i18next integration for localization
- **Theme Customization**: Light/dark mode and tenant-specific theming
- **Accessibility Compliance**: WCAG 2.1 AA standards support

### Data Management

- **Data Grid**: Advanced data grid with sorting, filtering, and pagination
- **Form Management**: Complex form handling with validation
- **File Upload**: Secure file uploading and management
- **Data Export**: Export to Excel and other formats
- **Data Visualization**: Charts and graphs for analytics
- **Search Functionality**: Advanced search with filters
- **Bulk Operations**: Batch actions for efficient workflows

### Security and Performance

- **Authentication**: JWT-based authentication with Google OAuth integration
- **Role-Based Access Control**: Different views and permissions based on user roles
- **Route Protection**: Secure routes requiring authentication
- **Code Splitting**: Optimized bundle loading
- **Server-Side Rendering**: Improved initial load performance
- **API Caching**: TanStack Query caching for optimized API calls
- **Error Boundary**: Graceful error handling and fallbacks

## Setup and Development

### Prerequisites

- Node.js (v18+)
- npm (v9+) or yarn
- Backend API running or accessible endpoint

### Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```env
# API Configuration
VITE_API_URL=http://api.example.com
VITE_API_VERSION=v1

# Authentication
PUBLIC_ENV__META__GOOGLE_CLIENT_KEY=your-google-client-key

# Feature Flags
VITE_FEATURE_RICH_TEXT_EDITOR=true
VITE_FEATURE_DATA_EXPORT=true

# Other Configuration
NODE_ENV=development
PORT=3000
```

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to frontend directory
cd StudentCareSystem_Sp25/Frontend

# Install dependencies
npm install
```

### Development Environment

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Format code
npm run format
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run server:prod

# Start with PM2 (production)
npm run pm2:prod
```

### Docker Deployment

```bash
# Build Docker image
docker build -t studentcare-frontend .

# Run Docker container
docker run -p 3000:3000 studentcare-frontend
```

## Testing Strategy

The project implements a comprehensive testing strategy:

- **Unit Testing**: Individual functions and components with Vitest and React Testing Library
- **Integration Testing**: Component interactions
- **E2E Testing**: Critical user flows
- **Accessibility Testing**: WCAG compliance checks
- **Performance Testing**: Load and responsiveness tests

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:unit:watch

# Run unit tests with coverage
npm run test:unit:coverage

# Update snapshots
npm run test:unit:update

# Run linting tests
npm run test:lint
```

## Performance Optimizations

- **Server-Side Rendering**: Improved initial page load and SEO
- **Code Splitting**: Dynamic imports for route-based code splitting
- **Tree Shaking**: Elimination of unused code
- **Asset Optimization**: Compression of images and assets
- **Lazy Loading**: Components and routes loaded on demand
- **Memoization**: Performance-optimized component rendering
- **API Request Optimization**: Caching and request batching
- **Bundle Analysis**: Regular analysis and optimization of bundle size

## Deployment Pipeline

1. **Development**: Local development environment
2. **Testing**: Automated testing environment
3. **Staging**: Pre-production environment for QA
4. **Production**: Live environment

## Browser Support

The application supports:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Accessibility

The application follows WCAG 2.1 AA standards with:

- **Semantic HTML**: Proper HTML structure
- **Keyboard Navigation**: Full keyboard accessibility
- **ARIA Attributes**: Screen reader support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: AA-compliant contrast ratios
- **Screen Reader Compatibility**: Tested with popular screen readers
- **Responsive Font Sizes**: Scalable typography

## Code Quality Standards

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **TypeScript**: Strong typing enforcement
- **Sonar**: Code quality analysis
- **Qodana**: Advanced code quality checks

## Contributing Guidelines

1. **Branching Strategy**: Feature branches from `develop`
2. **Commit Messages**: Follow conventional commits specification
3. **Pull Requests**: Require review and passing CI
4. **Documentation**: Required for new features

## License

[MIT License](LICENSE) - Copyright (c) 2025 StudentCareSystem Team

## Contributors

- [Team Member 1] - Frontend Lead
- [Team Member 2] - UI/UX Designer
- [Team Member 3] - Senior Developer
- [Team Member 4] - Quality Assurance

## Acknowledgments

- [Ant Design Team](https://ant.design/) - UI component library
- [Vike Team](https://vike.dev/) - SSR framework
- [TanStack Query](https://tanstack.com/query/latest) - Data fetching library
