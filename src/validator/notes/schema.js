const Joi = require('joi');

const NotePayloadSchema = Joi.object({
  title: Joi.string().required(), //[1]
  body: Joi.string().required(), //[2]
  tags: Joi.array().items(Joi.string()).required(), //[3]
});

module.exports = { NotePayloadSchema };

/**spesifikasi dari objek notes :
 * [1] Wajib memiliki properti title dengan tipe string dan tidak boleh kosong.
 * [2] Wajib memiliki properti body dengan tipe string dan tidak boleh kosong.
 * [3] Wajib memiliki properti tags yang merupakan array dari string.
 * */
