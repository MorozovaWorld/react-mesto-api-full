const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const handleUpdateErrors = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: `Произошла ошибка валидации: ${err}` });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'Невалидный id' });
  } else if (err.message === 'NotFound') {
    res.status(404).send({ message: 'Пользователь не найден' });
  } else res.status(500).send({ message: 'Не удалось обновить информацию пользователя: внутренняя ошибка сервера' });
};

const emailAndPasswordValidation = (res, email, password) => {
  if (!email || !password) {
    res.status(400).send({ message: 'Не передан емейл или пароль' });
  }
};

const createUser = (req, res) => {
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
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        res.status(409).send({ message: 'Пользователь с таким емейлом уже зарегистрирован' });
      }
      handleUpdateErrors(err, res);
    });
};

const login = (req, res) => {
  emailAndPasswordValidation(res, req.body.email, req.body.password);

  return User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({ message: 'Запрашиваемый ресурс не найден' }));

const getMe = (req, res) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Нет пользователя с таким id' });
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id' });
    } else res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
  });

const getProfileById = (req, res) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Нет пользователя с таким id' });
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id' });
    } else res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
  });

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => handleUpdateErrors(err, res));
};

const updateProfileAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => handleUpdateErrors(err, res));
};

module.exports = {
  getUsers, getProfileById, createUser, updateProfile, updateProfileAvatar, login, getMe,
};
