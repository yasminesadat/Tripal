const TypeTag = require('../models/HistoricalTagType.js');
const PeriodTag = require('../models/HistoricalTagPeriod.js');

const createTypeTags = async (req, res) => {
    console.log(req);
    const { name } = req.body; // Use lowercase 'name' to match the schema

    // Check if 'name' is provided
    if (!name) {
        return res.status(400).json({ error: 'Name is required' }); // Return early if 'name' is not present
    }

    try {
        const createdTypeTag = await TypeTag.create({ name }); // Create the tag with the lowercase variable

        res.status(201).json(createdTypeTag); // Use 201 Created status
    } catch (error) {
        res.status(500).json(error);
    }
};


const createPeriodTags = async (req, res) => {
    // //const { name } = req.body; // Use lowercase 'name' to match the schema

    // // Check if 'name' is provided
    // if (!name) {
    //     return res.status(400).json({ error: 'Name is required' }); // Return early if 'name' is not present
    // }

    try {
        const createdPeriodTag = await PeriodTag.create({ ...req.body }); // Create the tag with the lowercase variable

        res.status(201).json(createdPeriodTag); // Use 201 Created status
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHistTags = async (req, res) => {
    try {
        const typeTags = await TypeTag.find();

        // const combinedTags = {
        //     typeTags,
        //     periodTags
        // };

        // if (typeTags.length === 0) {
        //     return res.status(404).json('No tags found');
        // }
        res.status(200).json(typeTags);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all tags', error });
    }
};
const getAllHistoricalPeriod = (req, res) => {
    PeriodTag.find()
        .then((result) => {
            // if (result.length === 0) {
            //     return res.status(404).json('No tags found');
            // }
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