const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

    User.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'Пользователь не существует' });
        }
        return payload;
      })
      .catch((err) => {
        res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
      });
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
