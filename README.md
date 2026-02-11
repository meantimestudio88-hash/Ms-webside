# Interior Design Studio Website

A sophisticated, modern website for an interior design studio with a content management system.

## Features

- **Modern Studio Design**: High-end, minimalist aesthetic with focus on visual content
- **Portfolio Showcase**: Beautiful gallery of design projects
- **Designer Profiles**: Detailed information about the design team
- **Client Reviews**: Testimonials and reviews from satisfied clients
- **Admin Dashboard**: Secure backend for content management
  - Add/edit projects and photos
  - Manage designer profiles
  - Add client reviews
  - Upload images to Firebase Storage

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase
  - **Firestore**: Database for projects, designers, reviews
  - **Firebase Authentication**: Admin login
  - **Firebase Storage**: Image hosting
  - **Firebase Hosting**: Website deployment

## Project Structure

```
/
├── index.html              # Homepage
├── portfolio.html          # Projects gallery
├── designers.html          # Designers page
├── reviews.html            # Client reviews
├── admin.html              # Admin dashboard (login + CMS)
├── css/
│   ├── style.css          # Main stylesheet
│   └── admin.css          # Admin dashboard styles
├── js/
│   ├── main.js            # Main JavaScript
│   ├── firebase-config.js # Firebase configuration
│   ├── portfolio.js       # Portfolio functionality
│   └── admin.js           # Admin dashboard logic
├── images/                 # Local images (if any)
└── firebase.json           # Firebase hosting config
```

## Setup Instructions

### 1. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - **Authentication**: Enable Email/Password sign-in
   - **Firestore Database**: Create database in production mode
   - **Storage**: Enable Firebase Storage
   - **Hosting**: Enable Firebase Hosting

### 2. Firebase Configuration

1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" and add a web app
3. Copy the Firebase configuration object
4. Create `js/firebase-config.js` and add your config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Firestore Database Structure

Create the following collections in Firestore:

**projects** (collection)
- `id` (auto-generated)
- `title` (string)
- `description` (string)
- `category` (string)
- `images` (array of strings - Storage URLs)
- `date` (timestamp)
- `featured` (boolean)

**designers** (collection)
- `id` (auto-generated)
- `name` (string)
- `role` (string)
- `bio` (string)
- `image` (string - Storage URL)
- `specialties` (array of strings)
- `experience` (number)

**reviews** (collection)
- `id` (auto-generated)
- `clientName` (string)
- `project` (string)
- `rating` (number, 1-5)
- `comment` (string)
- `date` (timestamp)
- `approved` (boolean)

**adminUsers** (collection)
- `email` (string)
- `role` (string)

### 4. Create Admin User

1. In Firebase Console, go to Authentication
2. Add a user with email/password
3. Add this email to the `adminUsers` collection in Firestore with `role: "admin"`

### 5. Local Development

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
Select:
- Firestore
- Hosting
- Storage

4. Serve locally:
```bash
firebase serve
```

### 6. Deploy

```bash
firebase deploy
```

## Admin Access

- Navigate to `/admin.html`
- Login with your admin email and password
- Once authenticated, you can:
  - Upload project photos
  - Add/edit designer profiles
  - Add client reviews
  - Manage all content

## Design Philosophy

This website follows a high-end design studio aesthetic:
- **Minimalist Layout**: Clean, spacious design with focus on content
- **Large Imagery**: Hero images and project galleries take center stage
- **Typography**: Elegant, readable fonts with proper hierarchy
- **Subtle Animations**: Smooth transitions and hover effects
- **Professional Color Palette**: Neutral tones with strategic accent colors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Additional Recommendations

### 1. SEO Optimization
- Add meta tags for better search engine visibility
- Implement Open Graph tags for social media sharing
- Add structured data (JSON-LD) for rich snippets
- Create a sitemap.xml

### 2. Performance Optimization
- Optimize images before uploading (compress, resize)
- Implement lazy loading for images
- Add service worker for offline functionality
- Consider using CDN for static assets

### 3. Analytics Integration
- Add Google Analytics for visitor tracking
- Track user interactions and popular projects
- Monitor admin dashboard usage

### 4. Contact Form
- Add a contact form with email integration
- Consider using Firebase Cloud Functions for email sending
- Or integrate with services like Formspree or EmailJS

### 5. Blog/News Section (Optional)
- Add a blog section for design tips and company news
- Use Firestore to store blog posts
- Implement categories and tags

### 6. Image Gallery Enhancements
- Add lightbox functionality for better image viewing
- Implement image zoom and fullscreen mode
- Add image carousel/slider for project pages

### 7. Search Functionality
- Add search bar to find projects by keywords
- Filter projects by multiple criteria
- Search designers by name or specialty

### 8. Multi-language Support (If Needed)
- Implement i18n for multiple languages
- Store translations in Firestore
- Add language switcher in navigation

### 9. Email Notifications
- Notify admin when new reviews are submitted
- Send confirmation emails for contact form submissions
- Use Firebase Cloud Functions for email automation

### 10. Security Enhancements
- Implement rate limiting for admin login
- Add CAPTCHA for admin login (optional)
- Set up Firebase App Check for additional security
- Regularly update Firebase rules

### 11. Backup & Maintenance
- Set up automated Firestore backups
- Document all admin procedures
- Create backup admin accounts
- Regular security audits

### 12. Mobile App (Future Consideration)
- Consider creating a companion mobile app
- Use Firebase as backend for consistency
- Allow clients to view projects on mobile

## Troubleshooting

### Common Issues

**Firebase config not working:**
- Make sure you've replaced all placeholder values in `js/firebase-config.js`
- Verify your Firebase project settings
- Check browser console for errors

**Images not uploading:**
- Verify Firebase Storage rules allow authenticated uploads
- Check file size limits (Firebase Storage default is 32MB)
- Ensure images are in supported formats (JPG, PNG, etc.)

**Admin login not working:**
- Verify user exists in Firebase Authentication
- Check that email/password sign-in is enabled
- Clear browser cache and try again

**Data not displaying:**
- Check Firestore rules allow public reads
- Verify collection names match exactly (case-sensitive)
- Check browser console for Firestore errors

## Support

For issues or questions, check:
- Firebase Documentation: https://firebase.google.com/docs
- Firestore Documentation: https://firebase.google.com/docs/firestore
- Firebase Storage: https://firebase.google.com/docs/storage

## License

Private project for interior design studio.
