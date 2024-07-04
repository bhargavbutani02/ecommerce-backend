const express = require('express');
const Product = require('../models/productmodel');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

const uploadsDir = path.join(__dirname, '../uploads'); // Path to uploads directory
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); // Create uploads directory if it doesn't exist
}

router.post('/', upload.array('images', 10), async (req, res) => { // upload handle multiple files
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ status: false, message: 'No files uploaded' });
    }

    try {
        const { description, discount, price,mrp } = req.body;
        const files = req.files;
        const imagePromises = files.map(async file => {
            const imagePath = `uploads/${file.filename}`; // Get full path of the uploaded file
            const newImage = new Product({
                images: imagePath,
                description: description,
                discount: discount,
                price: price,
                mrp: mrp,
            });
            await newImage.save();
            return newImage;
        });

        const savedImages = await Promise.all(imagePromises);

        res.status(200).json({ status: true, message: 'Images uploaded successfully', images: savedImages });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to save images to database', error });
    }
});

// Endpoint to get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
