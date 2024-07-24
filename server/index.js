const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB connected')
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => console.log(err));


// // Routes
const userRoutes = require('./routes/userroutes');
const fileRoutes = require('./routes/fileroutes');

app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRoutes);
app.use('/api/files', fileRoutes);
