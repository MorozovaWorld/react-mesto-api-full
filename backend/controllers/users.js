const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Err400BadRequest = require('../errors/Err400BadRequest');
const Err401Unauthorized = require('../errors/Err401Unauthorized');
const Err404NotFound = require('../errors/Err404NotFound');
const Err409Conflict = require('../errors/Err409Conflict');
const Err500 = require('../errors/Err500');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const handleGetUserErrors = (err, res, next) => {
  if (err.message === 'Not Found') {
    const notFoundError = new Err404NotFound('Пользователь не найден');
    next(notFoundError);
  }
  if (err.name === 'CastError') {
    const badIdError = new Err400BadRequest('Некорректный id');
    next(badIdError);
  } else {
    const OtherError = new Err500('Внутренняя ошибка сервера');
    next(OtherError);
  }
};

const handleUpdateErrors = (err, res, next) => {
  if (err.name === 'ValidationError') {
    const validationError = new Err400BadRequest(`Произошла ошибка валидации: ${err}`);
    next(validationError);
  }
  if (err.name === 'CastError') {
    const badIdError = new Err400BadRequest('Невалидный id');
    next(badIdError);
  }
  if (err.message === 'Not Found') {
    const notFoundError = new Err404NotFound('Пользователь не найден');
    next(notFoundError);
  } else {
    const OtherError = new Err500('Не удалось обновить информацию пользователя: внутренняя ошибка сервера');
    next(OtherError);
  }
};

const emailAndPasswordValidation = (email, password) => {
  if (!email || !password) {
    throw new Err400BadRequest('Не передан емейл или пароль');
  }
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  emailAndPasswordValidation(res, email, password);

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        const ConflictError = new Err409Conflict('Пользователь с таким емейлом уже зарегистрирован');
        next(ConflictError);
      } else {
        const OtherErr = new Err500('Не удалось зарегистрировать полязователя, внутренняя ошибка сервера');
        next(OtherErr);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  emailAndPasswordValidation(email, password);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.status(200).send({ token });
    })
    .catch((err) => {
      const UnauthorizedError = new Err401Unauthorized(err.message);
      next(UnauthorizedError);
    });
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => {
    const OtherError = new Err500('Запрашиваемый ресурс не найден');
    next(OtherError);
  });

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => handleGetUserErrors(err, res, next));
};

const getProfileById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => handleGetUserErrors(err, res, next));
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => handleUpdateErrors(err, res, next));
};

const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('Not Found');
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => handleUpdateErrors(err, res, next));
};

module.exports = {
  getUsers, getProfileById, createUser, updateProfile, updateProfileAvatar, login, getMe,
};
