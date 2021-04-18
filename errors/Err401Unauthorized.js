class Err401Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = Err401Unauthorized;
