const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../error/InvariantError')
const NotFoundError = require('../../error/NotFoundError')

class AlbumsService {
  constructor() {
    this._pool = new Pool()
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbums() {
    const result = this._pool.query('SELECT * FROM albums WHERE title LIKE ')
    return result.rows
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Album Tidak ditemukan')
    }

    return result.rows[0]
  }

  async getAlbumByIdWithSongs(id) {
    const query = {
      text: `
        SELECT songs.id, songs.title, songs.performer FROM albums
        LEFT JOIN songs ON songs.album_id = albums.id
        WHERE albums.id = $1`,
      values: [id],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Cannot find album ID!')
    }

    return result.rows
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Gagal Update Album. Id tidak ditemukan')
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = AlbumsService
