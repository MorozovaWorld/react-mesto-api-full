require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const usersControllers = require('./controllers/users.js');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const auth = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestonew', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  // eslint-disable-next-line no-console
  .then(() => console.log('connected to DB'));

app.use(helmet());
app.use(bodyParser.json());

app.post('/signup', usersControllers.createUser);
app.post('/signin', usersControllers.login);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
