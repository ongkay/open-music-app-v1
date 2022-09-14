const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  //[1] BUAT FUNGSI ADDNOTE :
  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    //-buat objek query untuk memasukan notes baru ke database
    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt],
    };

    //-mengeksekusi query yang sudah dibuat, akan berjalan secara asynchronous
    const result = await this._pool.query(query);

    //- Jika nilai id tidak undefined, = catatan berhasil dimasukan dan kembalikan fungsi dengan nilai id
    //- Jika tidak maka throw InvariantError.

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  //[2] Membuat Fungsi getNotes
  //- Di dalamnya kita dapatkan seluruh data notes yang ada di database dgn query : “SELECT * FROM notes”
  async getNotes() {
    const result = await this._pool.query('SELECT * FROM notes');
    return result.rows.map(mapDBToModel);
  }

  //[4]BUAT FUNGSI GetNoteById
  //- melakukan query untuk mendapatkan note di dalam database berdasarkan id yang diberikan
  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    //-bila "result.rows" nilainya 0 (false) maka bangkitkan NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    //- Bila "true", maka kembalikan dengan result.rows[0] yang sudah di-mapping dengan fungsi mapDBToModel
    return result.rows.map(mapDBToModel)[0];
  }

  //[5] Fungsi editNoteById
  //- melakukan query untuk mengubah note di dalam database berdasarkan id yang diberikan
  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    //-jika "result.row" nilainya 0(false) maka error, dan jika tru tidak perlu mengembalikan nilai apapun
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  //[6] deleteNoteById
  //-menghapus note di dalam database berdasarkan id yang diberikan
  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;
//Impor ke server.js
