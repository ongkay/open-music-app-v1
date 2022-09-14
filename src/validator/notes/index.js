const InvariantError = require('../../exceptions/InvariantError');
const { NotePayloadSchema } = require('./schema');

// untuk melakukan validasi dan mengevaluasi apakah validasi itu berhasil atau tidak.
const NotesValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);
    //Jika properti error tidak undefined, maka kita bangkitkan error dengan membawa pesan dari properti validationResult.error.message
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = NotesValidator;

// Selanjutnya, kita akan coba gunakan validator ini pada plugin notes
