# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running (for backend)
- Terminal/Command Line

## Start the Application

### Option 1: Start Both Frontend & Backend Together (Recommended)
```bash
# From the root directory
npm run dev
```

This will start:
- **Backend** on `http://localhost:3000`
- **Frontend** on `http://localhost:5173` (or similar)

### Option 2: Start Separately

#### Start Backend Only
```bash
npm start
# or
nx serve @auth-app/backend
```

#### Start Frontend Only
```bash
cd apps/frontend
npm run dev
```

## First Time Setup

1. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   # Example: mongod --dbpath /path/to/data
   ```

3. **Start the Application**
   ```bash
   npm run dev
   ```

4. **Open Your Browser**
   - Navigate to the frontend URL (typically `http://localhost:5173`)
   - You should see the beautiful new UI!

## Test the New UI

### 1. Sign Up Page
- Go to `/signup`
- See the beautiful card layout with UserPlus icon
- Fill in the form with:
  - Email: `test@example.com`
  - Name: `Test User`
  - Password: `Test123!@#` (must meet requirements)
- Click "Sign Up"
- You'll be redirected to the dashboard

### 2. Dashboard
- See your profile card with email
- Check out the getting started section
- Click the logout button to sign out

### 3. Sign In Page
- Go to `/signin`
- Use the credentials you just created
- Click "Sign In"
- You'll be redirected to the dashboard

### 4. About Page
- Go to `/about`
- See the feature showcase
- Check out the technology stack
- Click the CTA buttons

## Pages Available

| Route | Description |
|-------|-------------|
| `/` | Redirects to Sign In |
| `/signin` | Sign In page (beautiful card layout) |
| `/signup` | Sign Up page (matching design) |
| `/app` | Dashboard (protected route) |
| `/about` | About page (marketing style) |

## Features to Notice

### 🎨 Visual Design
- Gradient backgrounds
- Card-based layouts
- Professional spacing
- Beautiful icons
- Smooth animations

### 📱 Responsive Design
- Try resizing your browser
- Works on mobile, tablet, desktop
- Touch-friendly buttons

### ♿ Accessibility
- Keyboard navigation works
- Screen reader friendly
- Focus indicators visible

### ⚡ Interactions
- Hover effects on buttons and links
- Loading states on forms
- Error messages in styled alerts
- Smooth transitions

## Troubleshooting

### Frontend won't start
```bash
# Clear cache and reinstall
cd apps/frontend
rm -rf node_modules .react-router
cd ../..
npm install
npm run dev
```

### Backend connection issues
- Ensure MongoDB is running
- Check backend is on port 3000
- Verify API_BASE in frontend code

### Styles not loading
- Check that `styles.css` is imported in `root.tsx`
- Verify Tailwind is configured correctly
- Clear browser cache

## Development Tips

### Hot Reload
- Both frontend and backend support hot reload
- Changes to React components update instantly
- Changes to NestJS controllers restart automatically

### Viewing Components
All UI components are in:
```
apps/frontend/app/components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── label.tsx
└── alert.tsx
```

### Customizing Theme
Edit these files:
- `apps/frontend/tailwind.config.js` - Tailwind configuration
- `apps/frontend/styles.css` - CSS variables and global styles

## Next Steps

1. ✅ **Test all pages** - Sign up, sign in, dashboard, about
2. ✅ **Try responsive design** - Resize browser window
3. ✅ **Test error handling** - Try invalid credentials
4. ✅ **Check loading states** - Watch the spinner
5. 🎨 **Customize if needed** - Adjust colors, spacing, etc.

## Need Help?

- Check `UI_IMPROVEMENTS.md` for detailed documentation
- See `BEFORE_AFTER.md` for comparison
- Review `SETUP_COMPLETE.md` for technical details

---

**Enjoy your beautiful new authentication app! 🎉**
