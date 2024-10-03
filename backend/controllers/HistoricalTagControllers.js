const TypeTag = require('../models/HistoricalTagType.js');
const PeriodTag = require('../models/HistoricalTagPeriod.js');

const createTypeTags = async (req, res) => {
    const { name } = req.body; // Use lowercase 'name' to match the schema

    // Check if 'name' is provided
    if (!name) {
        return res.status(400).json({ error: 'Name is required' }); // Return early if 'name' is not present
    }

    try {
        const createdTypeTag = await TypeTag.create({ name }); // Create the tag with the lowercase variable

        res.status(201).json({ status: 'success', data: { createdTypeTag } }); // Use 201 Created status
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createPeriodTags = async (req, res) => {
    const { name } = req.body; // Use lowercase 'name' to match the schema

    // Check if 'name' is provided
    if (!name) {
        return res.status(400).json({ error: 'Name is required' }); // Return early if 'name' is not present
    }

    try {
        const createdPeriodTag = await PeriodTag.create({ name }); // Create the tag with the lowercase variable

        res.status(201).json({ status: 'success', data: { createdPeriodTag } }); // Use 201 Created status
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getHistTags = async (req, res) => {
    try {
        const typeTags = await TypeTag.find();
        const periodTags = await PeriodTag.find();

        const combinedTags = {
            typeTags,
            periodTags
        };

        if (typeTags.length === 0 && periodTags.length === 0) {
            return res.status(404).json('No tags found');
        }
        res.status(200).json(combinedTags);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching all tags', error });
    }
};




module.exports = { createTypeTags, createPeriodTags , getHistTags };