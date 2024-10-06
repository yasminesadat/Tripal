const express = require('express');
const router = express.Router();
const {createActivity, getAdvertiserActivities, updateActivity, deleteActivity, addRating, viewUpcomingActivities} = require('../controllers/ActivityController');  

router.get('/activities/advertiser/:id', getAdvertiserActivities); 
router.post('/activities', createActivity);    
router.put('/activities/:id', updateActivity); 
router.post('/activityRating/:id', addRating);   
router.delete('/activities/:id', deleteActivity); 
router.get('/activities/view', viewUpcomingActivities);

module.exports = router;