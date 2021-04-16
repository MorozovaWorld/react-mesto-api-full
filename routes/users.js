const router = require('express').Router();
const {
  getUsers, getProfileById, updateProfile, updateProfileAvatar, getMe,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:id', getProfileById);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateProfileAvatar);

module.exports = router;
