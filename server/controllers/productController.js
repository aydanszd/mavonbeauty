const Product = require('../models/Products');
const fs = require('fs');
const path = require('path');
const { isVercel } = require('../config/multerConfig');

// Helper function to get image path/data
const getImageData = (file) => {
    if (isVercel && file.buffer) {
        // For Vercel, convert to base64
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }
    // For local, return file path
    return `/uploads/products/${file.filename}`;
};

// Helper function to delete image files (only for local)
const deleteImageFile = (imagePath) => {
    if (isVercel) {
        // Base64 images don't need to be deleted from filesystem
        return;
    }
    try {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (err) {
        console.warn('⚠️ Warning: Could not delete image file:', err.message);
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { homePage } = req.query;

        let query = {};

        // Filter by homePage if specified
        if (homePage !== undefined) {
            query.homePage = homePage === 'true';
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create product with multiple images
const createProduct = async (req, res) => {
    try {
        const { name, brand, colors, sizes, weight, price, stock, description, homePage } = req.body;

        // Validation
        if (!name || !brand || weight === undefined || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, brand, weight and price'
            });
        }

        // Parse colors and sizes - handle both JSON strings and arrays
        let parsedColors = [];
        let parsedSizes = [];

        try {
            // Try to parse as JSON if it's a string
            if (colors) {
                parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
                // Ensure it's an array
                if (!Array.isArray(parsedColors)) {
                    parsedColors = [parsedColors];
                }
            }

            if (sizes) {
                parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
                // Ensure it's an array
                if (!Array.isArray(parsedSizes)) {
                    parsedSizes = [parsedSizes];
                }
            }
        } catch (parseError) {
            // If JSON parsing fails, treat as single values
            if (colors) parsedColors = [colors];
            if (sizes) parsedSizes = [sizes];
        }

        // Prepare product data
        const productData = {
            name,
            brand,
            colors: parsedColors,
            sizes: parsedSizes,
            weight,
            price,
            stock: stock || 0,
            description: description || '',
            homePage: homePage === 'true' || homePage === true || false
        };

        // Add images if uploaded
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file => getImageData(file));
        }

        console.log('📦 Creating product with data:', productData);

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Error creating product:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Update product with optional new images
const updateProduct = async (req, res) => {
    try {
        const { name, brand, colors, sizes, weight, price, stock, description, homePage } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Parse colors and sizes - handle both JSON strings and arrays
        let parsedColors = [];
        let parsedSizes = [];

        try {
            // Try to parse as JSON if it's a string
            if (colors !== undefined) {
                parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
                // Ensure it's an array
                if (!Array.isArray(parsedColors)) {
                    parsedColors = [parsedColors];
                }
            }

            if (sizes !== undefined) {
                parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
                // Ensure it's an array
                if (!Array.isArray(parsedSizes)) {
                    parsedSizes = [parsedSizes];
                }
            }
        } catch (parseError) {
            // If JSON parsing fails, treat as single values
            if (colors !== undefined) parsedColors = [colors];
            if (sizes !== undefined) parsedSizes = [sizes];
        }

        // Update fields
        if (name) product.name = name;
        if (brand) product.brand = brand;
        if (colors !== undefined) {
            product.colors = parsedColors;
        }
        if (sizes !== undefined) {
            product.sizes = parsedSizes;
        }
        if (weight !== undefined) product.weight = weight;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (description !== undefined) product.description = description;
        if (homePage !== undefined) product.homePage = homePage === 'true' || homePage === true;

        // Add new images if uploaded (don't delete old ones, just append)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => getImageData(file));
            product.images = [...(product.images || []), ...newImages];

            // Limit to 5 images max
            if (product.images.length > 5) {
                // Delete excess old images
                const imagesToDelete = product.images.slice(0, product.images.length - 5);
                imagesToDelete.forEach(img => {
                    deleteImageFile(img);
                });
                product.images = product.images.slice(-5);
            }
        }

        console.log('📦 Updating product with data:', {
            name: product.name,
            colors: product.colors,
            sizes: product.sizes
        });

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Error updating product:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete associated images
        if (product.images && product.images.length > 0) {
            product.images.forEach(img => {
                deleteImageFile(img);
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};

// Delete specific image from product
const deleteProductImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        // Remove image from array
        product.images = product.images.filter(img => img !== imageUrl);

        // Delete image file (only if local storage)
        deleteImageFile(imageUrl);

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete image',
            error: error.message
        });
    }
};

// Get statistics
const getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalStockResult = await Product.aggregate([
            { $group: { _id: null, total: { $sum: '$stock' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalStock: totalStockResult[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    getStats
};