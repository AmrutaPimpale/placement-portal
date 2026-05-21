const express = require('express');
const router = express.Router();
const {
  releaseOffer,
  getOffers,
  updateOfferStatus
} = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('recruiter', 'coordinator', 'admin'), releaseOffer)
  .get(protect, getOffers);

router.route('/:id/status')
  .put(protect, updateOfferStatus);

module.exports = router;
