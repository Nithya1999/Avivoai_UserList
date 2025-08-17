# User Management System - Frontend

A modern, responsive React application for managing user data, built with Chakra UI and consuming the DummyJSON API.

## 🚀 Features

### Core Functionality
- **Display User List**: Shows user information including name, company, role, and country
- **Refresh Data**: Real-time data refresh from the DummyJSON API
- **Smart Search**: Filter users by name, company name, role, or country
- **Add Users**: Add new users locally with a comprehensive form
- **Delete Users**: Remove users from the displayed list (local state only)

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, accessible interface using Chakra UI components
- **Loading States**: Visual feedback during data fetching operations
- **Error Handling**: Graceful error messages and user notifications
- **Toast Notifications**: Success and error feedback for user actions

### Technical Features
- **Reusable Components**: Modular, maintainable component architecture
- **React Hooks**: Efficient state management with useState, useEffect, and useMemo
- **API Integration**: Robust HTTP client using Axios
- **Local State Management**: Seamless integration of API data with local additions
- **Search Optimization**: Debounced search with case-insensitive matching

## 🛠️ Technology Stack

- **React 19.1.1** - Modern React with hooks
- **Chakra UI** - Component library for consistent, accessible UI
- **Axios** - HTTP client for API requests
- **Emotion** - CSS-in-JS styling (Chakra UI dependency)
- **Framer Motion** - Animation library (Chakra UI dependency)

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher)
- **Internet connection** (required for API calls to DummyJSON)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Avivoai_Task/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML template
│   ├── favicon.ico         # App favicon
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable React components
│   │   ├── UserCard.js     # Individual user display card
│   │   ├── UserList.js     # Grid layout for user cards
│   │   ├── SearchBox.js    # Search input component
│   │   └── AddUserModal.js # Modal form for adding users
│   ├── services/           # API and utility services
│   │   └── userService.js  # DummyJSON API integration
│   ├── App.js             # Main application component
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎯 Component Architecture

### App.js
- **Main container** managing global state and orchestrating child components
- **State management** for users, search terms, loading states, and errors
- **API integration** for fetching and refreshing user data
- **Event handling** for user interactions (add, delete, search)

### UserCard.js
- **Individual user display** with company, role, and country information
- **Delete functionality** with confirmation via toast notifications
- **Responsive design** with hover effects and accessibility features
- **Local user badges** to distinguish API users from locally added ones

### UserList.js
- **Grid layout** for displaying multiple user cards
- **Responsive columns** (1 on mobile, 2 on tablet, 3 on desktop)
- **Empty state handling** with helpful messages
- **Search result indicators** showing filtered counts

### SearchBox.js
- **Real-time search** with instant filtering
- **Multi-field search** across name, company, role, and country
- **Accessible input** with proper labels and focus states
- **Clear visual feedback** for search interactions

### AddUserModal.js
- **Form validation** ensuring required fields are completed
- **Accessible modal** with proper focus management
- **Loading states** during form submission
- **Success/error handling** with toast notifications

### userService.js
- **API abstraction** for DummyJSON integration
- **Error handling** with user-friendly messages
- **Data transformation** ensuring consistent user object structure
- **Local user management** with unique ID generation

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (⚠️ irreversible)

## 🌐 API Integration

The application integrates with the **DummyJSON Users API**:

- **Endpoint**: `https://dummyjson.com/users`
- **Method**: GET
- **Response**: Array of user objects with comprehensive user information
- **Timeout**: 10 seconds with automatic error handling
- **Error Recovery**: Graceful fallback with user-friendly error messages

### User Data Structure

```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  company: {
    name: string,
    title: string
  },
  address: {
    country: string
  },
  isLocal: boolean  // Added for locally created users
}
```

## 🎨 Styling and Theming

### Chakra UI Integration
- **Consistent design system** with predefined colors, spacing, and typography
- **Responsive breakpoints** ensuring mobile-first design
- **Accessibility built-in** with ARIA attributes and keyboard navigation
- **Dark mode support** with automatic color mode detection

### Custom Styling
- **Hover effects** for interactive elements
- **Loading animations** with spinners and skeleton states
- **Color-coded badges** for different user attributes
- **Gradient text effects** for enhanced visual appeal

## 🔍 Search Functionality

The search feature provides comprehensive filtering across multiple fields:

- **Name Search**: Matches first name, last name, or full name
- **Company Search**: Filters by company name
- **Role Search**: Matches job titles and roles
- **Country Search**: Filters by user location
- **Case Insensitive**: Works regardless of text case
- **Partial Matching**: Finds results with partial string matches
- **Real-time Results**: Updates instantly as you type

## 📱 Responsive Design

The application is fully responsive across all device sizes:

- **Mobile (< 768px)**: Single column layout, touch-friendly buttons
- **Tablet (768px - 1024px)**: Two-column grid, optimized spacing
- **Desktop (> 1024px)**: Three-column grid, full feature set
- **Large Screens**: Maximum container width with centered content

## 🚨 Error Handling

Comprehensive error handling throughout the application:

- **Network Errors**: Graceful handling of API failures
- **Validation Errors**: Form validation with helpful messages
- **User Feedback**: Toast notifications for all user actions
- **Retry Mechanisms**: Refresh button for failed API calls
- **Fallback States**: Meaningful empty states and error messages

## 🔒 Security Considerations

- **Input Sanitization**: All user inputs are properly sanitized
- **API Timeout**: Prevents hanging requests with 10-second timeout
- **Error Information**: No sensitive data exposed in error messages
- **Local Storage**: No sensitive data stored in browser storage

## 🚀 Performance Optimizations

- **Memoized Search**: useMemo for efficient search filtering
- **Component Optimization**: Proper key props for list rendering
- **Lazy Loading**: Components loaded only when needed
- **Optimized Bundle**: Create React App optimizations for production builds

## 🧪 Testing

The application includes a testing setup with:

- **Jest** for unit testing
- **React Testing Library** for component testing
- **Test Scripts** available via `npm test`
- **Coverage Reports** can be generated with `npm test -- --coverage`

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Build
```bash
npm run build
npm install -g serve
serve -s build
```

### Environment Variables
No environment variables are required for basic functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the Avivoai Task assessment.

## 🆘 Troubleshooting

### Common Issues

1. **API Not Loading**
   - Check internet connection
   - Verify DummyJSON API is accessible
   - Check browser console for CORS errors

2. **Styling Issues**
   - Ensure all Chakra UI dependencies are installed
   - Clear browser cache and restart development server

3. **Search Not Working**
   - Check that user data is loaded
   - Verify search term is not empty
   - Check browser console for JavaScript errors

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all dependencies are installed correctly
3. Ensure you're using a supported Node.js version
4. Try clearing `node_modules` and running `npm install` again

---

## 📞 Support

For technical support or questions about this implementation, please refer to the project documentation or create an issue in the repository.

**Built with ❤️ using React and Chakra UI**