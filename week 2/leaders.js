const mongoose = require('mongoose');
const schema = mongoose.Schema;

const leadersSchema = new schema({
	name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
    	type: Boolean,
    	required: true
    }
}, {
    timestamps: true
});