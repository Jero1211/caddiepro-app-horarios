const express = require('express');
const router = express.Router();
const {
  getAllCheckins,
  getCheckinById,
  createCheckin,
  updateCheckin,
  deleteCheckin
} = require('../controllers/checkinController');

router.route('/')
  .get(getAllCheckins)
  .post(createCheckin);

router.route('/:id')
  .get(getCheckinById)
  .put(updateCheckin)
  .delete(deleteCheckin);

module.exports = router;

