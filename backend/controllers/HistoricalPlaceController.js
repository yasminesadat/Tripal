const HistoricalPlace = require("../models/HistoricalPlace");

const createHistoricalPlace = (req, res) => {
  const historicalPlace = new HistoricalPlace(req.body);
  historicalPlace
    .save()
    .then((result) => {
      res.status(201).json(result);
      //res.redirect(); redirect to the previous page
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

// const historical_place_create_get = (req, res) => {
//   //render the create page
// };

const getHistoricalPlace = (req, res) => {
  const id = req.params.id;
  HistoricalPlace.findById(id)
    .then((result) => {
      res.status(200).json(result);
      //render the detail page with passing the details
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
const deleteHistoricalPlace = (req, res) => {
  const id = req.params.id;
  HistoricalPlace.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({ msg: "Document is deleted successfully" });
      //render the previous /current page without this item
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
const getAllHistoricalPlaces = (req, res) => {
  HistoricalPlace.find()
    .then((result) => {
      res.status(200).json(result);
      // render the all historical view place and pass the result (array of historical places)
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
const updateHistoricalPlaces = (req, res) => {
  const id = req.params.id;
  const { updates } = req.body;
  HistoricalPlace.findByIdAndUpdate(id, updates, { new: true })
    .then((result) => {
      res.status(200).json(result);
      //i think we need to render the changes in the same page
      //or redirect to the page with the updates
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
module.exports = {
  createHistoricalPlace,
  getHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  updateHistoricalPlaces
};
