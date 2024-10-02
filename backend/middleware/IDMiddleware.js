const mongoose = require("mongoose");

const validateIDs = (paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName] || req.body[paramName];
      if (!id) {
        res.status(400);
        throw new Error(`${paramName} is required`);
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error(`Invalid ${paramName}`);
      }
    }
    next();
  };
};

module.exports = validateIDs;
