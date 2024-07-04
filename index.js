require('dotenv')
const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require('./routers/productRouter');
const userRoutes = require('./routers/user');
const path = require('path');
const cors = require('cors');

const url = process.env.MONGODB_CONNECTION_URI; // Specify the database name

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors())

mongoose.connect(url);
const connect = mongoose.connection;

connect.on('open', () => {
    console.log('connected.....');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/Product', productRoutes);
app.use('/users', userRoutes);

app.listen(8000, () => {
    console.log('server started.....');
});
