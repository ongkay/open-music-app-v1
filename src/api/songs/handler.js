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
    this._validator.validateSongPayload(request.payload)
    const { albumId = null } = request.payload

    const songId = await this._service.addSongs({
      ...request.payload,
      albumId,
    })

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil di tambahkan',
      data: {
        songId,
      },
    })

    response.code(201)
    return response.code(201)
  }

  async getSongsHandler(request) {
    const { title = '', performer = '' } = request.query
    const songs = await this._service.getSongs({ title, performer })

    return {
      status: 'success',
      data: {
        songs,
      },
    }
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params
    const song = await this._service.getSongById(songId)

    return {
      status: 'success',
      data: {
        song,
      },
    }
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload)
    const { songId } = request.params

    await this._service.editSongById(songId, request.payload)

    return {
      status: 'success',
      message: 'Lagu berhasil di update',
    }
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params
    await this._service.deleteSongById(songId)

    return {
      status: 'success',
      message: 'Lagu berhasil di hapus',
    }
  }
}

module.exports = SongsHandler
