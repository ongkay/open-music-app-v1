class AlbumsHandler {
  constructor({ albumsService, songsService, validator }) {
    this._albumsService = albumsService
    this._songsService = songsService
    this._validator = validator

    this.postAlbumHandler = this.postAlbumHandler.bind(this)
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this)
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this)
  }

  async postAlbumHandler(request, h) {
    await this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload

    const albumId = await this._albumsService.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    })

    response.code(201)
    return response
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params
    const album = await this._albumsService.getAlbumById(id)
    const songs = await this._songsService.getSongsByAlbumId(id)

    const response = h.response({
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    })

    return response
  }

  async putAlbumByIdHandler(request, h) {
    const { id } = request.params
    await this._validator.validateAlbumPayload(request.payload)
    await this._albumsService.editAlbumById(id, request.payload)

    const response = h.response({
      status: 'success',
      message: 'Album berhasil di update!',
    })

    return response
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params
    await this._albumsService.deleteAlbumById(id)

    const response = h.response({
      status: 'success',
      message: 'Album has beed deleted!',
    })

    return response
  }
}
// semua error headling sdh di satukan dan di pindahkan di file server.js
module.exports = AlbumsHandler
