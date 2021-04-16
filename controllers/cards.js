const Card = require('../models/card');

const handleIdErrors = (err, res) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Невалидный id' });
  } else if (err.message === 'NotFound') {
    res.status(404).send({ message: 'Карточка не найдена' });
  } else res.status(500).send({ message: 'Внутренняя ошибка сервера' });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(() => res.status(500).send({ message: 'Запрашиваемый ресурс не найден' }));

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка валидации: ${err}` });
      } else res.status(500).send({ message: 'Не удалось создать карточку: внутренняя ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (card.owner._id === req.user._id) {
        res.status(403).send({ message: 'Нет прав доступа к удалению карточки' });
      }

      card.remove();
      res.status(200).send(card);
    })
    .catch((err) => handleIdErrors(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => handleIdErrors(err, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => handleIdErrors(err, res));
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
