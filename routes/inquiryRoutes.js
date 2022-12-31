const router = require('express').Router();
const inquiryController = require('../controllers/inquiryController');

router
  .get('/', inquiryController.getAllInquiries)
  .get('/:userId', inquiryController.getInquiriesByUserId)
  .get('/inquiry/:id', inquiryController.getInquiryById)
  .post('/', inquiryController.createInquiry)
  .put('/:inquiryId', inquiryController.updateInquiryById)
  .delete('/:inquiryId', inquiryController.deleteInquiryById);

module.exports = router;
