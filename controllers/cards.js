const Card = require('../models/card');
const Err400BadRequest = require('../errors/Err400BadRequest');
const Err403Forbidden = require('../errors/Err403Forbidden');
const Err404NotFound = require('../errors/Err404NotFound');
const Err500 = require('../errors/Err500');

const handleIdErrors = (err, res, next) => {
  if (err.name === 'CastError') {
    const badIdError = new Err400BadRequest('Невалидный id');
    next(badIdError);
  } else if (err.message === 'NotFound') {
    const notFoundError = new Err404NotFound('Карточка не найдена');
    next(notFoundError);
  } else if (err.message === 'Forbidden') {
    const forbiddenError = new Err403Forbidden('Нет прав доступа к удалению карточки');
    next(forbiddenError);
  } else {
    const OtherError = new Err500('Внутренняя ошибка сервера');
    next(OtherError);
  }
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(() => {
    const OtherError = new Err500('Запрашиваемый ресурс не найден');
    next(OtherError);
  });

const createCard = (req, res, next) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ValidationError = new Err400BadRequest(`Произошла ошибка валидации: ${err}`);
        next(ValidationError);
      } else {
        const OtherError = new Err500('Внутренняя ошибка сервера');
        next(OtherError);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (card.owner._id !== req.user._id) {
        throw new Error('Forbidden');
      }
      card.remove();
      res.status(200).send(card);
    })
    .catch((err) => handleIdErrors(err, res, next));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => handleIdErrors(err, res, next));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => handleIdErrors(err, res, next));
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
