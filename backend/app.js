require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const usersControllers = require('./controllers/users.js');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler.js');
const { createUserValidator, loginValidator } = require('./middlewares/validation.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const { options } = require('./middlewares/cors.js');
const { rateLimiter } = require('./middlewares/rateLimiter.js');
const Err404NotFound = require('./errors/Err404NotFound');

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestonew', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  // eslint-disable-next-line no-console
  .then(() => console.log('connected to DB'));

app.use('*', cors(options));
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', createUserValidator, usersControllers.createUser);
app.post('/signin', loginValidator, usersControllers.login);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  throw new Err404NotFound('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
