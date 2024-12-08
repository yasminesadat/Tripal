const TypeTag = require('../models/HistoricalTagType.js');
const PeriodTag = require('../models/HistoricalTagPeriod.js');

const createTypeTags = async (req, res) => {
    const { name } = req.body; 
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const createdTypeTag = await TypeTag.create({ name }); 
        res.status(201).json(createdTypeTag); 
    } catch (error) {
        res.status(500).json(error);
    }
};


const createPeriodTags = async (req, res) => {
    try {
        const createdPeriodTag = await PeriodTag.create({ ...req.body }); 
        res.status(201).json(createdPeriodTag); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHistTags = async (req, res) => {
    try {
        const typeTags = await TypeTag.find();
        res.status(200).json(typeTags);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all tags', error });
    }
};

const getAllHistoricalPeriod = (req, res) => {
    PeriodTag.find()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(400).json({ message: 'Error fetching period tags', err });
        })

}

const getHistTagById = (req, res) => {
    const id = req.params.id;
    TypeTag.findById(id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
}

const getHistPeriodById = (req, res) => {
    const id = req.params.id;
    PeriodTag.findById(id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
}

module.exports = { createTypeTags, createPeriodTags, getHistTags, getAllHistoricalPeriod, getHistPeriodById, getHistTagById };