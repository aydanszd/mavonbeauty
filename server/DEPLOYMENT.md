# Server Deployment Guide

## Vercel Deployment Issue - FIXED ✅

The error **"Cannot read properties of undefined (reading 'fsPath')"** was occurring because the server was trying to use local disk storage for file uploads on Vercel, which doesn't support persistent file systems.

## What Was Fixed

### 1. **Multer Configuration** (`config/multerConfig.js`)
- Now detects if running on Vercel
- Uses **disk storage** for local development
- Uses **memory storage** for Vercel/serverless environments
- Prevents crashes when upload directory doesn't exist

### 2. **File Upload Handling** (`controllers/productController.js`)
- For **local development**: Files saved to `/uploads/products/`
- For **Vercel**: Images stored as base64 strings in MongoDB
- Added `getImageData()` helper to handle both scenarios
- Added `deleteImageFile()` helper for safe file deletion

### 3. **Deployment Configuration**
- Added `vercel.json` with proper build settings
- Added `.vercelignore` to exclude upload folders
- Set `VERCEL=1` environment variable for detection

## How It Works

### Local Development
```
File Upload → Disk Storage → `/uploads/products/[filename]` → MongoDB path reference
```

### Vercel Deployment
```
File Upload → Memory → Base64 String → MongoDB → Served as data URI
```

## Environment Variables Required

```env
VERCEL=1  # Automatically set by Vercel, detects serverless environment
```

Make sure these are also configured:
- `MONGO_DB_URL` - MongoDB connection string
- `PORT` - Server port (default: 3001)
- Other auth variables...

## Testing Locally

```bash
npm install
npm run dev
```

The server should start without file system errors.

## Deploying to Vercel

1. Push changes to GitHub
2. Connect repository to Vercel
3. Vercel will automatically set `VERCEL=1`
4. Build should complete without "fsPath" errors

## Alternative: Use Cloud Storage

For production with better performance, consider migrating to:
- **AWS S3** - Scalable, reliable
- **Vercel Blob** - Simple, integrated with Vercel
- **CloudNary** - Image hosting and transformation
- **Firebase Storage** - Easy to setup

The current solution stores images as base64 in MongoDB, which works but:
- ✅ Works on Vercel
- ✅ No external dependencies
- ⚠️ Increases database size
- ⚠️ Slower image delivery

## Troubleshooting

**Error: "Cannot read properties of undefined..."**
- Check that `VERCEL=1` is set in Vercel environment
- Verify multer configuration is imported correctly
- Check file upload routes include proper middleware

**Images not loading on Vercel**
- Base64 images are served with `data:image/*;base64,...` URIs
- Should display correctly in browsers
- Consider switching to cloud storage for better performance
