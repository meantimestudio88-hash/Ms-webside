# Meantime Studio — New Website Structure

## Overview
This is a complete rebuild of the Meantime Studio website following premium editorial design principles. The site is data-driven, component-based, and ready for Firebase integration.

## File Structure

```
Ms-webside/
├── index-new.html          # Home page (rename to index.html when ready)
├── about-new.html          # About page
├── work-new.html           # Work index
├── approach-new.html       # Approach page
├── studio-new.html         # Studio page
├── reviews-new.html        # Reviews page
├── contact-new.html       # Contact page
├── work/
│   └── project-template.html  # Project detail template
├── data/
│   ├── site.json          # Site configuration
│   ├── projects.json       # Projects data
│   ├── reviews.json       # Reviews data
│   └── designers.json     # Designers data
├── js/
│   ├── main.js            # Main application logic
│   ├── components.js      # Header/Footer components
│   └── render/
│       ├── projects.js    # Project rendering
│       ├── reviews.js     # Review rendering
│       └── designers.js   # Designer rendering
├── css/
│   └── main.css           # Main stylesheet (premium, minimal)
└── assets/
    └── img/               # Image placeholders
```

## Migration Steps

1. **Backup existing files** (if needed)
2. **Rename new files**:
   - `index-new.html` → `index.html`
   - `about-new.html` → `about.html`
   - `work-new.html` → `work.html`
   - `approach-new.html` → `approach.html`
   - `studio-new.html` → `studio.html`
   - `reviews-new.html` → `reviews.html`
   - `contact-new.html` → `contact.html`

3. **Update CSS reference** in all pages if needed
4. **Add placeholder images** to `assets/img/`
5. **Test all pages** locally
6. **Deploy to Firebase**

## Features

- ✅ Data-driven (JSON files)
- ✅ Component-based architecture
- ✅ Premium editorial design
- ✅ Responsive layout
- ✅ SEO-friendly
- ✅ Ready for Firebase integration
- ✅ Clean, scalable structure

## Next Steps

1. Add real images to `assets/img/`
2. Customize content in JSON files
3. Test all functionality
4. Deploy to Firebase Hosting
