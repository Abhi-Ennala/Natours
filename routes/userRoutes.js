const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

// router.param('id', userController.checkID);

router
  .route('/')
  .get(userController.getAllusers)
  .post(userController.createUser);
router
  .route('/:id')
  .patch(userController.updateUser)
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
