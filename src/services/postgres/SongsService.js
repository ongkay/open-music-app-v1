const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDBToModel } = require('../../utils')

class SongsService {
  constructor() {
    this._pool = new Pool()
  }

  async addSongs({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16)

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [`song-${id}`, title, year, performer, genre, duration, albumId],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu Gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getSongs({ title, performer }) {
    const query = `SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER('%${title}%') AND LOWER(performer) LIKE LOWER('%${performer}%')`
    const result = await this._pool.query(query)
    return result.rows
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    return result.rows.map(mapDBToModel)[0]
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      return 'Lagunya belum di input gais'
    }

    return result.rows
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Edit lagu gagal karena ID tidak ditemukan')
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal hapus lagu karena id tidak ditemukan')
    }
  }
}

module.exports = SongsService