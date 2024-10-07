const HistoricalPlace = require("../models/HistoricalPlace");
const cloudinary=require('../cloudinary');
const createHistoricalPlace =async (req, res) => {
  let images=[... req.body.images];
  let imageBuffer=[];
  for(let i=0;i<images.length;i++){
     let result =await cloudinary.uploader.upload(images[i],{folder:"historicalPlaces"})
       imageBuffer.push(
         {
           public_id:await result.public_id,
           url:await result.secure_url
         }
     );
  }
  req.body.images=imageBuffer;
  const historicalPlace = new HistoricalPlace(req.body);
  historicalPlace
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};



const getHistoricalPlace = (req, res) => {
  const id = req.params.id;
  HistoricalPlace.findById(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const deleteHistoricalPlace =async (req, res) => {
  const id = req.params.id;
  const historicalPlace= HistoricalPlace.findById(id);
  const images=historicalPlace.images;
  for(let i=0;i<images.length;i++){
    const imageID=images[i].public_id;
    await cloudinary.uploader.destroy(imageID)
  }
  HistoricalPlace.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({ msg: "Document is deleted successfully" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getAllHistoricalPlaces = (req, res) => {
  HistoricalPlace.find()
    .populate('tags')   
    .populate('historicalPeriod')
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
  const { tourismGovernorID } = req.params.id;
  try{
    const historicalPlaces = await HistoricalPlace.find({ tourismGovernor: tourismGovernorID });
    res.status(200).json(historicalPlaces);
  }catch(error){
    res.status(400).json({ error: error.message })
  }
};

const updateHistoricalPlaces = (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  HistoricalPlace.findByIdAndUpdate(id, updates, { new: true })
    .then((result) => {
      res.status(200).json(result);
      //i think we need to render the changes in the same page
      //or redirect to the page with the updates
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
module.exports = {
  createHistoricalPlace,
  getHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  getTourismGovernerHistoricalPlaces,
  updateHistoricalPlaces
};
