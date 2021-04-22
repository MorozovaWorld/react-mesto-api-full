const options = {
  origin: [
    'http://localhost:3000',
    'http://mesto-morozova.students.nomoredomains.icu',
    'https://mesto-morozova.students.nomoredomains.icu',
    'https://morozovaworld.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

module.exports = { options };
