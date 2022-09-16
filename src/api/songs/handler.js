const ClientError = require('../../exceptions/ClientError')

class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postSongHandler = this.postSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload)
      const {
        title = 'untitled',
        year,
        performer,
        genre,
        duration = null,
        albumId = null,
      } = request.payload

      const result = await this._service.addSongs({
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      })

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil di tambahkan',
        data: {
          songId: result,
        },
      })

      response.code(201)
      return response.code(201)
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getSongsHandler({ query }, h) {
    try {
      const { title = '', performer = '' } = query
      const getSongs = await this._service.getSongs({ title, performer })

      return {
        status: 'success',
        data: {
          songs: getSongs,
        },
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { songId } = request.params
      const getSong = await this._service.getSongById(songId)

      return {
        status: 'success',
        data: {
          song: getSong,
        },
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload)
      const { songId } = request.params

      await this._service.editSongById(songId, request.payload)

      return {
        status: 'success',
        message: 'Lagu berhasil di update',
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { songId } = request.params
      await this._service.deleteSongById(songId)

      return {
        status: 'success',
        message: 'Lagu berhasil di hapus',
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = SongsHandler
