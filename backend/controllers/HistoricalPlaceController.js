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

  console.log("aa", historicalPeriod)
  console.log("tags", tags)
  try {
    for (let i = 0; i < tags.length; i++) {
      if (tags[i]._id === '') {
        console.log('aaaaaaaaa', tags[i].name);
        const result = await TypeTag.create({ name: tags[i].name });
        const resultData = await result._id;
        console.log("new created tag", resultData);
        tagsID.push(resultData);
      }
      else {
        tagsID.push(tags[i]._id);
      }
    }

    for (let i = 0; i < historicalPeriod.length; i++) {
      console.log("iteration,", i)
      if (historicalPeriod[i]._id === '') {
        console.log("before create", historicalPeriod[i].name)
        const result = await PeriodTag.create({ name: historicalPeriod[i].name });
        const resultData = await result._id;
        console.log("after period create", resultData);
        historicalPeriodsID.push(resultData);
      }
      else {
        historicalPeriodsID.push(historicalPeriod[i]._id);
      }
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

    console.log("tagsss", tagsID)
    console.log("periodss", historicalPeriodsID)
    req.body.images = imageBuffer;
    req.body.tags = tagsID;
    req.body.historicalPeriod = historicalPeriodsID;
    const historicalPlace = await HistoricalPlace.create({
      ...req.body,
      tourismGovernor:req.userId
    });


    historicalPlace
      .save()
      .then((result) =>
        res.status(201).json(result)
      )
      .catch((err) => {
        console.log(err)
        res.status(400).json(err)
      }

      );
  }
  catch (e) {
    console.log("errror", e)

    return res.status(400).json(e);
  }
};



const getHistoricalPlace = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await HistoricalPlace.findById(id).populate("tags").populate("historicalPeriod");
    
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
  const id=req.userId;
  try {
    const historicalPlaces = await HistoricalPlace.find({ tourismGovernor: id }).populate("tags").populate("historicalPeriod");
    res.status(200).json(historicalPlaces);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};



const updateHistoricalPlaces = async (req, res) => {
  const id = req.params.id;
  let imageBuffer = [];
  console.log("body: ", req.body)
  let deletedImages = [...req.body.deletedImages]
  let newImages = [...req.body.images]
  let Requestedtags = [...req.body.tags];
  let RequestedhistoricalPeriod = [...req.body.historicalPeriod];
  let tagsID = [];
  let historicalPeriodsID = [];
  console.log(req.body);
  try {
    for (let i = 0; i < Requestedtags.length; i++) {
      if (Requestedtags[i]._id === '') {
        console.log(Requestedtags[i]);
        const result = await TypeTag.create({ name: Requestedtags[i].name });
        const resultData = await result._id;
        console.log('the new tag ', result, resultData);
        tagsID.push(resultData);
      }

      else {
        tagsID.push(Requestedtags[i]._id);
      }
    }

    for (let i = 0; i < RequestedhistoricalPeriod.length; i++) {
      if (RequestedhistoricalPeriod[i]._id === '') {
        const result = await PeriodTag.create({ name: RequestedhistoricalPeriod[i].name });
        const resultData = await result._id;
        console.log('the new historicalpERIOD', result, resultData);
        historicalPeriodsID.push(resultData);
      }

      else {
        historicalPeriodsID.push(RequestedhistoricalPeriod[i]._id);
      }
    }

    if (newImages.length > 0 || deletedImages.length > 0) {
      const historicalPlace = await HistoricalPlace.findById(id);
      if (!historicalPlace) {
        return res.status(404).json({ msg: "Historical place not found" });
      }
      let existedImages = historicalPlace.images;
      for (let i = 0; i < deletedImages.length; i++) {
        let imageID = deletedImages[i].public_id;
        await cloudinary.uploader.destroy(imageID);
        existedImages = existedImages.filter((image) => image.public_id !== imageID);
        console.log("the old imagess", existedImages)
      }
      for (let i = 0; i < newImages.length; i++) {
        let result = await cloudinary.uploader.upload(newImages[i], { folder: "historicalPlaces" })
        imageBuffer.push(
          {
            public_id: await result.public_id,
            url: await result.secure_url
          }
        );
      }
      req.body.images = imageBuffer.concat(existedImages);
    }
    console.log("tagsss", tagsID);
    console.log("periodss", historicalPeriodsID);
    req.body.tags = tagsID;
    req.body.historicalPeriod = historicalPeriodsID;
    const { tourismGovernor, name, description, images, location, openingHours, ticketPrices, tags, historicalPeriod } = req.body;
    try {
      const result = await HistoricalPlace.findByIdAndUpdate(id, { tourismGovernor, name, description, images, location, openingHours, ticketPrices, tags, historicalPeriod }, { new: true })
      return res.status(200).json(result);
    }
    catch (err) {
      return res.status(400).json(err);
    }
  } catch (e) {
    return res.status(400).json(e);
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

