const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
/**NOTE :
 * default nilai status code 400
 * NotFoundError (extends dari ClientError) :
 * Custom error yang mengindikasikan eror karena resource yang diminta client tidak ditemukan.
 */
