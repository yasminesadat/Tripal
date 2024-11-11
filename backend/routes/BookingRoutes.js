const express = require('express');
const router = express.Router();
const { bookResource, cancelResource } = require('../controllers/BookingController');

router.post('/:resourceType/:resourceId/book', bookResource);
router.post('/:resourceType/:resourceId/cancel', cancelResource);

module.exports = router;