const mongoose = require('mongoose');
const schema =mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;

const promotionSchema = new schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: "" 
    },
    price: {
        type: currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: {
    	type: Boolean,
    	default: false
    }
	}, {
    	timestamps: true
    });

var promotions = mongoose.model('promotion', promotionSchema);

module.exports = promotions;

