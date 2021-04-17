const router = require('express').Router();

const {
  getProfileByIdValidator, updateProfileValidator, updateProfileAvatarValidator,
} = require('../middlewares/validation.js');
const {
  getUsers, getProfileById, updateProfile, updateProfileAvatar, getMe,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:id', getProfileByIdValidator, getProfileById);
router.patch('/users/me', updateProfileValidator, updateProfile);
router.patch('/users/me/avatar', updateProfileAvatarValidator, updateProfileAvatar);

module.exports = router;
