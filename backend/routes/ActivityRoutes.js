const express = require('express');
const router = express.Router();
const {createActivity, getAdvertiserActivities, updateActivity, deleteActivity, searchActivities, viewUpcomingActivities, filterUpcomingActivities, sortUpcomingActivities} = require('../controllers/ActivityController');  

router.get('/activities/advertiser/:id', getAdvertiserActivities); 
router.post('/activities', createActivity);    
router.put('/activities/:id', updateActivity);   
router.delete('/activities/:id', deleteActivity); 
router.get('/activities/search', searchActivities);
router.get('/activities/view', viewUpcomingActivities);
router.get('/activities/filter', filterUpcomingActivities);
router.get('/activities/sort', sortUpcomingActivities);

module.exports = router;