const mongoose = require("mongoose");

const validateID = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName] || req.body[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`Invalid ${paramName}`);
    }
    next();
  };
};

module.exports = validateID;
