const router = require('express').Router();
const callController = require('../controllers/callController');

router
  .get('/', callController.getAllCalls)
  .get('/my-calls', callController.getCallsByUserId)
  .get('/call/:id', callController.getCallById)
  .post('/', callController.createCall)
  .put('/:callId', callController.updateCallById)
  .delete('/:callId', callController.deleteCallById);

module.exports = router;
