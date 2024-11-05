const express = require("express");
const router = express.Router();
const { requestAccountDeletion } = require("../controllers/accountDeletionController");

router.post("/request-deletion/:role/:userId", requestAccountDeletion);

module.exports = router;
