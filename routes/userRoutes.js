const router = require('express').Router();
const userController = require('./../controllers/userController');

router
  .get('/', userController.getMe)
  .get('/all', userController.getAllUsers)
  .get('/:userId', userController.getUserById)
  .put('/:userId', userController.updateUserProfile)
  .put('/', userController.updateMyProfile)
  .patch('/', userController.updateMyPassword)
  .delete('/:userId', userController.deleteUser);

module.exports = router;
