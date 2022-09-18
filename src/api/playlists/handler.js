class playlistsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this)
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this)
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this)
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this)
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistSchema(request.payload)
    const { name } = request.payload

    const { id: credentialId } = request.auth.credentials
    const playlistId = await this._service.addPlaylist(name, credentialId)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan Playlist baru',
      data: {
        playlistId,
      },
    })

    response.code(201)
    return response
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._service.getPlaylists(credentialId)

    return {
      status: 'success',
      data: {
        playlists,
      },
    }
  }

  async deletePlaylistHandler(request) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistOwner(playlistId, credentialId)
    await this._service.deletePlaylistById(playlistId)

    return {
      status: 'success',
      message: 'Berhasil menghapus Playlist',
    }
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistSchema(request.payload)

    const { songId } = request.payload
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, credentialId)
    await this._service.addSongToPlaylist(songId, playlistId)
    await this._service.addPlaylistActivities('add', { playlistId, userId: credentialId, songId })

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil di tambahkan ke playlist',
    })

    response.code(201)
    return response
  }

  async getSongsFromPlaylistHandler(request) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, credentialId)
    const playlistData = await this._service.getPlaylistMappedById(playlistId)
    const songs = await this._service.getSongsInPlaylist(playlistId)

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlistData,
          songs,
        },
      },
    }
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validateDeleteSongFromPlaylistSchema(request.payload)

    const { playlistId } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, credentialId)
    await this._service.deleteSongFromPlaylistBySongId(songId)
    await this._service.addPlaylistActivities('delete', { playlistId, userId: credentialId, songId })

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    }
  }

  async getPlaylistActivitiesHandler(request) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, credentialId)
    const activities = await this._service.getHistoryByPlaylistId(playlistId)

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    }
  }
}

module.exports = playlistsHandler
