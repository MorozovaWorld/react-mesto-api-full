// user validation
const { celebrate, Joi } = require('celebrate');

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email(),
    password: Joi
      .string()
      .required()
      .min(8),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email(),
    password: Joi
      .string()
      .required()
      .min(8),
  }),
});

const getProfileByIdValidator = celebrate({
  params: Joi.object().keys({
    id: Joi
      .string()
      .alphanum()
      .length(24),
  }),
});

const updateProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .alphanum()
      .min(2)
      .max(30),
    about: Joi
      .string()
      .required()
      .alphanum()
      .min(2)
      .max(30),
  }),
});

const updateProfileAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .required()
      .pattern(/^(http|https):\/\/(www\.)?[A-Za-z0-9-]+\.([A-Za-z0-9-]\/)*[A-Za-z](\/([\w#!:[\].?+()$'~*,;=&%@!\-/])*)?#?/),
  }),
});

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30),
    link: Joi
      .string()
      .required()
      .min(2)
      .pattern(/^(http|https):\/\/(www\.)?[A-Za-z0-9-]+\.([A-Za-z0-9-]\/)*[A-Za-z](\/([\w#!:[\].?+()$'~*,;=&%@!\-/])*)?#?/),
  }),
});

const deleteCardValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24),
  }),
});

const likeOrDislikeCardValidator = celebrate({
  params: Joi.object().keys({
    id: Joi
      .string()
      .alphanum()
      .length(24),
  }),
});

module.exports = {
  createUserValidator,
  loginValidator,
  getProfileByIdValidator,
  updateProfileValidator,
  updateProfileAvatarValidator,
  createCardValidator,
  deleteCardValidator,
  likeOrDislikeCardValidator,
};
