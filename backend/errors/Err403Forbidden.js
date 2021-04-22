class Err403Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Err403Forbidden;
