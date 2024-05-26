const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    place: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    yearBuilt: { type: Number },
    amenities: [String],
    nearbyFacilities: [String]
});

module.exports = mongoose.model('Property', PropertySchema);
