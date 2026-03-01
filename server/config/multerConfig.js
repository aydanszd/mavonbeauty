const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Detect if running on Vercel (serverless environment)
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// For local development, use disk storage
// For Vercel, use memory storage (temporary)
let storage;

if (isVercel) {
    // Memory storage for Vercel
    console.log('🚀 Using memory storage for Vercel');
    storage = multer.memoryStorage();
} else {
    // Disk storage for local development
    const uploadDir = './uploads/products';
    
    // Ensure uploads directory exists locally
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('✅ Created uploads directory:', uploadDir);
        }
    } catch (err) {
        console.warn('⚠️ Warning: Could not create uploads directory:', err.message);
        console.warn('⚠️ Using memory storage as fallback');
        storage = multer.memoryStorage();
    }

    // Only use disk storage if directory was created successfully
    if (!storage) {
        storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadDir);
            },
            filename: function (req, file, cb) {
                // Generate unique filename: product-1234567890-image.jpg
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
            }
        });
    }
}

// File filter (only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)!'), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Helper function to get file path
const getFilePath = (file) => {
    if (isVercel) {
        // In Vercel, return the buffer and original name
        return {
            filename: file.originalname,
            path: `/api/uploads/${file.originalname}`,
            buffer: file.buffer
        };
    }
    return {
        filename: file.filename,
        path: `/uploads/products/${file.filename}`
    };
};

module.exports = {
    upload,
    getFilePath,
    isVercel
};