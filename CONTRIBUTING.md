# Contributing to FS Cockpit

Thank you for your interest in contributing to FS Cockpit! This document provides guidelines for contributing to the project.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fs-cockpit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting (2 spaces indentation)
- Use functional components with hooks
- Keep components small and focused
- Write meaningful commit messages

## Component Guidelines

- Place reusable components in `src/components/`
- Place screen-specific components in `src/screens/`
- Use ShadCN UI components when possible
- Use Lucide React for icons
- Follow the existing naming conventions

## API Integration

- All API calls should go through `src/services/api/`
- Use the centralized `apiService` for HTTP requests
- Implement proper error handling
- Add appropriate TypeScript types

## Testing

- Test your changes thoroughly
- Verify both live API and mock data modes
- Check responsive design on different screen sizes
- Ensure no console errors

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description

## Questions?

Feel free to open an issue for any questions or concerns.
