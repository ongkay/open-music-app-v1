const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;

/**NOTE :
 * InvariantError (extends dari ClientError) :
 * Custom error yang mengindikasikan eror karena kesalahan bisnis logic pada data yang dikirimkan oleh client. -
 * Kesalahan validasi data merupakan salah satu InvariantError.
 */
