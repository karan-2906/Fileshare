const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    visibility: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);