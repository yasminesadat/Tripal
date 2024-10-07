const HistoricalPlace = require("../models/HistoricalPlace");
const cloudinary = require('../cloudinary');
const HistoricalTagsController = require("../controllers/HistoricalTagController");
const TypeTag = require('../models/HistoricalTagType.js');
const PeriodTag = require('../models/HistoricalTagPeriod.js');
function isObjectId(id) {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (objectIdPattern.test(id)) {
    return true;
  }
  else {
    return false;
  }

}
const createHistoricalPlace = async (req, res) => {
  let images = [...req.body.images];
  let imageBuffer = [];
  let tags = [...req.body.tags];
  let historicalPeriod = [...req.body.historicalPeriod];
  let tagsID = [];
  let historicalPeriodsID = [];
  console.log(req.body);
  try {
    for (let i = 0; i < tags.length; i++) {
      if (!isObjectId(tags[i])) {
        console.log(tags[i]);
        const result = await TypeTag.create({ name:tags[i] });
         const resultData=await result._id;
        console.log(resultData);
        tagsID.push(resultData);
      }

      else {
        tagsID.push(tags[i]);
      }
    }
  } catch (err) {
    console.log("in cataaah tagg")
    res.status(400).json(err);
  }
  try {
    for (let i = 0; i < historicalPeriod.length; i++) {
      if (!isObjectId(historicalPeriod[i])) {
        const result = await PeriodTag.create({ name:historicalPeriod[i] }); 
        const resultData = await result._id;
        console.log(resultData);
        historicalPeriodsID.push(resultData);
      }

      else {
        historicalPeriodsID.push(historicalPeriod[i]);
      }
    }
  } catch (error) {
    console.log("in cataaah")
    res.status(400).json(err);
  }
try{
  for (let i = 0; i < images.length; i++) {
    let result = await cloudinary.uploader.upload(images[i], { folder: "historicalPlaces" })
    imageBuffer.push(
      {
        public_id: await result.public_id,
        url: await result.secure_url
      }
    );
  }
}catch(e){
  res.status(400).json(err);
}
  console.log("tagsss", tagsID)
  console.log("periodss", historicalPeriodsID)
  req.body.images = imageBuffer;
  req.body.tags = tagsID;
  req.body.historicalPeriod = historicalPeriodsID;
  const historicalPlace = await HistoricalPlace.create({
    ...req.body
  });
  historicalPlace
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};



const getHistoricalPlace = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await HistoricalPlace.findById(id).populate("tags").populate("historicalPeriod");
    if (result === null) {
      return res.status(404).json({ msg: "Historical place not found" });
    }
    return res.status(200).json(result);
  }
  catch (err) {
    return res.status(400).json(err);
  }
};

const deleteHistoricalPlace = async (req, res) => {
  const id = req.params.id;
  try {
    const historicalPlace = await HistoricalPlace.findById(id);
    if (!historicalPlace) {
      return res.status(404).json({ msg: "Historical place not found" });
    }
    const images = historicalPlace.images;
    for (let i = 0; i < images.length; i++) {
      const imageID = images[i].public_id;
      await cloudinary.uploader.destroy(imageID)
    }

    const result = await HistoricalPlace.findByIdAndDelete(id)
    res.status(200).json({ msg: "Document is deleted successfully" });

  } catch (err) {
    res.status(400).json(err);
  };
};

const getAllHistoricalPlaces = (req, res) => {
  HistoricalPlace.find().populate("tags").populate("historicalPeriod")
    .then((result) => {
      res.status(200).json(result);
      // render the all historical view place and pass the result (array of historical places)
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// const getTourismGovernerHistoricalPlaces = async (req, res) => {
//   const { id: tourismGovernerID } = req.params;
//   try{
//     //const historicalPlaces = await HistoricalPlace.find({ tourismGovernor: touridmGovernerID });
//     const historicalPlaces = await HistoricalPlace.find({ tourismGovernor: mongoose.Types.ObjectId(tourismGovernerID) });
//     res.status(200).json(historicalPlaces);
//   }catch(error){
//     res.status(400).json({ error: error.message })
//   }
// };

const getTourismGovernerHistoricalPlaces = async (req, res) => {
  const { id } = req.params;
  try {
    const historicalPlaces = await HistoricalPlace.find({ tourismGovernor: id }).populate("tags").populate("historicalPeriod");
    res.status(200).json(historicalPlaces);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const updateHistoricalPlaces = async (req, res) => {
  const id = req.params.id;
  let images = [...req.body.images];
  let imageBuffer = [];
  console.log("body: ", req.body)
  if (images.length > 0) {
    const historicalPlace = await HistoricalPlace.findById(id);
    if (!historicalPlace) {
      return res.status(404).json({ msg: "Historical place not found" });
    }
    const images = historicalPlace.images;
    for (let i = 0; i < images.length; i++) {
      const imageID = images[i].public_id;
      await cloudinary.uploader.destroy(imageID)
    }
    for (let i = 0; i < images.length; i++) {
      let result = await cloudinary.uploader.upload(images[i], { folder: "historicalPlaces" })
      imageBuffer.push(
        {
          public_id: await result.public_id,
          url: await result.secure_url
        }
      );
    }
    req.body.images = imageBuffer;
  }
  const updates = req.body;
  try {
    const result = await HistoricalPlace.findByIdAndUpdate(id, updates, { new: true })
    res.status(200).json(result);
    //i think we need to render the changes in the same page
    //or redirect to the page with the updates
  }
  catch (err) {
    res.status(400).json(err);
  }
};
module.exports = {
  createHistoricalPlace,
  getHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  getTourismGovernerHistoricalPlaces,
  updateHistoricalPlaces
};
