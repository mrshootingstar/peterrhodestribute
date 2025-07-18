# Peter Frederick Rhodes Tribute Website - Setup Instructions

## Overview

This is a beautiful, modern tribute website built with Next.js and deployed on CloudFlare Pages. It includes:

- ✅ **Memorial Photo Gallery** - Display cherished photos
- ✅ **Anonymous Tribute Support** - Users can submit tributes anonymously or with their name
- ✅ **Image Upload** - Support for tribute photos (up to 10MB)
- ✅ **Admin Moderation System** - Review and approve tributes before they go live
- ✅ **CloudFlare Infrastructure** - Uses D1 database and R2 storage for scalability

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up CloudFlare Resources

#### Create D1 Database
```bash
# Create the database
wrangler d1 create tribute-db

# Note the database ID from the output and update wrangler.jsonc
# Replace "your-d1-database-id" with the actual ID

# Create the database schema
wrangler d1 execute tribute-db --file=schema.sql
```

#### Create R2 Bucket
```bash
# Create R2 bucket for images
wrangler r2 bucket create tribute-images
```

### 3. Update Configuration

#### Update `wrangler.jsonc`
Replace `"your-d1-database-id"` with your actual D1 database ID from step 2.

#### Set Admin Password
```bash
# Generate a password hash (replace 'your-secure-password' with your actual password)
node -e "console.log(require('bcryptjs').hashSync('your-secure-password', 10))"

# Update wrangler.jsonc with the hash
# Replace "your-admin-password-hash" with the generated hash
```

### 4. Add Memorial Photos

1. Place your memorial photos in the `public/photos/` directory
2. Supported formats: JPG, PNG, WEBP
3. The photo gallery will automatically display all images in this folder

### 5. Deploy to CloudFlare Pages

```bash
# Build and deploy
npm run deploy
```

## 📋 Features Explained

### Public Features

1. **Photo Gallery**: Automatically displays all photos from `public/photos/`
2. **Memorial Information**: Shows Peter's name, dates, and memorial message
3. **Tribute Submission**: Users can submit text and photo tributes
4. **Anonymous Option**: Checkbox to submit tributes anonymously

### Admin Features

1. **Admin Login**: Access via `/admin` with your password
2. **Dashboard**: View all tributes (pending and approved)
3. **Moderation**: Approve/reject tributes with optional admin notes
4. **Statistics**: See total, pending, and approved tribute counts

### Moderation Workflow

1. User submits tribute → Saved as "pending"
2. Admin reviews in dashboard → Can approve/reject
3. Approved tributes appear on main page
4. Rejected tributes are hidden but kept in database

## 🛠️ Admin Access

### Login
- Visit `/admin` on your website
- Enter the admin password you set up
- Access the dashboard to moderate tributes

### Managing Tributes
- **Approve**: Makes tribute visible on main page
- **Reject**: Hides tribute (with optional admin notes)
- **Revoke**: Remove approval from previously approved tribute

## 📂 File Structure

```
src/
├── app/
│   ├── page.tsx                 # Main tribute page
│   ├── admin/
│   │   ├── page.tsx            # Admin login
│   │   └── dashboard/page.tsx   # Admin dashboard
│   ├── components/
│   │   ├── PhotoGallery.tsx    # Memorial photo display
│   │   ├── TributeForm.tsx     # Tribute submission form
│   │   └── TributesList.tsx    # Approved tributes display
│   └── api/
│       ├── tributes/           # Tribute submission & retrieval
│       ├── admin/              # Admin tribute management
│       ├── auth/               # Admin authentication
│       └── images/             # Image serving from R2
```

## 🔒 Security Features

- Admin authentication with secure password hashing
- Session-based admin access with expiration
- Input validation and sanitization
- File type and size restrictions for uploads
- CSRF protection via HTTP-only cookies

## 📱 Responsive Design

The website is fully responsive and looks beautiful on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Customization

### Colors & Styling
- Edit Tailwind classes in components for different colors
- Main color scheme: Blue and slate gray
- Memorial cards: White with subtle shadows

### Memorial Text
- Edit `src/app/page.tsx` to update memorial information
- Change dates, description, or add more details

### Photo Gallery
- Simply add/remove photos from `public/photos/`
- Supports automatic resizing and optimization

## 🚨 Important Notes

1. **Photos**: Add your memorial photos to `public/photos/` before deploying
2. **Admin Password**: Keep your admin password secure and don't share it
3. **Database ID**: Make sure to update the D1 database ID in `wrangler.jsonc`
4. **Backup**: CloudFlare handles backups, but consider exporting tribute data periodically

## 📞 Support

If you need help with setup or have questions:
1. Check CloudFlare documentation for D1 and R2
2. Verify all environment variables are set correctly
3. Test locally with `npm run dev` before deploying

## 🕊️ Memorial Message

*"Those we love don't go away, they walk beside us every day."*

This website serves as a lasting tribute to Peter Frederick Rhodes, allowing friends and family to share their memories and keep his spirit alive through their stories. 