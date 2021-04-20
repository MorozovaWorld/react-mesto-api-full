const router = require('express').Router();

const {
  createCardValidator, deleteCardValidator, likeOrDislikeCardValidator,
} = require('../middlewares/validation.js');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCardValidator, createCard);
router.delete('/cards/:cardId', deleteCardValidator, deleteCard);
router.put('/cards/likes/:cardId', likeOrDislikeCardValidator, likeCard);
router.delete('/cards/likes/:cardId', likeOrDislikeCardValidator, dislikeCard);

module.exports = router;
