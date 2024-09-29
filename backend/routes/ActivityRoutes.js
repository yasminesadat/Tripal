const express = require('express');
const router = express.Router();
const {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');  

router.post('/activities', createActivity);      
router.get('/activities', getActivities);        
router.put('/activities/:id', updateActivity);   
router.delete('/activities/:id', deleteActivity); 

module.exports = router;
