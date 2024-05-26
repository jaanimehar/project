const express = require('express');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

const router = express.Router();

// Create property
router.post('/', auth, async (req, res) => {
    try {
        const property = new Property({ ...req.body, userId: req.user.id });
        await property.save();
        res.status(201).json(property);
    } catch (err) {
        res.status(400).json({ message: 'Error creating property.', error: err.message });
    }
});

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching properties.', error: err.message });
    }
});

// Get properties by user
router.get('/user', auth, async (req, res) => {
    try {
        const properties = await Property.find({ userId: req.user.id });
        res.json(properties);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching user properties.', error: err.message });
    }
});

// Update property
router.put('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
        if (!property) return res.status(404).json({ message: 'Property not found.' });
        res.json(property);
    } catch (err) {
        res.status(400).json({ message: 'Error updating property.', error: err.message });
    }
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!property) return res.status(404).json({ message: 'Property not found.' });
        res.json({ message: 'Property deleted successfully.' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting property.', error: err.message });
    }
});

module.exports = router;
