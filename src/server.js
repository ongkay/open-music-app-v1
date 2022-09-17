require('dotenv').config()

const Hapi = require('@hapi/hapi')
// const Jwt = require('@hapi/jwt')

const ClientError = require('./error/ClientError')

// songs
const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')

// albums
const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

// Server Runing
const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      })

      newResponse.code(response.statusCode)
      return newResponse
    }

    if (response instanceof Error) {
      if (response.isServer) {
        const newResponse = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server.',
        })

        newResponse.code(500)
        console.error(response)
        return newResponse
      }
    }

    return h.continue || response
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
